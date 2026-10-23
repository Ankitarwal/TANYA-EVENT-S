import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-maroon-950 text-ivory-100 border-t border-gold-500/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 p-[2px] flex items-center justify-center">
                <div className="w-full h-full bg-maroon-950 rounded-full flex items-center justify-center">
                  <span className="font-cinzel text-gold-400 font-bold text-lg">T</span>
                </div>
              </div>
              <span className="font-cinzel text-2xl font-bold tracking-wider text-white">
                TANYA EVENT'S
              </span>
            </Link>
            <p className="text-gold-300 text-sm font-medium italic">
              "Making Every Celebration Unforgettable"
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Premium event planning, grand royal pandals, gourmet multi-cuisine catering, bespoke floral decorations, and concert-grade DJ sound engineering.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-maroon-900 border border-gold-500/30 flex items-center justify-center text-gold-400 hover:text-white hover:bg-gold-600 transition"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-maroon-900 border border-gold-500/30 flex items-center justify-center text-gold-400 hover:text-white hover:bg-gold-600 transition"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-gold-400 tracking-wide">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-gold-300 transition flex items-center">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-gold-500" /> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-gold-300 transition flex items-center">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-gold-500" /> About Our Legacy
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-gold-300 transition flex items-center">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-gold-500" /> All Services
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-gold-300 transition flex items-center">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-gold-500" /> Our Event Portfolio
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-gray-300 hover:text-gold-300 transition flex items-center">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-gold-500" /> Packages & Pricing
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-gray-300 hover:text-gold-300 transition flex items-center">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-gold-500" /> Book an Event
                </Link>
              </li>
              <li>
                <Link to="/booking-confirmation" className="text-gray-300 hover:text-gold-300 transition flex items-center">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-gold-500" /> Track Booking Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Pillars */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-gold-400 tracking-wide">
              Our 5 Core Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services/pandal-and-caterers" className="text-gray-300 hover:text-gold-300 transition block">
                  Pandal & Caterers
                </Link>
              </li>
              <li>
                <Link to="/services/wedding-planning" className="text-gray-300 hover:text-gold-300 transition block">
                  Royal Wedding Planning
                </Link>
              </li>
              <li>
                <Link to="/services/catering-services" className="text-gray-300 hover:text-gold-300 transition block">
                  Gourmet Catering Services
                </Link>
              </li>
              <li>
                <Link to="/services/decoration-services" className="text-gray-300 hover:text-gold-300 transition block">
                  Theme & Floral Decoration
                </Link>
              </li>
              <li>
                <Link to="/services/dj-and-sound" className="text-gray-300 hover:text-gold-300 transition block">
                  DJ, Sound & Dance Floor
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Hours */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-gold-400 tracking-wide">
              Office & Inquiries
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
                <span>South point public school, Laxmi Market, Dr. Shambhu Sharan Prasad, New Jakkanpur, Gardanibagh, Patna, Bihar, India - 800001</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="tel:+917856831119" className="hover:text-gold-300 transition">+91 78568 31119</a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="mailto:tanyaevents.booking@gmail.com" className="hover:text-gold-300 transition">tanyaevents.booking@gmail.com</a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Mon – Sun: 9:00 AM – 9:00 PM (By Consultation)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-maroon-900 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} TANYA EVENT'S. All Rights Reserved. Crafted for unforgettable moments.</p>

          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="hover:text-gold-300 transition">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-gold-300 transition">
              Terms & Conditions
            </Link>
            <Link to="/admin/login" className="hover:text-gold-300 transition flex items-center space-x-1 text-gray-500 hover:text-gold-400">
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
