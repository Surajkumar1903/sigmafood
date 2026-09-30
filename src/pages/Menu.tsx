import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { PRODUCTS, CATEGORIES, CATEGORY_EMOJIS, type Category } from '../data/products';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>(
    (searchParams.get('category') as Category) || 'All'
  );
  const [sort, setSort] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [showOnlyBestSeller, setShowOnlyBestSeller] = useState(false);
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    let result = [...PRODUCTS];
    if (selectedCategory !== 'All') result = result.filter(p => p.category === selectedCategory);
    if (search) result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (showOnlyBestSeller) result = result.filter(p => p.isBestSeller);
    if (showOnlyNew) result = result.filter(p => p.isNew);
    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => (a.isNew ? -1 : 1)); break;
      default: result.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return result;
  }, [selectedCategory, search, sort, priceRange, showOnlyBestSeller, showOnlyNew]);

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#070707' }}>
      {/* Header */}
      <div className="bg-[#090909] border-b border-white/5 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#f5a623] text-sm font-semibold uppercase tracking-widest mb-2">Our Menu</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Menu</h1>
          <p className="text-white/45">Choose your favorite food.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search + Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for momos, burgers, pasta..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[rgba(245,166,35,0.4)] transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-4 py-3 rounded-xl text-sm"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                showFilters ? 'bg-[rgba(245,166,35,0.15)] border-[rgba(245,166,35,0.3)] text-[#f5a623]' : 'glass border-white/8 text-white/60 hover:text-white'
              }`}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <div className="hidden sm:flex gap-1 p-1 rounded-xl glass">
              <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-[rgba(245,166,35,0.15)] text-[#f5a623]' : 'text-white/40 hover:text-white'}`}><LayoutGrid size={16} /></button>
              <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-[rgba(245,166,35,0.15)] text-[#f5a623]' : 'text-white/40 hover:text-white'}`}><List size={16} /></button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="glass rounded-2xl p-6 mb-6 border border-white/6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Price Range</p>
                <p className="text-[#f5a623] text-sm font-semibold mb-2">₹{priceRange[0]} – ₹{priceRange[1]}</p>
                <input type="range" min={0} max={300} value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} className="w-full" />
              </div>
              <div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Type</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showOnlyBestSeller} onChange={e => setShowOnlyBestSeller(e.target.checked)} />
                    <span className="text-white/70 text-sm">Best Sellers Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showOnlyNew} onChange={e => setShowOnlyNew(e.target.checked)} />
                    <span className="text-white/70 text-sm">New Items Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto scroll-touch-x pb-3 mb-6 sm:mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`flex-shrink-0 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'All' ? 'bg-[#f5a623] text-[#070707]' : 'glass text-white/60 hover:text-white border border-white/8'
            }`}
          >
            All ({PRODUCTS.length})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat ? 'bg-[#f5a623] text-[#070707]' : 'glass text-white/60 hover:text-white border border-white/8'
              }`}
            >
              <span>{CATEGORY_EMOJIS[cat]}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <p className="text-white/40 text-xs sm:text-sm">
            {filtered.length === 0 ? 'No items found' : `Showing ${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}
            {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
          </p>
          {(search || selectedCategory !== 'All' || showOnlyBestSeller || showOnlyNew) && (
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); setShowOnlyBestSeller(false); setShowOnlyNew(false); }}
              className="text-[#f5a623] text-xs sm:text-sm hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X size={13} /> Clear Filters
            </button>
          )}
        </div>

        {/* Grid: 2 Columns on Mobile */}
        {filtered.length > 0 ? (
          <div className={view === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6'
            : 'flex flex-col gap-3 sm:gap-4'
          }>
            {filtered.map(p => <ProductCard key={p.id} product={p} view={view} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-white font-semibold text-lg mb-2">No items found</p>
            <p className="text-white/40 text-sm">Try different keywords or clear filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
