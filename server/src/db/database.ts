import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

// Ensure data directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'tanya_events.db');
export const db = new Database(dbPath);

// Enable foreign keys and WAL mode for reliability
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  console.log(`[Database] Initializing SQLite database at ${dbPath}...`);

  // 1. Profiles (Admin / Staff)
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Services
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      short_description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      starting_price REAL,
      features TEXT NOT NULL, -- JSON array
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Packages
  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL,
      features TEXT NOT NULL, -- JSON array
      is_popular INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );
  `);

  // 4. Bookings
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      booking_reference TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      event_type TEXT NOT NULL,
      event_date TEXT NOT NULL,
      event_time TEXT,
      venue TEXT NOT NULL,
      city TEXT NOT NULL,
      guest_count INTEGER NOT NULL,
      budget TEXT,
      package_preference TEXT,
      quotation_amount REAL,
      status TEXT NOT NULL DEFAULT 'Pending',
      customer_message TEXT,
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Booking Services Junction
  db.exec(`
    CREATE TABLE IF NOT EXISTS booking_services (
      booking_id TEXT NOT NULL,
      service_id TEXT NOT NULL,
      PRIMARY KEY (booking_id, service_id),
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );
  `);

  // 6. Gallery
  db.exec(`
    CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      image_url TEXT NOT NULL,
      event_date TEXT,
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Site Settings
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  seedData();
}

function seedData() {
  // Check if admin exists
  const adminExists = db.prepare('SELECT id FROM profiles WHERE email = ?').get('admin@tanyaevents.com');
  if (!adminExists) {
    console.log('[Database] Seeding default admin user...');
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('Admin@TanyaEvents2026!', salt);
    db.prepare(`
      INSERT INTO profiles (id, email, password_hash, full_name, role)
      VALUES (?, ?, ?, ?, ?)
    `).run('adm-001', 'admin@tanyaevents.com', passwordHash, 'Tanya Events Administrator', 'admin');
  }

  // Seed Services if empty
  const servicesCount = db.prepare('SELECT COUNT(*) as count FROM services').get() as { count: number };
  if (servicesCount.count === 0) {
    console.log('[Database] Seeding standard 5 core services...');
    const insertService = db.prepare(`
      INSERT INTO services (id, name, slug, description, short_description, image_url, starting_price, features, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    const insertPackage = db.prepare(`
      INSERT INTO packages (id, service_id, name, description, price, features, is_popular, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);

    // 1. Pandal & Caterers
    insertService.run(
      'srv-pandal',
      'Pandal & Caterers',
      'pandal-and-caterers',
      'Magnificent wedding pandals, waterproof German hanger structures, traditional shamianas, luxurious guest seating, architectural lighting, and seamless full-service catering setups built for grand celebrations.',
      'Grand wedding pandals, German hanger structures, royal seating & complete catering infrastructure.',
      '/images/service_pandal.jpg',
      75000,
      JSON.stringify([
        'Waterproof German Hanger & Traditional Shamianas',
        'Royal Gold Chiavari & Banquet Seating Arrangements',
        'Crystal Chandeliers & Ambient Ceiling Canopies',
        'Full Kitchen & Buffet Setup Infrastructure',
        'Weather-proof Carpet Flooring & Stage Platforms',
        'Dedicated On-Site Operations Team'
      ])
    );

    insertPackage.run(
      'pkg-pandal-1',
      'srv-pandal',
      'Classic Pandal Setup',
      'Ideal for intimate gatherings, mehendi, or traditional home weddings up to 250 guests.',
      75000,
      JSON.stringify([
        'Traditional decorated shamiana canopy (up to 2,500 sq ft)',
        '100 cushioned banquet chairs with covers & tie-backs',
        'Buffet counter setup with warming chaffing gear',
        'Warm fairy light ceiling & perimeter illumination',
        'Carpeted flooring throughout'
      ]),
      0
    );

    insertPackage.run(
      'pkg-pandal-2',
      'srv-pandal',
      'Grand Royal Pandal',
      'Our flagship luxury setup for grand wedding receptions and 500+ guests.',
      180000,
      JSON.stringify([
        'All-weather German Hanger / Truss structure (5,000+ sq ft)',
        'Pleated silk ceiling drapes in champagne gold & maroon',
        '300 Gold Chiavari chairs + 10 round VIP sofa tables',
        'Imported crystal chandeliers & truss lighting',
        'Dedicated live food station counters & welcome gate',
        'Air-conditioned / mist-fan cooling infrastructure'
      ]),
      1
    );

    // 2. Wedding Planning
    insertService.run(
      'srv-wedding',
      'Wedding Planning',
      'wedding-planning',
      'End-to-end royal wedding planning and bespoke coordination. From engagement, haldi, and mehendi to the grand varmala, stage management, and reception, our senior wedding architects orchestrate every moment to perfection.',
      'Turnkey wedding curation, rituals coordination, stagecraft, and guest hospitality.',
      '/images/hero_mandap.jpg',
      120000,
      JSON.stringify([
        'End-to-end Wedding Architecture & Timeline Management',
        'Ritual-specific Curation: Haldi, Mehendi, Sangeet & Reception',
        'Vendor Coordination & Quality Assurance',
        'VIP Guest Hospitality & Welcome Logistics',
        'Bridal & Groom Grand Entry Concepts',
        'Dedicated Wedding Day Operations Director'
      ])
    );

    insertPackage.run(
      'pkg-wedding-1',
      'srv-wedding',
      'Silver Coordination',
      'Month-of and wedding day coordination ensuring seamless schedule execution.',
      120000,
      JSON.stringify([
        'Timeline creation & vendor synchronization',
        'Varmala ceremony & stage entry orchestration',
        'Guest seating and hospitality assistance',
        'Single lead coordinator + 2 assistants on wedding day'
      ]),
      0
    );

    insertPackage.run(
      'pkg-wedding-2',
      'srv-wedding',
      'Imperial Royal Wedding',
      'Complete end-to-end luxury wedding design, management, and turnkey execution.',
      275000,
      JSON.stringify([
        'Full 3-day multi-event curation (Haldi, Sangeet, Wedding, Reception)',
        'Custom 3D stage and mandap visualization',
        'Bridal entry with cold pyro, floral chadar & haze effects',
        'Artist & entertainment management',
        'Dedicated hospitality desk and room hamper coordination',
        'Senior Event Director + 6 field coordinators'
      ]),
      1
    );

    // 3. Catering Services
    insertService.run(
      'srv-catering',
      'Catering Services',
      'catering-services',
      'Gourmet royal culinary experiences spanning North Indian, Mughlai, Awadhi, Rajasthani, South Indian, Continental, and Oriental cuisines. Handcrafted menus, live interactive chaat counters, and traditional copper service.',
      'Gourmet multi-cuisine spreads, live interactive food counters & royal hospitality.',
      '/images/service_catering.jpg',
      650, // per plate starting
      JSON.stringify([
        'Pure Veg & Multi-Cuisine Royal Spreads (Mughlai, Awadhi, Continental)',
        'Live Interactive Chaat, Woodfired & Dessert Stations',
        'Traditional Hammered Copper & Brass Chafing Presentation',
        'Uniformed Hospitality Stewards & Service Managers',
        'Stringent Hygiene & Fresh Quality Ingredients Guarantee',
        'Tailored Menu Tasting Sessions Prior to Event'
      ])
    );

    insertPackage.run(
      'pkg-catering-1',
      'srv-catering',
      'Deluxe Feast Menu',
      'Rich multi-course dining spread with premium starters, main course, and sweets.',
      850,
      JSON.stringify([
        '3 Welcome Mocktails & Refreshers',
        '4 Hot Starters (Paneer Tikka, Hara Bhara Kebab, Crispy Corn, Spring Rolls)',
        '2 Live Counters (Delhi Chaat & Pav Bhaji / Pasta)',
        '6 Main Course Curries & Dal Makhani + Pulao & Breads',
        '3 Royal Desserts (Gulab Jamun, Moong Dal Halwa, Ice Cream)'
      ]),
      1
    );

    insertPackage.run(
      'pkg-catering-2',
      'srv-catering',
      'Royal Imperial Feast',
      'The ultimate gourmet celebration with extensive live stations and royal sweets.',
      1350,
      JSON.stringify([
        '5 Artisanal Mocktails & Fruit Skewers',
        '6 Gourmet Starters (Tandoori Broccoli, Galouti Kebab, Soya Chaap, Dimsums)',
        '4 Live Counters (Chaat Bazaar, Woodfired Pizza, Mexican Tacos, Dosa)',
        '8 Royal Curries, Dal Bukhara, Dum Biryani, 5 Tandoori Breads',
        '5 Luxury Desserts (Jalebi Rabdi, Kesar Rasmalai, Warm Brownie, Kulfi counter)',
        'Mineral water, high-end bone china tableware & gold flatware'
      ]),
      0
    );

    // 4. Decoration Services
    insertService.run(
      'srv-decoration',
      'Decoration Services',
      'decoration-services',
      'Mesmerizing floral arrangements, custom carved mandaps, ethereal fairy light tunnels, royal entrance gates, and themed reception backdrops designed to captivate your guests and look timeless in photography.',
      'Bespoke floral mandaps, designer stages, grand entrance arches & lighting aesthetics.',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
      50000,
      JSON.stringify([
        'Exquisite Fresh Floral Mandaps with Red Roses, Orchids & Tuberoses',
        'Themed Reception Backdrops with Velvet & Golden Carved Arches',
        'Grand Entrance Tunnel with Fairy Lights & Floral Chandeliers',
        'Haldi & Mehendi Vibrant Bohemian / Marigold Setups',
        'Photobooth & Selfie Zones with Custom Monogram Neon Signs',
        'Tabletop Centerpieces & Floral Rangoli Installations'
      ])
    );

    insertPackage.run(
      'pkg-decor-1',
      'srv-decoration',
      'Elegance Floral Decor',
      'Beautiful fresh flower stage and entrance decor for engagements or intimate weddings.',
      65000,
      JSON.stringify([
        '16x10 ft Floral stage backdrop with warm backdrop lighting',
        'Grand 12 ft arched floral entrance gate',
        'Pathway decoration with 6 floral pillars & red carpet',
        'Bride & Groom sofa seating setup with floral cushions'
      ]),
      0
    );

    insertPackage.run(
      'pkg-decor-2',
      'srv-decoration',
      'Royal Maharaja Mandap & Stage',
      'Extravagant royal floral mandap with imported flowers and crystal chandeliers.',
      160000,
      JSON.stringify([
        'Circular 4-pillar golden mandap with dense rose & orchid canopy',
        '30 ft grand stage with 3D carved royal palace arches & warm illumination',
        'Fairy light canopy ceiling (3,000 sq ft)',
        'Customized floral photobooth with personalized neon couple initials',
        'Complete aisle floral runners and Havana fire torches'
      ]),
      1
    );

    // 5. DJ & Sound Services
    insertService.run(
      'srv-dj',
      'DJ & Sound Services',
      'dj-and-sound',
      'Electrifying high-fidelity audio engineering, club-grade line-array sound systems, moving-head beam lights, LED dance floors, cold pyro sparklers, and top-tier Bollywood and commercial DJs.',
      'Club-grade line-array sound, moving-head lights, LED dance floors & cold pyro.',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80',
      35000,
      JSON.stringify([
        'Pro JBL / RCF Line-Array Sound Systems with Deep Subwoofers',
        'Sharpy Moving Head Beams, Laser Cannons & Wash Lights',
        'High-Gloss Acrylic or Interactive LED Video Dance Floor',
        'Cold Pyro Sparks & Dry Ice Heavy Smoke Foggers for Varmala',
        'Professional Celebrity / Wedding DJ & Live Dhol Troupe Coordination',
        'Backup Generators & Sound Engineers for Zero Interruption'
      ])
    );

    insertPackage.run(
      'pkg-dj-1',
      'srv-dj',
      'Sangeet Party Blast',
      'High-energy sound and dynamic lighting for sangeet, cocktail, and bachelor parties.',
      35000,
      JSON.stringify([
        'High-powered sound system (up to 300 guests coverage)',
        '4 Sharpy moving heads + 8 LED PAR stage lights',
        'Top Bollywood & Commercial party DJ (4 hours performance)',
        'Haze smoke machine and wireless microphone set'
      ]),
      1
    );

    insertPackage.run(
      'pkg-dj-2',
      'srv-dj',
      'Imperial Varmala & DJ Concert',
      'Concert-scale production with cold pyro sparks and LED dance floor.',
      80000,
      JSON.stringify([
        'Dual Line-Array audio stack with 4 bass bins (1000+ guest capability)',
        '16x16 ft high-resolution LED dance floor',
        '8 Sharpy moving heads, blinders & synchronized truss lighting',
        '4 Cold Pyro sparklers + 2 Dry-ice heavy smoke machines for grand entry',
        '2 Live Punjabi Dhol players along with celebrity DJ'
      ]),
      0
    );
  }

  // Seed Gallery if empty
  const galleryCount = db.prepare('SELECT COUNT(*) as count FROM gallery').get() as { count: number };
  if (galleryCount.count === 0) {
    console.log('[Database] Seeding initial gallery showcase items...');
    const insertGallery = db.prepare(`
      INSERT INTO gallery (id, title, category, description, image_url, event_date, is_published)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);

    insertGallery.run(
      'gal-1',
      'Royal Palace Mandap Ceremony',
      'Weddings',
      'Opulent mandap with royal maroon drapes, crystal chandeliers, and golden pillars.',
      '/images/hero_mandap.jpg',
      '2026-02-14'
    );

    insertGallery.run(
      'gal-2',
      'Grand Reception Pandal Marquee',
      'Pandal',
      'Waterproof luxury marquee with pleated silk ceiling and chiavari banquet seating.',
      '/images/service_pandal.jpg',
      '2026-01-20'
    );

    insertGallery.run(
      'gal-3',
      'Royal Buffet & Copper Chafing Spread',
      'Catering',
      'Gourmet royal feast with live counters and traditional copper dinnerware.',
      '/images/service_catering.jpg',
      '2026-03-05'
    );

    insertGallery.run(
      'gal-4',
      'Whimsical Floral Archway & Stage',
      'Decoration',
      'Cascading fresh Ecuadorian roses, white orchids, and crystal lighting.',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
      '2026-02-28'
    );

    insertGallery.run(
      'gal-5',
      'Electrifying Sangeet DJ Night',
      'DJ & Sound',
      'Moving-head beam illumination, LED dance floor, and high-energy party atmosphere.',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80',
      '2026-03-12'
    );

    insertGallery.run(
      'gal-6',
      'Haldi Ceremony Marigold Canopy',
      'Weddings',
      'Vibrant yellow and orange marigold floral draping with traditional brass urlis.',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80',
      '2026-04-02'
    );

    insertGallery.run(
      'gal-7',
      'Live Chaat & Dessert Bazaar',
      'Catering',
      'Interactive culinary stations serving artisan desserts and North Indian chaats.',
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=80',
      '2026-03-24'
    );

    insertGallery.run(
      'gal-8',
      'Candlelit Fairy Light Reception Hall',
      'Decoration',
      'Over 2,000 hanging fairy lights creating a magical starry night ballroom canopy.',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80',
      '2026-04-18'
    );
  }

  // Seed default site settings if empty
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM site_settings').get() as { count: number };
  if (settingsCount.count === 0) {
    console.log('[Database] Seeding site settings...');
    const insertSetting = db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)');
    insertSetting.run('brand_name', "TANYA EVENT'S");
    insertSetting.run('tagline', 'Making Every Celebration Unforgettable');
    insertSetting.run('phone', '+91 78568 31119');
    insertSetting.run('whatsapp', '+91 78568 31119');
    insertSetting.run('email', 'tanyaevents.booking@gmail.com');
    insertSetting.run('address', 'South point public school, Laxmi Market, Dr. Shambhu Sharan Prasad, New Jakkanpur, Gardanibagh, Patna, Bihar, India - 800001');
    insertSetting.run('business_hours', 'Monday - Sunday: 9:00 AM – 9:00 PM (By Appointment)');
    insertSetting.run('instagram_url', 'https://instagram.com/tanyaevents');
    insertSetting.run('facebook_url', 'https://facebook.com/tanyaevents');
  }

  console.log('[Database] Database tables initialized and verified.');
}
