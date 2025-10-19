// src/app/products/page.tsx
import { createClient } from '@/utils/supabase/server';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';
import ProductSearch from '@/components/ProductSearch';

async function getProducts(categoryId?: string, searchQuery?: string) {
  const supabase = createClient();
  // ADD product_images to the select
  let query = supabase
    .from('products')
    .select('*, categories(name), product_images(id, image_url)')
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data;
}

async function getCategories() {
  const supabase = createClient();
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const selectedCategory = resolvedSearchParams?.category;
  const searchQuery = resolvedSearchParams?.search;

  const [products, categories] = await Promise.all([
    getProducts(selectedCategory, searchQuery),
    getCategories(),
  ]);

   return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Produk Kami</h1>
        <p className="text-gray-600">Temukan produk premium superfood kami</p>
      </div>

      {/* Search and Filter bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center">
        <ProductSearch />
        <ProductFilter categories={categories} />
      </div>

      {/* Results count */}
      {(searchQuery || selectedCategory) && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {products.length} {products.length === 1 ? 'result' : 'results'}
          {searchQuery && ` for "${searchQuery}"`}
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-2">Produk tidak ditemukan</p>
          <p className="text-gray-400 text-sm">Harap filter kembali</p>
        </div>
      )}
    </div>
  );
}