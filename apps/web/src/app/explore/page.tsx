'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Sparkles, SlidersHorizontal, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { fetchProducts, fetchCategories, fetchIndustries } from '@/lib/api';
import { Product, Category, Industry } from '@/types';

function ExploreContent() {
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('product_type') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedIndustry, setSelectedIndustry] = useState(searchParams.get('industry') || '');
  const [selectedBusinessModel, setSelectedBusinessModel] = useState(searchParams.get('business_model') || '');
  const [freeOnly, setFreeOnly] = useState(searchParams.get('free_only') === 'true');
  const [apiOnly, setApiOnly] = useState(searchParams.get('api_only') === 'true');
  const [openSourceOnly, setOpenSourceOnly] = useState(searchParams.get('open_source_only') === 'true');
  const [minContext, setMinContext] = useState(0);
  const [sortBy, setSortBy] = useState('popular');

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadTaxonomies() {
      const [cats, inds] = await Promise.all([fetchCategories(), fetchIndustries()]);
      setCategories(cats);
      setIndustries(inds);
    }
    loadTaxonomies();
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchProducts({
        q: query,
        product_type: selectedType,
        category: selectedCategory,
        industry: selectedIndustry,
        business_model: selectedBusinessModel,
        free_only: freeOnly,
        api_only: apiOnly,
        open_source_only: openSourceOnly,
        min_context: minContext,
        sort_by: sortBy,
        page,
        limit: 12
      });
      setProducts(res.products);
      setTotal(res.total);
      setLoading(false);
    }
    loadData();
  }, [
    query, selectedType, selectedCategory, selectedIndustry, 
    selectedBusinessModel, freeOnly, apiOnly, openSourceOnly, 
    minContext, sortBy, page
  ]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedType('');
    setSelectedCategory('');
    setSelectedIndustry('');
    setSelectedBusinessModel('');
    setFreeOnly(false);
    setApiOnly(false);
    setOpenSourceOnly(false);
    setMinContext(0);
    setSortBy('popular');
    setPage(1);
  };

  const totalPages = Math.ceil(total / 12) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-400" />
          Explore 10,000+ AI Products Catalog
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Filter verified AI tools, autonomous agents, foundation models, APIs, and enterprise SaaS platforms.
        </p>
      </div>

      {/* Main Grid Layout: Sidebar + Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            categories={categories}
            industries={industries}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            selectedBusinessModel={selectedBusinessModel}
            setSelectedBusinessModel={setSelectedBusinessModel}
            freeOnly={freeOnly}
            setFreeOnly={setFreeOnly}
            apiOnly={apiOnly}
            setApiOnly={setApiOnly}
            openSourceOnly={openSourceOnly}
            setOpenSourceOnly={setOpenSourceOnly}
            minContext={minContext}
            setMinContext={setMinContext}
            onReset={handleResetFilters}
          />
        </div>

        {/* Catalog Section */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Control Toolbar */}
          <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search catalog..."
                className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden w-full sm:w-auto px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-300 flex items-center justify-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-400" />
              <span>Filters</span>
            </button>

            {/* Sort & Count */}
            <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs text-gray-400 font-mono">
                Showing <strong className="text-white">{products.length}</strong> of <strong className="text-white">{total}</strong> products
              </span>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900 border border-gray-800 text-gray-200 text-xs rounded-xl p-2 focus:outline-none focus:border-blue-500"
              >
                <option value="popular">Most Popular</option>
                <option value="recently_added">Recently Added</option>
                <option value="recently_updated">Recently Updated</option>
                <option value="name_asc">Name: A-Z</option>
                <option value="context_desc">Max Context Window</option>
              </select>
            </div>

          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden">
              <FilterSidebar
                categories={categories}
                industries={industries}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedIndustry={selectedIndustry}
                setSelectedIndustry={setSelectedIndustry}
                selectedBusinessModel={selectedBusinessModel}
                setSelectedBusinessModel={setSelectedBusinessModel}
                freeOnly={freeOnly}
                setFreeOnly={setFreeOnly}
                apiOnly={apiOnly}
                setApiOnly={setApiOnly}
                openSourceOnly={openSourceOnly}
                setOpenSourceOnly={setOpenSourceOnly}
                minContext={minContext}
                setMinContext={setMinContext}
                onReset={handleResetFilters}
              />
            </div>
          )}

          {/* Product Cards Grid */}
          {loading ? (
            <div className="py-20 text-center text-sm text-gray-400">
              Loading verified market catalog...
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center space-y-3 glass-panel rounded-2xl border border-gray-800">
              <p className="text-sm font-semibold text-gray-300">No products match your specific filter criteria.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-800">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              <span className="text-xs font-mono text-gray-400">
                Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading catalog...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
