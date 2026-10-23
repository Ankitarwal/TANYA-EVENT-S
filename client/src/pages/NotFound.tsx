import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-16 bg-ivory-50 px-4">
      <div className="text-center max-w-lg space-y-6">
        <div className="w-20 h-20 rounded-full bg-gold-100 border-2 border-gold-400 flex items-center justify-center mx-auto text-gold-700 shadow-gold-glow">
          <Sparkles className="w-10 h-10" />
        </div>

        <h1 className="font-serif text-6xl sm:text-7xl font-bold text-maroon-950">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-gray-800">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            The page or event resource you are seeking does not exist or may have been relocated.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-bold text-maroon-950 bg-gold-btn shadow-gold-glow hover:scale-105 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-semibold text-maroon-900 bg-white border border-gold-500/30 hover:bg-gold-50 transition"
          >
            <span>Contact Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
