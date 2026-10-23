import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar, Search, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Packages', path: '/packages' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-maroon-950/95 backdrop-blur-md shadow-lg border-b border-gold-500/20 py-3'
          : 'bg-gradient-to-b from-maroon-950/90 via-maroon-950/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 p-[2px] shadow-gold-glow flex items-center justify-center">
              <div className="w-full h-full bg-maroon-950 rounded-full flex items-center justify-center">
                <span className="font-cinzel text-gold-400 font-bold text-lg leading-none">T</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-white group-hover:text-gold-300 transition">
                TANYA EVENT'S
              </span>
              <span className="text-[10px] tracking-widest uppercase text-gold-300 font-medium -mt-1 hidden sm:block">
                Luxury Event Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium tracking-wide transition rounded-md ${
                  isActive(link.path)
                    ? 'text-gold-400 bg-maroon-900/60 border border-gold-500/30'
                    : 'text-ivory-100 hover:text-gold-300 hover:bg-maroon-900/30'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/booking-confirmation"
              className="text-xs font-medium text-gold-300 hover:text-white flex items-center space-x-1.5 transition px-2.5 py-1.5 rounded-md hover:bg-white/5"
              title="Track existing booking status"
            >
              <Search className="w-3.5 h-3.5 text-gold-400" />
              <span>Track Enquiry</span>
            </Link>

            <Link
              to="/book"
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-maroon-950 bg-gold-btn rounded-full shadow-gold-glow transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 mr-1.5 fill-current" />
              <span>Book Your Event</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Link
              to="/book"
              className="px-3 py-1.5 text-xs font-semibold text-maroon-950 bg-gold-500 rounded-full"
            >
              Book Now
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gold-400 hover:text-white hover:bg-maroon-900/50 transition focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-maroon-950/98 backdrop-blur-xl border-b border-gold-500/20 px-4 pt-3 pb-6 animate-fadeIn">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2.5 rounded-lg text-base font-medium transition ${
                  isActive(link.path)
                    ? 'text-gold-400 bg-maroon-900/80 font-semibold'
                    : 'text-ivory-100 hover:text-gold-300 hover:bg-maroon-900/40'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-maroon-800/80 mt-2 flex flex-col space-y-2">
              <Link
                to="/booking-confirmation"
                className="flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-gold-300 border border-gold-500/30 rounded-lg hover:bg-maroon-900/50"
              >
                <Search className="w-4 h-4" />
                <span>Track Enquiry Status</span>
              </Link>

              <Link
                to="/book"
                className="flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-maroon-950 bg-gold-btn rounded-lg shadow-gold-glow"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Your Event Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
