import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import Pagination from '../components/ui/Pagination';
import * as productsApi from '../api/products.api';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const page = Number(searchParams.get('page') || 1);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const order = searchParams.get('order') || 'desc';

  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, search, category, minPrice, maxPrice, sortBy, order }],
    queryFn: () =>
      productsApi.getProducts({ page, limit: 12, search, category, minPrice, maxPrice, sortBy, order }),
    keepPreviousData: true,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
    staleTime: 60000,
  });

  const result = data?.data?.data || {};
  const categories = categoriesData?.data?.data?.categories || [];

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const setPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', p);
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  return (
    <div className="container py-8">
      {/* Top bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="input pl-10"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setParam('search', e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split('-');
              setParam('sortBy', s);
              setParam('order', o);
            }}
            className="input w-auto"
          >
            <option value="createdAt-desc">Newest</option>
            <option value="createdAt-asc">Oldest</option>
            <option value="finalPrice-asc">Price: Low to High</option>
            <option value="finalPrice-desc">Price: High to Low</option>
            <option value="rating.average-desc">Top Rated</option>
          </select>

          <button onClick={() => setShowFilters(!showFilters)} className="btn-outline btn">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>

          {(search || category || minPrice || maxPrice) && (
            <button onClick={clearFilters} className="btn-secondary btn">
              <X className="h-4 w-4" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card p-4 mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <label className="label">Category</label>
            <select value={category} onChange={(e) => setParam('category', e.target.value)} className="input">
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Min Price ($)</label>
            <input type="number" value={minPrice} onChange={(e) => setParam('minPrice', e.target.value)} className="input" placeholder="0" />
          </div>
          <div>
            <label className="label">Max Price ($)</label>
            <input type="number" value={maxPrice} onChange={(e) => setParam('maxPrice', e.target.value)} className="input" placeholder="9999" />
          </div>
        </div>
      )}

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-gray-500 mb-4">
          {result.total || 0} product{result.total !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <ProductGridSkeleton count={12} />
      ) : result.products?.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {result.products?.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {result.pages > 1 && (
        <div className="flex justify-center mt-10">
          <Pagination page={result.page} pages={result.pages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
