from datetime import datetime, timezone
import json
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import (
    create_access_token,
    get_current_admin,
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models import (
    AdminUser,
    Campaign,
    ContactMessage,
    Donation,
    HeroSlide,
    MediaVideo,
    Post,
    SiteSetting,
    TeamMember,
    Volunteer,
)
from app.schemas import (
    AdminCreateRequest,
    AdminLoginRequest,
    AdminOut,
    AdminPasswordUpdateRequest,
    CampaignBase,
    CampaignOut,
    ContactMessageOut,
    ContactMessageStatusUpdate,
    DonationOut,
    DonationStatusUpdate,
    HeroSlideBase,
    HeroSlideOut,
    MediaVideoBase,
    MediaVideoOut,
    PostBase,
    PostOut,
    SiteSettingsPayload,
    TeamMemberBase,
    TeamMemberOut,
    TokenResponse,
    VolunteerOut,
    VolunteerStatusUpdate,
)

router = APIRouter(prefix="/api/admin", tags=["Admin"])


# --- Authentication ---
@router.post("/auth/login", response_model=TokenResponse)
async def admin_login(
    payload: AdminLoginRequest,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    res = await db.execute(
        select(AdminUser).where(func.lower(AdminUser.email) == payload.email.lower().strip())
    )
    admin = res.scalar_one_or_none()
    if not admin or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="ভুল ইমেইল অথবা পাসওয়ার্ড (Invalid credentials)")
    if not admin.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")

    token = create_access_token(admin.id, admin.email, admin.role)
    return TokenResponse(access_token=token, admin=AdminOut.model_validate(admin))


@router.get("/auth/me", response_model=AdminOut)
async def admin_me(current_admin: AdminUser = Depends(get_current_admin)) -> AdminUser:
    return current_admin


@router.put("/auth/password")
async def update_admin_password(
    payload: AdminPasswordUpdateRequest,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    if not verify_password(payload.current_password, current_admin.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    current_admin.password_hash = hash_password(payload.new_password)
    await db.commit()
    return {"message": "Password updated successfully"}


# --- Dashboard Overview ---
@router.get("/dashboard")
async def admin_dashboard(
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    total_raised = (
        await db.execute(
            select(func.coalesce(func.sum(Donation.amount), 0.0)).where(
                Donation.status == "completed"
            )
        )
    ).scalar_one()

    completed_donations_count = (
        await db.execute(
            select(func.count(Donation.id)).where(Donation.status == "completed")
        )
    ).scalar_one()

    pending_donations_count = (
        await db.execute(
            select(func.count(Donation.id)).where(Donation.status == "pending")
        )
    ).scalar_one()

    campaigns_count = (
        await db.execute(
            select(func.count(Campaign.id)).where(Campaign.is_active.is_(True))
        )
    ).scalar_one()

    volunteers_pending = (
        await db.execute(
            select(func.count(Volunteer.id)).where(Volunteer.status == "pending")
        )
    ).scalar_one()

    volunteers_total = (
        await db.execute(select(func.count(Volunteer.id)))
    ).scalar_one()

    unread_messages = (
        await db.execute(
            select(func.count(ContactMessage.id)).where(ContactMessage.status == "unread")
        )
    ).scalar_one()

    posts_count = (await db.execute(select(func.count(Post.id)))).scalar_one()

    recent_donations_res = await db.execute(
        select(Donation).order_by(desc(Donation.created_at)).limit(8)
    )
    recent_donations = [
        DonationOut.model_validate(d) for d in recent_donations_res.scalars().all()
    ]

    top_campaigns_res = await db.execute(
        select(Campaign).order_by(desc(Campaign.raised_amount)).limit(6)
    )
    top_campaigns = [
        CampaignOut.model_validate(c) for c in top_campaigns_res.scalars().all()
    ]

    method_breakdown_res = await db.execute(
        select(Donation.payment_method, func.count(Donation.id), func.coalesce(func.sum(Donation.amount), 0.0))
        .where(Donation.status == "completed")
        .group_by(Donation.payment_method)
    )
    payment_breakdown = [
        {"method": row[0], "count": row[1], "total": float(row[2])}
        for row in method_breakdown_res.all()
    ]

    return {
        "kpis": {
            "total_raised": float(total_raised),
            "completed_donations": completed_donations_count,
            "pending_donations": pending_donations_count,
            "active_campaigns": campaigns_count,
            "volunteers_pending": volunteers_pending,
            "volunteers_total": volunteers_total,
            "unread_messages": unread_messages,
            "posts_count": posts_count,
        },
        "recent_donations": recent_donations,
        "top_campaigns": top_campaigns,
        "payment_breakdown": payment_breakdown,
    }


# --- Campaigns CRUD ---
@router.get("/campaigns", response_model=list[CampaignOut])
async def admin_list_campaigns(
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> list[Campaign]:
    res = await db.execute(
        select(Campaign).order_by(Campaign.sort_order.asc(), Campaign.id.asc())
    )
    return list(res.scalars().all())


@router.post("/campaigns", response_model=CampaignOut)
async def admin_create_campaign(
    payload: CampaignBase,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> Campaign:
    existing = await db.execute(select(Campaign).where(Campaign.slug == payload.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Slug already exists")
    campaign = Campaign(**payload.model_dump())
    db.add(campaign)
    await db.commit()
    await db.refresh(campaign)
    return campaign


@router.put("/campaigns/{campaign_id}", response_model=CampaignOut)
async def admin_update_campaign(
    campaign_id: int,
    payload: CampaignBase,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> Campaign:
    res = await db.execute(select(Campaign).where(Campaign.id == campaign_id))
    campaign = res.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    dup = await db.execute(
        select(Campaign).where(Campaign.slug == payload.slug, Campaign.id != campaign_id)
    )
    if dup.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Another campaign already uses this slug")

    for k, v in payload.model_dump().items():
        setattr(campaign, k, v)
    await db.commit()
    await db.refresh(campaign)
    return campaign


@router.delete("/campaigns/{campaign_id}")
async def admin_delete_campaign(
    campaign_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    res = await db.execute(select(Campaign).where(Campaign.id == campaign_id))
    campaign = res.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    await db.delete(campaign)
    await db.commit()
    return {"message": "Campaign deleted"}


# --- Donations Management ---
@router.get("/donations", response_model=list[DonationOut])
async def admin_list_donations(
    status: str | None = None,
    search: str | None = None,
    limit: int = Query(default=100, le=500),
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> list[Donation]:
    stmt = select(Donation)
    if status and status != "all":
        stmt = stmt.where(Donation.status == status)
    if search:
        q = f"%{search.strip()}%"
        stmt = stmt.where(
            or_(
                Donation.receipt_no.ilike(q),
                Donation.donor_name.ilike(q),
                Donation.donor_phone.ilike(q),
                Donation.transaction_id.ilike(q),
                Donation.campaign_title_bn.ilike(q),
            )
        )
    stmt = stmt.order_by(desc(Donation.created_at)).limit(limit)
    res = await db.execute(stmt)
    return list(res.scalars().all())


@router.put("/donations/{donation_id}/status", response_model=DonationOut)
async def admin_update_donation_status(
    donation_id: int,
    payload: DonationStatusUpdate,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> Donation:
    res = await db.execute(select(Donation).where(Donation.id == donation_id))
    donation = res.scalar_one_or_none()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    old_status = donation.status
    new_status = payload.status

    if donation.campaign_id and old_status != new_status:
        camp_res = await db.execute(
            select(Campaign).where(Campaign.id == donation.campaign_id)
        )
        campaign = camp_res.scalar_one_or_none()
        if campaign:
            if old_status != "completed" and new_status == "completed":
                campaign.raised_amount = round(
                    (campaign.raised_amount or 0.0) + donation.amount, 2
                )
                campaign.donor_count = (campaign.donor_count or 0) + 1
            elif old_status == "completed" and new_status != "completed":
                campaign.raised_amount = max(
                    0.0, round((campaign.raised_amount or 0.0) - donation.amount, 2)
                )
                campaign.donor_count = max(0, (campaign.donor_count or 0) - 1)

    donation.status = new_status
    if payload.transaction_id is not None:
        donation.transaction_id = payload.transaction_id
    if payload.note is not None:
        donation.note = payload.note
    if new_status == "completed" and not donation.verified_at:
        donation.verified_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(donation)
    return donation


@router.delete("/donations/{donation_id}")
async def admin_delete_donation(
    donation_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    res = await db.execute(select(Donation).where(Donation.id == donation_id))
    donation = res.scalar_one_or_none()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    await db.delete(donation)
    await db.commit()
    return {"message": "Donation deleted"}


# --- Hero Slides CRUD ---
@router.get("/slides", response_model=list[HeroSlideOut])
async def admin_list_slides(
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> list[HeroSlide]:
    res = await db.execute(
        select(HeroSlide).order_by(HeroSlide.sort_order.asc(), HeroSlide.id.asc())
    )
    return list(res.scalars().all())


@router.post("/slides", response_model=HeroSlideOut)
async def admin_create_slide(
    payload: HeroSlideBase,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> HeroSlide:
    slide = HeroSlide(**payload.model_dump())
    db.add(slide)
    await db.commit()
    await db.refresh(slide)
    return slide


@router.put("/slides/{slide_id}", response_model=HeroSlideOut)
async def admin_update_slide(
    slide_id: int,
    payload: HeroSlideBase,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> HeroSlide:
    res = await db.execute(select(HeroSlide).where(HeroSlide.id == slide_id))
    slide = res.scalar_one_or_none()
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    for k, v in payload.model_dump().items():
        setattr(slide, k, v)
    await db.commit()
    await db.refresh(slide)
    return slide


@router.delete("/slides/{slide_id}")
async def admin_delete_slide(
    slide_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    res = await db.execute(select(HeroSlide).where(HeroSlide.id == slide_id))
    slide = res.scalar_one_or_none()
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    await db.delete(slide)
    await db.commit()
    return {"message": "Slide deleted"}


# --- Posts CRUD ---
@router.get("/posts", response_model=list[PostOut])
async def admin_list_posts(
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> list[Post]:
    res = await db.execute(select(Post).order_by(desc(Post.published_at), desc(Post.id)))
    return list(res.scalars().all())


@router.post("/posts", response_model=PostOut)
async def admin_create_post(
    payload: PostBase,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> Post:
    dup = await db.execute(select(Post).where(Post.slug == payload.slug))
    if dup.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Post slug already exists")
    post = Post(**payload.model_dump())
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post


@router.put("/posts/{post_id}", response_model=PostOut)
async def admin_update_post(
    post_id: int,
    payload: PostBase,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> Post:
    res = await db.execute(select(Post).where(Post.id == post_id))
    post = res.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    for k, v in payload.model_dump().items():
        setattr(post, k, v)
    await db.commit()
    await db.refresh(post)
    return post


@router.delete("/posts/{post_id}")
async def admin_delete_post(
    post_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    res = await db.execute(select(Post).where(Post.id == post_id))
    post = res.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    await db.delete(post)
    await db.commit()
    return {"message": "Post deleted"}


# --- Videos CRUD ---
@router.get("/videos", response_model=list[MediaVideoOut])
async def admin_list_videos(
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> list[MediaVideo]:
    res = await db.execute(
        select(MediaVideo).order_by(MediaVideo.sort_order.asc(), desc(MediaVideo.id))
    )
    return list(res.scalars().all())


@router.post("/videos", response_model=MediaVideoOut)
async def admin_create_video(
    payload: MediaVideoBase,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> MediaVideo:
    video = MediaVideo(**payload.model_dump())
    db.add(video)
    await db.commit()
    await db.refresh(video)
    return video


@router.put("/videos/{video_id}", response_model=MediaVideoOut)
async def admin_update_video(
    video_id: int,
    payload: MediaVideoBase,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> MediaVideo:
    res = await db.execute(select(MediaVideo).where(MediaVideo.id == video_id))
    video = res.scalar_one_or_none()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    for k, v in payload.model_dump().items():
        setattr(video, k, v)
    await db.commit()
    await db.refresh(video)
    return video


@router.delete("/videos/{video_id}")
async def admin_delete_video(
    video_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    res = await db.execute(select(MediaVideo).where(MediaVideo.id == video_id))
    video = res.scalar_one_or_none()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    await db.delete(video)
    await db.commit()
    return {"message": "Video deleted"}


# --- Team & Shariah Board CRUD ---
@router.get("/team", response_model=list[TeamMemberOut])
async def admin_list_team(
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> list[TeamMember]:
    res = await db.execute(
        select(TeamMember).order_by(TeamMember.sort_order.asc(), TeamMember.id.asc())
    )
    return list(res.scalars().all())


@router.post("/team", response_model=TeamMemberOut)
async def admin_create_team_member(
    payload: TeamMemberBase,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> TeamMember:
    member = TeamMember(**payload.model_dump())
    db.add(member)
    await db.commit()
    await db.refresh(member)
    return member


@router.put("/team/{member_id}", response_model=TeamMemberOut)
async def admin_update_team_member(
    member_id: int,
    payload: TeamMemberBase,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> TeamMember:
    res = await db.execute(select(TeamMember).where(TeamMember.id == member_id))
    member = res.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    for k, v in payload.model_dump().items():
        setattr(member, k, v)
    await db.commit()
    await db.refresh(member)
    return member


@router.delete("/team/{member_id}")
async def admin_delete_team_member(
    member_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    res = await db.execute(select(TeamMember).where(TeamMember.id == member_id))
    member = res.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    await db.delete(member)
    await db.commit()
    return {"message": "Member deleted"}


# --- Volunteers Management ---
@router.get("/volunteers", response_model=list[VolunteerOut])
async def admin_list_volunteers(
    status: str | None = None,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> list[Volunteer]:
    stmt = select(Volunteer)
    if status and status != "all":
        stmt = stmt.where(Volunteer.status == status)
    stmt = stmt.order_by(desc(Volunteer.created_at))
    res = await db.execute(stmt)
    return list(res.scalars().all())


@router.put("/volunteers/{volunteer_id}", response_model=VolunteerOut)
async def admin_update_volunteer(
    volunteer_id: int,
    payload: VolunteerStatusUpdate,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> Volunteer:
    res = await db.execute(select(Volunteer).where(Volunteer.id == volunteer_id))
    vol = res.scalar_one_or_none()
    if not vol:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    vol.status = payload.status
    vol.admin_note = payload.admin_note
    await db.commit()
    await db.refresh(vol)
    return vol


@router.delete("/volunteers/{volunteer_id}")
async def admin_delete_volunteer(
    volunteer_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    res = await db.execute(select(Volunteer).where(Volunteer.id == volunteer_id))
    vol = res.scalar_one_or_none()
    if not vol:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    await db.delete(vol)
    await db.commit()
    return {"message": "Volunteer deleted"}


# --- Contact Messages & Leads ---
@router.get("/messages", response_model=list[ContactMessageOut])
async def admin_list_messages(
    status: str | None = None,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> list[ContactMessage]:
    stmt = select(ContactMessage)
    if status and status != "all":
        stmt = stmt.where(ContactMessage.status == status)
    stmt = stmt.order_by(desc(ContactMessage.created_at))
    res = await db.execute(stmt)
    return list(res.scalars().all())


@router.put("/messages/{msg_id}", response_model=ContactMessageOut)
async def admin_update_message_status(
    msg_id: int,
    payload: ContactMessageStatusUpdate,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> ContactMessage:
    res = await db.execute(select(ContactMessage).where(ContactMessage.id == msg_id))
    msg = res.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.status = payload.status
    await db.commit()
    await db.refresh(msg)
    return msg


@router.delete("/messages/{msg_id}")
async def admin_delete_message(
    msg_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    res = await db.execute(select(ContactMessage).where(ContactMessage.id == msg_id))
    msg = res.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    await db.delete(msg)
    await db.commit()
    return {"message": "Message deleted"}


# --- Site Settings ---
@router.get("/settings")
async def admin_get_settings(
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    res = await db.execute(select(SiteSetting).where(SiteSetting.key == "general"))
    row = res.scalar_one_or_none()
    if not row:
        return {}
    return json.loads(row.value_json)


@router.put("/settings")
async def admin_update_settings(
    payload: SiteSettingsPayload,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    res = await db.execute(select(SiteSetting).where(SiteSetting.key == "general"))
    row = res.scalar_one_or_none()
    serialized = json.dumps(payload.settings, ensure_ascii=False)
    if not row:
        row = SiteSetting(key="general", value_json=serialized)
        db.add(row)
    else:
        row.value_json = serialized
    await db.commit()
    return payload.settings


# --- Admin Users Management ---
@router.get("/admins", response_model=list[AdminOut])
async def admin_list_admins(
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> list[AdminUser]:
    res = await db.execute(select(AdminUser).order_by(AdminUser.id.asc()))
    return list(res.scalars().all())


@router.post("/admins", response_model=AdminOut)
async def admin_create_admin_user(
    payload: AdminCreateRequest,
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> AdminUser:
    dup = await db.execute(
        select(AdminUser).where(func.lower(AdminUser.email) == payload.email.lower().strip())
    )
    if dup.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Admin email already exists")
    new_admin = AdminUser(
        name=payload.name,
        email=payload.email.lower().strip(),
        password_hash=hash_password(payload.password),
        role=payload.role,
        is_active=True,
    )
    db.add(new_admin)
    await db.commit()
    await db.refresh(new_admin)
    return new_admin
