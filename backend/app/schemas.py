from datetime import datetime
from typing import Any
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# --- Auth ---
class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminPasswordUpdateRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=6)


class AdminCreateRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)
    role: str = "editor"


class AdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminOut


# --- Hero Slides ---
class HeroSlideBase(BaseModel):
    badge_bn: str = "মানবতার সেবায়"
    badge_en: str = "Serving Humanity"
    title_bn: str
    title_en: str
    subtitle_bn: str = ""
    subtitle_en: str = ""
    image_url: str
    cta_text_bn: str = "দান করুন"
    cta_text_en: str = "Donate Now"
    cta_link: str = "/donate"
    sort_order: int = 0
    is_active: bool = True


class HeroSlideOut(HeroSlideBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# --- Campaigns ---
class CampaignBase(BaseModel):
    slug: str
    name_bn: str
    name_en: str
    category: str = "general"
    short_desc_bn: str = ""
    short_desc_en: str = ""
    description_bn: str = ""
    description_en: str = ""
    quran_hadith_bn: str = ""
    quran_hadith_en: str = ""
    expenditure_sector_bn: str = ""
    expenditure_sector_en: str = ""
    payment_guideline_bn: str = ""
    payment_guideline_en: str = ""
    amount_options: str = "1000,2000,5000,10000"
    goal_amount: float = 1000000.0
    raised_amount: float = 0.0
    donor_count: int = 0
    cover_image: str = ""
    is_featured: bool = True
    is_urgent: bool = False
    is_active: bool = True
    sort_order: int = 0


class CampaignOut(CampaignBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    updated_at: datetime


# --- Donations ---
class DonationCreate(BaseModel):
    campaign_id: int | None = None
    campaign_slug: str | None = None
    donor_name: str = Field(min_length=2, max_length=160)
    donor_phone: str = Field(min_length=6, max_length=40)
    donor_email: str | None = None
    amount: float = Field(gt=0)
    donation_type: str = "one_time"
    payment_method: str = "bkash"
    sender_number: str | None = None
    transaction_id: str | None = None
    is_anonymous: bool = False
    note: str | None = None
    instant_checkout: bool = True


class DonationStatusUpdate(BaseModel):
    status: str  # completed | pending | rejected
    transaction_id: str | None = None
    note: str | None = None


class DonationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    receipt_no: str
    campaign_id: int | None
    campaign_title_bn: str
    campaign_title_en: str
    donor_name: str
    donor_phone: str
    donor_email: str | None
    amount: float
    currency: str
    donation_type: str
    payment_method: str
    sender_number: str | None
    transaction_id: str | None
    is_anonymous: bool
    note: str | None
    status: str
    verified_at: datetime | None
    created_at: datetime


class PublicDonorOut(BaseModel):
    id: int
    donor_name: str
    campaign_title_bn: str
    campaign_title_en: str
    amount: float
    payment_method: str
    created_at: datetime


# --- Posts ---
class PostBase(BaseModel):
    slug: str
    post_type: str = "story"
    title_bn: str
    title_en: str
    excerpt_bn: str = ""
    excerpt_en: str = ""
    content_bn: str = ""
    content_en: str = ""
    cover_image: str = ""
    author_name: str = "মিডিয়া ডেস্ক"
    is_featured: bool = True
    is_published: bool = True


class PostOut(PostBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    published_at: datetime
    created_at: datetime


# --- Videos ---
class MediaVideoBase(BaseModel):
    title_bn: str
    title_en: str
    youtube_url: str
    youtube_id: str
    thumbnail_url: str = ""
    duration: str = "04:30"
    is_featured: bool = True
    sort_order: int = 0
    is_active: bool = True


class MediaVideoOut(MediaVideoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# --- Volunteers ---
class VolunteerCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=160)
    phone: str = Field(min_length=6, max_length=40)
    email: str = ""
    district: str = "ঢাকা"
    occupation: str = ""
    blood_group: str = ""
    skills: str = ""
    availability: str = "সপ্তাহান্তে / জরুরি সময়ে"
    why_join: str = ""


class VolunteerStatusUpdate(BaseModel):
    status: str
    admin_note: str = ""


class VolunteerOut(VolunteerCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    status: str
    admin_note: str
    created_at: datetime


# --- Contact Messages ---
class ContactMessageCreate(BaseModel):
    inquiry_type: str = "general"
    name: str = Field(min_length=2, max_length=160)
    phone: str = ""
    email: str = ""
    subject: str = ""
    message: str = Field(min_length=3)


class ContactMessageStatusUpdate(BaseModel):
    status: str


class ContactMessageOut(ContactMessageCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    status: str
    created_at: datetime


# --- Team Members ---
class TeamMemberBase(BaseModel):
    name_bn: str
    name_en: str
    role_bn: str
    role_en: str
    board_type: str = "executive"
    bio_bn: str = ""
    bio_en: str = ""
    photo_url: str = ""
    sort_order: int = 0
    is_active: bool = True


class TeamMemberOut(TeamMemberBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# --- Site Settings ---
class SiteSettingsPayload(BaseModel):
    settings: dict[str, Any]
