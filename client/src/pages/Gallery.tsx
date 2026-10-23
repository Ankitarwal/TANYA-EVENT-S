import React, { useEffect, useState } from 'react';
import { Sparkles, X, Calendar, ZoomIn, Filter } from 'lucide-react';
import { galleryApi } from '../services/api';
import { GalleryItem } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Weddings', 'Pandal', 'Catering', 'Decoration', 'DJ & Sound'];

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const data = await galleryApi.getAll(selectedCategory);
        setItems(data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [selectedCategory]);

  return (
    <div className="pt-24 pb-20 bg-ivory-50 min-h-screen">
      {/* Banner */}
      <section className="bg-maroon-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-950 via-maroon-900/90 to-maroon-950/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-maroon-900 border border-gold-500/30 px-4 py-1.5 rounded-full text-gold-300 text-xs tracking-widest uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Real Event Portfolio</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-ivory-50">
            Our Event Gallery
          </h1>
          <p className="max-w-2xl mx-auto text-gold-200 text-lg font-light">
            Explore authentic captures from royal wedding mandaps, grand pandals, exquisite floral stages, culinary spreads, and unforgettable DJ nights.
          </p>
        </div>
      </section>

      {/* Category Filter Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-center flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-maroon-900 text-gold-300 border border-gold-400 shadow-gold-glow scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gold-400 hover:text-maroon-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-72 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gold-500/20 max-w-md mx-auto">
            <p className="text-gray-500 text-sm">No gallery items found under this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group relative rounded-2xl overflow-hidden bg-maroon-950 shadow-card-lux cursor-pointer aspect-[4/3] border border-gold-500/20"
              >
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/90 via-maroon-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Hover overlay icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-maroon-950/80 border border-gold-400/50 flex items-center justify-center text-gold-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-400 bg-maroon-900/90 px-2 py-0.5 rounded border border-gold-500/30">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-1 group-hover:text-gold-200 transition">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-gray-300 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-maroon-950 rounded-3xl overflow-hidden border border-gold-500/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-maroon-900/80 border border-gold-400/50 text-gold-300 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <ImageWithFallback
                src={activeModalItem.imageUrl}
                alt={activeModalItem.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-maroon-950 text-white space-y-2 border-t border-gold-500/20">
              <div className="flex items-center space-x-3">
                <span className="text-xs uppercase font-semibold text-gold-400 bg-maroon-900 px-2.5 py-1 rounded border border-gold-500/30">
                  {activeModalItem.category}
                </span>
                {activeModalItem.eventDate && (
                  <span className="text-xs text-gray-400 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-gold-500" />
                    {new Date(activeModalItem.eventDate).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-2xl font-bold text-ivory-50">
                {activeModalItem.title}
              </h3>
              {activeModalItem.description && (
                <p className="text-sm text-gray-300 leading-relaxed">
                  {activeModalItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
