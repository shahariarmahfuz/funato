export interface SiteSettings {
  [key: string]: any;
}

export interface HeroSlide {
  id: number;
  badge_bn: string;
  badge_en: string;
  title_bn: string;
  title_en: string;
  subtitle_bn: string;
  subtitle_en: string;
  image_url: string;
  cta_text_bn: string;
  cta_text_en: string;
  cta_link: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Campaign {
  id: number;
  slug: string;
  name_bn: string;
  name_en: string;
  category: string;
  short_desc_bn: string;
  short_desc_en: string;
  description_bn: string;
  description_en: string;
  quran_hadith_bn: string;
  quran_hadith_en: string;
  expenditure_sector_bn: string;
  expenditure_sector_en: string;
  payment_guideline_bn: string;
  payment_guideline_en: string;
  amount_options: string;
  goal_amount: number;
  raised_amount: number;
  donor_count: number;
  cover_image: string;
  is_featured: boolean;
  is_urgent: boolean;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Donation {
  id: number;
  receipt_no: string;
  campaign_id: number | null;
  campaign_title_bn: string;
  campaign_title_en: string;
  donor_name: string;
  donor_phone: string;
  donor_email?: string | null;
  amount: number;
  currency: string;
  donation_type: string;
  payment_method: string;
  sender_number?: string | null;
  transaction_id?: string | null;
  is_anonymous: boolean;
  note?: string | null;
  status: string;
  verified_at?: string | null;
  created_at: string;
}

export interface PublicDonor {
  id: number;
  donor_name: string;
  campaign_title_bn: string;
  campaign_title_en: string;
  amount: number;
  payment_method: string;
  created_at: string;
}

export interface Post {
  id: number;
  slug: string;
  post_type: string;
  title_bn: string;
  title_en: string;
  excerpt_bn: string;
  excerpt_en: string;
  content_bn: string;
  content_en: string;
  cover_image: string;
  author_name: string;
  is_featured: boolean;
  is_published: boolean;
  published_at?: string;
  created_at?: string;
}

export interface MediaVideo {
  id: number;
  title_bn: string;
  title_en: string;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url: string;
  duration: string;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Volunteer {
  id: number;
  full_name: string;
  phone: string;
  email?: string;
  district: string;
  occupation: string;
  blood_group: string;
  skills: string;
  availability: string;
  why_join: string;
  status: string;
  admin_note: string;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  inquiry_type: string;
  name: string;
  phone?: string;
  email?: string;
  subject?: string;
  message: string;
  status: string;
  created_at: string;
}

export interface TeamMember {
  id: number;
  name_bn: string;
  name_en: string;
  role_bn: string;
  role_en: string;
  board_type: string;
  bio_bn: string;
  bio_en: string;
  photo_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface HomeBundle {
  settings: SiteSettings;
  slides: HeroSlide[];
  campaigns: Campaign[];
  stories: Post[];
  news: Post[];
  videos: MediaVideo[];
  recent_donations?: any[];
  stats?: Record<string, any>;
}

export interface DashboardData {
  kpis: {
    total_raised: number;
    completed_donations: number;
    pending_donations: number;
    active_campaigns: number;
    volunteers_pending: number;
    volunteers_total: number;
    unread_messages: number;
    posts_count: number;
  };
  recent_donations: Donation[];
  top_campaigns: Campaign[];
  payment_breakdown: { method: string; count: number; total: number }[];
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}
