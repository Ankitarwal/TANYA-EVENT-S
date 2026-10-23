export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  startingPrice?: number | null;
  features: string[];
  isActive: boolean;
  packages?: Package[];
  createdAt?: string;
}

export interface Package {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  price?: number | null;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export type BookingStatus = 
  | 'Pending' 
  | 'Contacted' 
  | 'Quotation Sent' 
  | 'Confirmed' 
  | 'Completed' 
  | 'Cancelled';

export interface Booking {
  id: string;
  bookingReference: string;
  customerName: string;
  phone: string;
  email?: string | null;
  eventType: string;
  eventDate: string;
  eventTime?: string | null;
  venue: string;
  city: string;
  guestCount: number;
  budget?: string | null;
  packagePreference?: string | null;
  quotationAmount?: number | null;
  status: BookingStatus;
  customerMessage?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  services: Service[];
}

export interface BookingFormData {
  customerName: string;
  phone: string;
  email?: string;
  eventType: string;
  services: string[]; // array of service ids or names
  eventDate: string;
  eventTime?: string;
  venue: string;
  city: string;
  guestCount: number;
  budget?: string;
  packagePreference?: string;
  customerMessage?: string;
  privacyAccepted: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Weddings' | 'Pandal' | 'Catering' | 'Decoration' | 'DJ & Sound' | 'All';
  description?: string;
  imageUrl: string;
  eventDate?: string | null;
  isPublished: boolean;
  createdAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'staff';
}

export interface DashboardStats {
  totalEnquiries: number;
  pendingEnquiries: number;
  confirmedBookings: number;
  completedEvents: number;
  cancelledBookings: number;
  quotationSent: number;
  upcomingEvents: number;
  totalQuotationValue: number;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  businessHours: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  mapEmbedUrl?: string;
}
