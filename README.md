# TANYA EVENT'S — Premium Event Planning & Booking Web Platform

> *"Making Every Celebration Unforgettable"*

A modern, responsive, production-ready full-stack event planning and booking web application built for **TANYA EVENT'S**. The platform provides turnkey event management, including **Pandal & Caterers**, **Royal Wedding Planning**, **Gourmet Catering Services**, **Bespoke Decoration Services**, and **DJ & Sound Engineering**.

---

## 🌟 Brand Identity & Visual Aesthetic

- **Brand Name**: TANYA EVENT'S
- **Tagline**: *"Making Every Celebration Unforgettable"*
- **Color Palette**: Deep Royal Maroon (`#430814`, `#26050C`), Champagne Gold (`#D4AF37`, `#DFBE5E`), Ivory Cream (`#FCFAF6`, `#F7F2E8`), and Crisp White.
- **Typography**: High-luxury headings using **Playfair Display** & **Cinzel**, paired with ultra-clean modern UI typography with **Plus Jakarta Sans**.
- **Aesthetic**: Royal Indian wedding hospitality, subtle gold shimmer animations, glassmorphism card elevation, clean micro-interactions, and 100% responsive layouts across mobile, tablet, and desktop.

---

## 🚀 Complete Website Pages (13 Pages Implemented)

1. **Home (`/`)**:
   - Sticky navigation header with royal monogram emblem and "Book Your Event" CTA.
   - Royal hero banner with custom generated wedding mandap photography and clear CTAs.
   - Five signature service cards with feature highlights and booking links.
   - "Why Choose Us" highlighting six core service advantages.
   - Featured Events interactive gallery.
   - 5-step "How It Works" workflow guide.
   - Clearly marked sample client testimonials.
   - High-impact final CTA and comprehensive business footer.
2. **About Us (`/about`)**:
   - Company story, vision, core values, event coverage categories, and hospitality pledge.
3. **Services (`/services`)**:
   - In-depth presentation of all five core service pillars with feature checklists and package shortcuts.
4. **Service Details (`/services/:slug`)**:
   - Individual dedicated specification pages:
     - `/services/pandal-and-caterers` (Waterproof German Hangers, seating, chandeliers, infrastructure)
     - `/services/wedding-planning` (Turnkey curation, ritual timelines, stagecraft, VIP coordination)
     - `/services/catering-services` (Veg & multi-cuisine royal spreads, live chaat, copper presentation)
     - `/services/decoration-services` (Fresh floral mandaps, fairy light tunnels, royal entrance arches)
     - `/services/dj-and-sound` (JBL/RCF line-arrays, moving-heads, interactive LED dance floor, cold pyro)
   - Detailed descriptions, package tiers, and direct preselected booking actions.
5. **Gallery / Our Events (`/gallery`)**:
   - Filterable by categories: *All*, *Weddings*, *Pandal*, *Catering*, *Decoration*, *DJ & Sound*.
   - Interactive high-resolution lightbox modal with date tags and descriptions.
6. **Packages & Pricing (`/packages`)**:
   - Transparent tier options (*Silver Celebration*, *Gold Royale*, *Platinum Imperial*).
   - Guest suitability guidance and clear notices regarding customized quotations.
7. **Book an Event (`/book`)**:
   - Full-featured enquiry booking engine.
   - Indian mobile number validation (`/^(?:(?:\+|0{0,2})91)?[6789]\d{9}$/`).
   - Dynamic multi-service selection with URL preselection support.
   - Prevents past dates; dynamic guest count and budget selection.
   - Generates unique reference code (`TE-2026-XXXXX`).
   - Saves enquiry to persistent database with initial status **Pending**.
8. **Booking Confirmation & Status Tracker (`/booking-confirmation` & `/booking-confirmation/:reference`)**:
   - Royal confirmation badge with one-click reference code copying.
   - Live status badge (*Pending*, *Contacted*, *Quotation Sent*, *Confirmed*, *Completed*, *Cancelled*).
   - Itemized quotation amount display once assigned by administrator.
   - Instant WhatsApp follow-up link with pre-filled reference.
   - Public reference lookup tool for returning clients.
9. **Contact Us (`/contact`)**:
   - Corporate contact details, direct WhatsApp click-to-chat, and business hours.
   - Interactive contact enquiry form with backend API integration.
   - Google Maps location embed frame.
   - Frequently Asked Questions (FAQ) accordion.
10. **Privacy Policy (`/privacy-policy`)**:
    - Transparent guidelines explaining how booking data is handled and protected.
11. **Terms & Conditions (`/terms-and-conditions`)**:
    - Milestone advances, quotation validity, cancellation rules, and venue logistics.
12. **Admin Login (`/admin/login`)**:
    - Protected administrative authentication with bcrypt password verification and JWT issuance.
13. **Admin Dashboard (`/admin/dashboard`)**:
    - Real-time statistics computed directly from database records.
    - Full booking search, filtering by status/date/service, and review modal.
    - Status workflow updater, official quotation amount editor, and internal coordinator notes.
    - Gallery management (add/delete showcase items).
    - Business contact details editor with instant site-wide synchronization.
14. **Custom 404 (`*`)**:
    - Elegant branded fallback page.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, React Router DOM |
| **Backend** | Node.js, Express.js, TypeScript (`tsx`), CORS, JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| **Database** | SQLite via `better-sqlite3` (zero-setup persistent local database in `server/data/`) + Full Supabase PostgreSQL schema (`supabase/schema.sql`) |

---

## 📂 Project Structure

```
TANYA_EVENTS_WEB/
├── client/                     # Frontend React + Vite + TypeScript application
│   ├── public/
│   │   └── images/             # Generated & high-res event photography
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ServiceCard, ImageWithFallback
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── pages/              # All 13 application views
│   │   ├── services/           # api.ts (REST client with JWT handling)
│   │   ├── types/              # TypeScript models and interfaces
│   │   ├── App.tsx             # Route configuration & layout wrapper
│   │   ├── index.css           # Tailwind base & luxury utility classes
│   │   └── main.tsx            # Application entry point
│   ├── tailwind.config.js      # Brand colors, typography tokens & gradients
│   └── vite.config.ts          # Vite configuration with API proxy to port 5000
├── server/                     # Backend Express.js API
│   ├── data/                   # SQLite database storage (tanya_events.db)
│   ├── src/
│   │   ├── db/                 # database.ts (Schema DDL, WAL mode, seeds)
│   │   ├── middleware/         # auth.ts (JWT verification & role check)
│   │   ├── routes/             # auth.ts, services.ts, gallery.ts, bookings.ts, settings.ts
│   │   └── server.ts           # Express server & static SPA serving
│   ├── .env                    # Environment configuration
│   └── package.json            # Server dependencies & scripts
├── supabase/
│   └── schema.sql              # Supabase PostgreSQL schema, RLS policies, and triggers
├── scripts/
│   └── test_e2e.ps1            # Automated end-to-end API test suite
├── package.json                # Root package with unified dev and build scripts
└── README.md                   # Complete documentation
```

---

## ⚡ Quick Start & Running Locally

### 1. Prerequisites
- Node.js (v18+ or v22+)
- npm (v9+)

### 2. Setup
From the repository root (`d:\TANYA_EVENTS_WEB`):

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 3. Run in Development Mode
You can run both client and server:

**Terminal 1 (Backend Server on Port 5000):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend Client on Port 3000):**
```bash
cd client
npm run dev
```

Open `http://localhost:3000` in your browser. (All `/api` calls are automatically proxied to `http://localhost:5000`).

### 4. Run in Unified Production Mode
Build the client and let Express serve the production bundle on a single port:

```bash
# Build client
cd client
npm run build
cd ..

# Start backend server (serves API + static client)
cd server
npm start
```

Access the entire application at `http://localhost:5000`.

---

## 🔐 Administrator Access & Credentials

A default administrator account is automatically seeded upon the first database initialization:

- **Login URL**: `http://localhost:5000/admin/login` (or `/admin/login` on dev server)
- **Admin Email**: `admin@tanyaevents.com`
- **Password**: `Admin@TanyaEvents2026!`
- **Role**: `admin`

*Note: Passwords are encrypted with `bcrypt` (10 salt rounds). No plaintext credentials or secrets are stored in the client.*

---

## 🗄️ Database Schema & Supabase Setup

The application includes dual-database support:
1. **Local Persistent Database**: Pre-configured with SQLite (`server/data/tanya_events.db`) using WAL mode for maximum performance.
2. **Cloud Supabase PostgreSQL**: Fully compatible schema provided in `supabase/schema.sql`.

### Tables Overview:
- `profiles`: Administrator credentials and roles.
- `services`: Service catalog (Pandal & Caterers, Wedding Planning, Catering, Decoration, DJ Sound).
- `packages`: Configurable service packages (Classic, Deluxe, Royal Maharaja, etc.).
- `bookings`: Enquiry records, customer contact, event date, venue, guest count, status, and quotation amount.
- `booking_services`: Many-to-many junction table between bookings and requested services.
- `gallery`: Visual portfolio showcase items and categories.
- `site_settings`: Key-value store for business phone, WhatsApp, email, address, and hours.

To deploy on Supabase:
1. Open your Supabase project dashboard.
2. Navigate to the **SQL Editor**.
3. Paste the contents of `supabase/schema.sql` and run the script.
4. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `server/.env`.

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate administrator and receive JWT |
| `GET` | `/api/auth/me` | Protected | Verify current admin session |
| `GET` | `/api/services` | Public | Retrieve active services with packages |
| `GET` | `/api/services/:slug` | Public | Retrieve single service specifications |
| `POST` | `/api/services` | Protected | Add new service |
| `PUT` | `/api/services/:id` | Protected | Update service details |
| `DELETE` | `/api/services/:id` | Protected | Remove service |
| `GET` | `/api/gallery` | Public | Get published gallery items (category filterable) |
| `POST` | `/api/gallery` | Protected | Add photo to gallery |
| `DELETE` | `/api/gallery/:id` | Protected | Delete gallery photo |
| `POST` | `/api/bookings` | Public | Submit booking enquiry (validates Indian mobile, date) |
| `GET` | `/api/bookings/lookup/:ref` | Public | Track enquiry status by reference code |
| `GET` | `/api/bookings/stats` | Protected | Calculate dashboard metrics from live records |
| `GET` | `/api/bookings` | Protected | List all bookings with search and filter |
| `PATCH` | `/api/bookings/:id/status` | Protected | Update booking status |
| `PATCH` | `/api/bookings/:id/quotation`| Protected | Update quotation amount & admin notes |
| `DELETE` | `/api/bookings/:id` | Protected | Delete booking enquiry record |
| `GET` | `/api/settings` | Public | Get business contact details |
| `PUT` | `/api/settings` | Protected | Update business contact information |
| `POST` | `/api/settings/contact` | Public | Submit contact message |

---

## 🧪 Automated End-to-End Testing

An automated verification test script is included in `scripts/test_e2e.ps1`. It performs the following checks:
1. Submits an enquiry with Indian mobile format validation (`POST /api/bookings`).
2. Checks that a reference code (`TE-2026-XXXXX`) is generated with status `Pending`.
3. Verifies public reference lookup (`GET /api/bookings/lookup/:reference`).
4. Logs in as administrator (`POST /api/auth/login`) and retrieves JWT.
5. Verifies calculated stats (`GET /api/bookings/stats`).
6. Updates quotation amount (`₹4,75,000`) and advances status to `Quotation Sent`.
7. Confirms that the public lookup immediately reflects the new quotation.

To execute the test:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test_e2e.ps1
```

---

## 🌐 Production Deployment

- **Frontend (Vercel / Netlify)**:
  - Root directory: `client`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Configure environment variable `VITE_API_URL` pointing to backend.
- **Backend (Render / Railway / Fly.io / VPS)**:
  - Root directory: `server`
  - Build command: `npm run build`
  - Start command: `npm start`
  - Port: `5000` (or `PORT` environment variable)

---

## 📄 License
© 2026 **TANYA EVENT'S**. All Rights Reserved. Crafted for unforgettable celebrations.
