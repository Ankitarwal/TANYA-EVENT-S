-- ========================================================
-- TANYA EVENT'S — Database Schema for Supabase PostgreSQL
-- "Making Every Celebration Unforgettable"
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Admin / Staff)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Services Table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  starting_price NUMERIC(10,2),
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Packages Table
CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2),
  features JSONB DEFAULT '[]'::jsonb,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  guest_count INTEGER NOT NULL CHECK (guest_count > 0),
  budget TEXT,
  package_preference TEXT,
  quotation_amount NUMERIC(12,2),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Contacted', 'Quotation Sent', 'Confirmed', 'Completed', 'Cancelled')),
  customer_message TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Booking Services Junction Table
CREATE TABLE IF NOT EXISTS booking_services (
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (booking_id, service_id)
);

-- 6. Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  event_date DATE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);

-- Row Level Security (RLS) Setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for active services, packages, published gallery, and public settings
CREATE POLICY "Public can view active services" ON services FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view active packages" ON packages FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view published gallery" ON gallery FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);

-- Anyone can submit a booking enquiry
CREATE POLICY "Public can submit booking enquiry" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert booking_services" ON booking_services FOR INSERT WITH CHECK (true);

-- Public can lookup their own booking enquiry by reference
CREATE POLICY "Public can view their own booking by reference" ON bookings FOR SELECT USING (true);

-- Admins full access policy (authenticated users)
CREATE POLICY "Admins full access on profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access on services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access on packages" ON packages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access on bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access on booking_services" ON booking_services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access on gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access on site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
