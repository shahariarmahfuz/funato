from datetime import datetime, timezone
from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(180), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(40), default="superadmin")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class HeroSlide(Base):
    __tablename__ = "hero_slides"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    badge_bn: Mapped[str] = mapped_column(String(140), default="মানবতার সেবায়")
    badge_en: Mapped[str] = mapped_column(String(140), default="Serving Humanity")
    title_bn: Mapped[str] = mapped_column(String(280), nullable=False)
    title_en: Mapped[str] = mapped_column(String(280), nullable=False)
    subtitle_bn: Mapped[str] = mapped_column(Text, default="")
    subtitle_en: Mapped[str] = mapped_column(Text, default="")
    image_url: Mapped[str] = mapped_column(Text, nullable=False)
    cta_text_bn: Mapped[str] = mapped_column(String(100), default="দান করুন")
    cta_text_en: Mapped[str] = mapped_column(String(100), default="Donate Now")
    cta_link: Mapped[str] = mapped_column(String(255), default="/donate")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Campaign(Base):
    __tablename__ = "campaigns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(140), unique=True, index=True, nullable=False)
    name_bn: Mapped[str] = mapped_column(String(240), nullable=False)
    name_en: Mapped[str] = mapped_column(String(240), nullable=False)
    category: Mapped[str] = mapped_column(String(60), default="general", index=True)
    short_desc_bn: Mapped[str] = mapped_column(Text, default="")
    short_desc_en: Mapped[str] = mapped_column(Text, default="")
    description_bn: Mapped[str] = mapped_column(Text, default="")
    description_en: Mapped[str] = mapped_column(Text, default="")
    quran_hadith_bn: Mapped[str] = mapped_column(Text, default="")
    quran_hadith_en: Mapped[str] = mapped_column(Text, default="")
    expenditure_sector_bn: Mapped[str] = mapped_column(Text, default="")
    expenditure_sector_en: Mapped[str] = mapped_column(Text, default="")
    payment_guideline_bn: Mapped[str] = mapped_column(Text, default="")
    payment_guideline_en: Mapped[str] = mapped_column(Text, default="")
    amount_options: Mapped[str] = mapped_column(String(160), default="1000,2000,5000,10000")
    goal_amount: Mapped[float] = mapped_column(Float, default=1000000.0)
    raised_amount: Mapped[float] = mapped_column(Float, default=0.0)
    donor_count: Mapped[int] = mapped_column(Integer, default=0)
    cover_image: Mapped[str] = mapped_column(Text, default="")
    is_featured: Mapped[bool] = mapped_column(Boolean, default=True)
    is_urgent: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    donations: Mapped[list["Donation"]] = relationship("Donation", back_populates="campaign")


class Donation(Base):
    __tablename__ = "donations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    receipt_no: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    campaign_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("campaigns.id", ondelete="SET NULL"), nullable=True, index=True
    )
    campaign_title_bn: Mapped[str] = mapped_column(String(240), default="সাধারণ তহবিল")
    campaign_title_en: Mapped[str] = mapped_column(String(240), default="General Fund")
    donor_name: Mapped[str] = mapped_column(String(160), nullable=False)
    donor_phone: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    donor_email: Mapped[str | None] = mapped_column(String(180), nullable=True)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(12), default="BDT")
    donation_type: Mapped[str] = mapped_column(String(40), default="one_time")
    payment_method: Mapped[str] = mapped_column(String(40), default="bkash")
    sender_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    transaction_id: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, default=False)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="completed", index=True)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    campaign: Mapped["Campaign | None"] = relationship("Campaign", back_populates="donations")


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(180), unique=True, index=True, nullable=False)
    post_type: Mapped[str] = mapped_column(String(40), default="story", index=True)  # story | news | event
    title_bn: Mapped[str] = mapped_column(String(300), nullable=False)
    title_en: Mapped[str] = mapped_column(String(300), nullable=False)
    excerpt_bn: Mapped[str] = mapped_column(Text, default="")
    excerpt_en: Mapped[str] = mapped_column(Text, default="")
    content_bn: Mapped[str] = mapped_column(Text, default="")
    content_en: Mapped[str] = mapped_column(Text, default="")
    cover_image: Mapped[str] = mapped_column(Text, default="")
    author_name: Mapped[str] = mapped_column(String(120), default="মাস্তুল মিডিয়া ডেস্ক")
    is_featured: Mapped[bool] = mapped_column(Boolean, default=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class MediaVideo(Base):
    __tablename__ = "media_videos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title_bn: Mapped[str] = mapped_column(String(260), nullable=False)
    title_en: Mapped[str] = mapped_column(String(260), nullable=False)
    youtube_url: Mapped[str] = mapped_column(String(300), nullable=False)
    youtube_id: Mapped[str] = mapped_column(String(60), nullable=False)
    thumbnail_url: Mapped[str] = mapped_column(Text, default="")
    duration: Mapped[str] = mapped_column(String(30), default="04:30")
    is_featured: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Volunteer(Base):
    __tablename__ = "volunteers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(160), nullable=False)
    phone: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(180), default="")
    district: Mapped[str] = mapped_column(String(100), default="ঢাকা")
    occupation: Mapped[str] = mapped_column(String(120), default="")
    blood_group: Mapped[str] = mapped_column(String(15), default="")
    skills: Mapped[str] = mapped_column(Text, default="")
    availability: Mapped[str] = mapped_column(String(120), default="সপ্তাহান্তে / জরুরি সময়ে")
    why_join: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(30), default="pending", index=True)  # pending | approved | rejected
    admin_note: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    inquiry_type: Mapped[str] = mapped_column(String(50), default="general", index=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    phone: Mapped[str] = mapped_column(String(40), default="")
    email: Mapped[str] = mapped_column(String(180), default="")
    subject: Mapped[str] = mapped_column(String(240), default="")
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="unread", index=True)  # unread | read | resolved
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class TeamMember(Base):
    __tablename__ = "team_members"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name_bn: Mapped[str] = mapped_column(String(160), nullable=False)
    name_en: Mapped[str] = mapped_column(String(160), nullable=False)
    role_bn: Mapped[str] = mapped_column(String(180), nullable=False)
    role_en: Mapped[str] = mapped_column(String(180), nullable=False)
    board_type: Mapped[str] = mapped_column(String(40), default="executive", index=True)  # executive | shariah | advisor
    bio_bn: Mapped[str] = mapped_column(Text, default="")
    bio_en: Mapped[str] = mapped_column(Text, default="")
    photo_url: Mapped[str] = mapped_column(Text, default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class SiteSetting(Base):
    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    key: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    value_json: Mapped[str] = mapped_column(Text, nullable=False, default="{}")
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
