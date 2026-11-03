from datetime import datetime, timezone
import json
import secrets
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import desc, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import (
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
    CampaignOut,
    ContactMessageCreate,
    ContactMessageOut,
    DonationCreate,
    DonationOut,
    HeroSlideOut,
    MediaVideoOut,
    PostOut,
    PublicDonorOut,
    TeamMemberOut,
    VolunteerCreate,
    VolunteerOut,
)

router = APIRouter(prefix="/api/public", tags=["Public"])


async def load_site_settings(db: AsyncSession) -> dict[str, Any]:
    res = await db.execute(select(SiteSetting).where(SiteSetting.key == "general"))
    row = res.scalar_one_or_none()
    if not row:
        return {}
    try:
        return json.loads(row.value_json)
    except Exception:
        return {}


def mask_donor_name(d: Donation) -> str:
    if d.is_anonymous:
        return "জনৈক দাতা (Anonymous)"
    return d.donor_name


@router.get("/settings")
async def get_public_settings(db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    return await load_site_settings(db)


@router.get("/home")
async def get_home_bundle(db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    site_settings = await load_site_settings(db)

    slides_res = await db.execute(
        select(HeroSlide)
        .where(HeroSlide.is_active.is_(True))
        .order_by(HeroSlide.sort_order.asc(), HeroSlide.id.asc())
    )
    slides = [HeroSlideOut.model_validate(s) for s in slides_res.scalars().all()]

    campaigns_res = await db.execute(
        select(Campaign)
        .where(Campaign.is_active.is_(True))
        .order_by(Campaign.sort_order.asc(), Campaign.id.asc())
    )
    campaigns = [CampaignOut.model_validate(c) for c in campaigns_res.scalars().all()]

    stories_res = await db.execute(
        select(Post)
        .where(Post.is_published.is_(True), Post.post_type == "story")
        .order_by(desc(Post.published_at), desc(Post.id))
        .limit(6)
    )
    stories = [PostOut.model_validate(p) for p in stories_res.scalars().all()]

    news_res = await db.execute(
        select(Post)
        .where(Post.is_published.is_(True), Post.post_type == "news")
        .order_by(desc(Post.published_at), desc(Post.id))
        .limit(6)
    )
    news = [PostOut.model_validate(p) for p in news_res.scalars().all()]

    videos_res = await db.execute(
        select(MediaVideo)
        .where(MediaVideo.is_active.is_(True))
        .order_by(MediaVideo.sort_order.asc(), desc(MediaVideo.id))
        .limit(6)
    )
    videos = [MediaVideoOut.model_validate(v) for v in videos_res.scalars().all()]

    donors_res = await db.execute(
        select(Donation)
        .where(Donation.status == "completed")
        .order_by(desc(Donation.created_at))
        .limit(10)
    )
    recent_donations = [
        PublicDonorOut(
            id=d.id,
            donor_name=mask_donor_name(d),
            campaign_title_bn=d.campaign_title_bn,
            campaign_title_en=d.campaign_title_en,
            amount=d.amount,
            payment_method=d.payment_method,
            created_at=d.created_at,
        )
        for d in donors_res.scalars().all()
    ]

    return {
        "settings": site_settings,
        "slides": slides,
        "campaigns": campaigns,
        "stories": stories,
        "news": news,
        "videos": videos,
        "recent_donations": recent_donations,
    }


@router.get("/campaigns", response_model=list[CampaignOut])
async def list_campaigns(
    category: str | None = None,
    featured: bool | None = None,
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[Campaign]:
    stmt = select(Campaign).where(Campaign.is_active.is_(True))
    if category and category != "all":
        stmt = stmt.where(Campaign.category == category)
    if featured is not None:
        stmt = stmt.where(Campaign.is_featured.is_(featured))
    if search:
        pattern = f"%{search.strip()}%"
        stmt = stmt.where(
            or_(
                Campaign.name_bn.ilike(pattern),
                Campaign.name_en.ilike(pattern),
                Campaign.short_desc_bn.ilike(pattern),
                Campaign.short_desc_en.ilike(pattern),
            )
        )
    stmt = stmt.order_by(Campaign.sort_order.asc(), Campaign.id.asc())
    res = await db.execute(stmt)
    return list(res.scalars().all())


@router.get("/campaigns/{slug}")
async def get_campaign_detail(slug: str, db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    res = await db.execute(
        select(Campaign).where(Campaign.slug == slug, Campaign.is_active.is_(True))
    )
    campaign = res.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    donors_res = await db.execute(
        select(Donation)
        .where(Donation.campaign_id == campaign.id, Donation.status == "completed")
        .order_by(desc(Donation.created_at))
        .limit(8)
    )
    recent_donors = [
        PublicDonorOut(
            id=d.id,
            donor_name=mask_donor_name(d),
            campaign_title_bn=d.campaign_title_bn,
            campaign_title_en=d.campaign_title_en,
            amount=d.amount,
            payment_method=d.payment_method,
            created_at=d.created_at,
        )
        for d in donors_res.scalars().all()
    ]

    related_res = await db.execute(
        select(Campaign)
        .where(Campaign.is_active.is_(True), Campaign.id != campaign.id)
        .order_by(Campaign.sort_order.asc())
        .limit(3)
    )
    related = [CampaignOut.model_validate(c) for c in related_res.scalars().all()]

    return {
        "campaign": CampaignOut.model_validate(campaign),
        "recent_donors": recent_donors,
        "related_campaigns": related,
    }


@router.post("/donations", response_model=DonationOut)
async def create_donation(
    payload: DonationCreate,
    db: AsyncSession = Depends(get_db),
) -> Donation:
    campaign: Campaign | None = None
    if payload.campaign_id:
        res = await db.execute(select(Campaign).where(Campaign.id == payload.campaign_id))
        campaign = res.scalar_one_or_none()
    elif payload.campaign_slug:
        res = await db.execute(select(Campaign).where(Campaign.slug == payload.campaign_slug))
        campaign = res.scalar_one_or_none()

    now = datetime.now(timezone.utc)
    receipt_no = f"FDN-{now.strftime('%Y%m%d')}-{secrets.token_hex(3).upper()}"

    is_instant = payload.instant_checkout
    status_val = "completed" if is_instant else "pending"
    trx_id = payload.transaction_id
    if is_instant and not trx_id:
        prefix = payload.payment_method.upper()[:3]
        trx_id = f"{prefix}{secrets.token_hex(4).upper()}"

    donation = Donation(
        receipt_no=receipt_no,
        campaign_id=campaign.id if campaign else None,
        campaign_title_bn=campaign.name_bn if campaign else "সাধারণ তহবিল",
        campaign_title_en=campaign.name_en if campaign else "General Fund",
        donor_name=payload.donor_name.strip(),
        donor_phone=payload.donor_phone.strip(),
        donor_email=payload.donor_email.strip() if payload.donor_email else None,
        amount=round(payload.amount, 2),
        currency="BDT",
        donation_type=payload.donation_type,
        payment_method=payload.payment_method,
        sender_number=payload.sender_number.strip() if payload.sender_number else None,
        transaction_id=trx_id,
        is_anonymous=payload.is_anonymous,
        note=payload.note,
        status=status_val,
        verified_at=now if is_instant else None,
    )
    db.add(donation)

    if campaign and is_instant:
        campaign.raised_amount = round((campaign.raised_amount or 0.0) + payload.amount, 2)
        campaign.donor_count = (campaign.donor_count or 0) + 1

    await db.commit()
    await db.refresh(donation)
    return donation


@router.get("/donations/receipt/{receipt_no}", response_model=DonationOut)
async def get_donation_receipt(receipt_no: str, db: AsyncSession = Depends(get_db)) -> Donation:
    res = await db.execute(select(Donation).where(Donation.receipt_no == receipt_no.strip()))
    donation = res.scalar_one_or_none()
    if not donation:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return donation


@router.get("/donations/recent", response_model=list[PublicDonorOut])
async def list_recent_public_donations(
    limit: int = Query(default=12, le=50),
    db: AsyncSession = Depends(get_db),
) -> list[PublicDonorOut]:
    res = await db.execute(
        select(Donation)
        .where(Donation.status == "completed")
        .order_by(desc(Donation.created_at))
        .limit(limit)
    )
    return [
        PublicDonorOut(
            id=d.id,
            donor_name=mask_donor_name(d),
            campaign_title_bn=d.campaign_title_bn,
            campaign_title_en=d.campaign_title_en,
            amount=d.amount,
            payment_method=d.payment_method,
            created_at=d.created_at,
        )
        for d in res.scalars().all()
    ]


@router.get("/posts", response_model=list[PostOut])
async def list_posts(
    post_type: str | None = None,
    limit: int = Query(default=24, le=100),
    db: AsyncSession = Depends(get_db),
) -> list[Post]:
    stmt = select(Post).where(Post.is_published.is_(True))
    if post_type and post_type != "all":
        stmt = stmt.where(Post.post_type == post_type)
    stmt = stmt.order_by(desc(Post.published_at), desc(Post.id)).limit(limit)
    res = await db.execute(stmt)
    return list(res.scalars().all())


@router.get("/posts/{slug}")
async def get_post_detail(slug: str, db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    res = await db.execute(
        select(Post).where(Post.slug == slug, Post.is_published.is_(True))
    )
    post = res.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    rel_res = await db.execute(
        select(Post)
        .where(Post.is_published.is_(True), Post.id != post.id)
        .order_by(desc(Post.published_at))
        .limit(3)
    )
    related = [PostOut.model_validate(p) for p in rel_res.scalars().all()]
    return {
        "post": PostOut.model_validate(post),
        "related_posts": related,
    }


@router.get("/videos", response_model=list[MediaVideoOut])
async def list_videos(db: AsyncSession = Depends(get_db)) -> list[MediaVideo]:
    res = await db.execute(
        select(MediaVideo)
        .where(MediaVideo.is_active.is_(True))
        .order_by(MediaVideo.sort_order.asc(), desc(MediaVideo.id))
    )
    return list(res.scalars().all())


@router.get("/team", response_model=list[TeamMemberOut])
async def list_team_members(
    board_type: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[TeamMember]:
    stmt = select(TeamMember).where(TeamMember.is_active.is_(True))
    if board_type and board_type != "all":
        stmt = stmt.where(TeamMember.board_type == board_type)
    stmt = stmt.order_by(TeamMember.sort_order.asc(), TeamMember.id.asc())
    res = await db.execute(stmt)
    return list(res.scalars().all())


@router.post("/volunteers", response_model=VolunteerOut)
async def register_volunteer(
    payload: VolunteerCreate,
    db: AsyncSession = Depends(get_db),
) -> Volunteer:
    volunteer = Volunteer(**payload.model_dump(), status="pending")
    db.add(volunteer)
    await db.commit()
    await db.refresh(volunteer)
    return volunteer


@router.post("/contact", response_model=ContactMessageOut)
async def submit_contact_message(
    payload: ContactMessageCreate,
    db: AsyncSession = Depends(get_db),
) -> ContactMessage:
    msg = ContactMessage(**payload.model_dump(), status="unread")
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg
