import { X, Search, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store';
import { PRODUCTS, CATEGORIES } from '../data/products';

const POPULAR_SEARCHES = ['Fried Momos', 'Cheese Burger', 'White Sauce Pasta', 'Cigar Rolls', 'Cheese Fries'];

export default function SearchModal() {
  const isOpen = useUIStore(s => s.isSearchOpen);
  const setSearchOpen = useUIStore(s => s.setSearchOpen);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('sigma-recent-searches') || '[]'); } catch { return []; }
  });
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 100); }
    else { setQuery(''); }
  }, [isOpen]);

  const results = query.length > 1
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recent.filter(r => r !== q)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem('sigma-recent-searches', JSON.stringify(updated));
    setSearchOpen(false);
    navigate(`/menu?search=${encodeURIComponent(q)}`);
  };

  const handleProductClick = (id: string) => {
    setSearchOpen(false);
    navigate(`/product/${id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSearchOpen(false)} />
      <div className="relative w-full max-w-2xl bg-[#0e0e0e] rounded-2xl border border-white/8 shadow-2xl animate-scale-in overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <Search size={20} className="text-[#f5a623] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search your favorite food..."
            className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none text-base"
          />
          <button onClick={() => setSearchOpen(false)} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {/* Results */}
          {results.length > 0 ? (
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Results</p>
              <div className="space-y-1">
                {results.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleProductClick(p.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                  >
                    <span className="text-2xl">{p.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{p.name}</p>
                      <p className="text-white/40 text-xs">{p.category} • ₹{p.price}</p>
                    </div>
                    <ArrowRight size={14} className="text-white/20 group-hover:text-[#f5a623] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ) : query.length > 1 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-white/50 text-sm">No results for "{query}"</p>
              <p className="text-white/30 text-xs mt-1">Try a different keyword</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Popular */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} className="text-[#f5a623]" />
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Popular Searches</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map(s => (
                    <button
                      key={s}
                      onClick={() => handleSearch(s)}
                      className="px-3 py-1.5 rounded-full glass text-white/60 text-sm hover:text-[#f5a623] hover:border-[rgba(245,166,35,0.3)] transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent */}
              {recent.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={14} className="text-white/30" />
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Recent</p>
                    <button onClick={() => { setRecent([]); localStorage.removeItem('sigma-recent-searches'); }} className="ml-auto text-white/20 text-xs hover:text-white/50">Clear</button>
                  </div>
                  <div className="space-y-1">
                    {recent.map(r => (
                      <button
                        key={r}
                        onClick={() => handleSearch(r)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-left"
                      >
                        <Clock size={13} className="text-white/30" />
                        <span className="text-white/60 text-sm">{r}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Browse Categories</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSearchOpen(false); navigate(`/menu?category=${cat}`); }}
                      className="flex items-center gap-2 p-2.5 rounded-xl glass hover:border-[rgba(245,166,35,0.3)] transition-all text-left"
                    >
                      <span className="text-lg">{PRODUCTS.find(p => p.category === cat)?.emoji || '🍴'}</span>
                      <span className="text-white/70 text-sm">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
