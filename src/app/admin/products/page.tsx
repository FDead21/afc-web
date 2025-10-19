// src/app/admin/products/page.tsx
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProductActions from '@/components/admin/ProductActions';
import { Plus, Package, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ProductsFilter from '@/components/admin/ProductsFilter';
import ProductsSearch from '@/components/admin/ProductsSearch';

async function getProducts(searchQuery?: string, categoryId?: string) {
  const supabase = createClient();
  let query = supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId);
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

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams?.search;
  const categoryId = resolvedParams?.category;

  const [products, categories] = await Promise.all([
    getProducts(searchQuery, categoryId),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Products</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <Link href="/admin/create">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Stock</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter(p => p.stock_quantity > 0).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Out of Stock</CardTitle>
              <Package className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter(p => p.stock_quantity === 0).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
            <CardDescription>Search and filter your products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <ProductsSearch />
              </div>
              <ProductsFilter categories={categories} />
            </div>

            {/* Results count */}
            {(searchQuery || categoryId) && (
              <div className="mb-4 text-sm text-gray-600">
                Showing {products.length} {products.length === 1 ? 'result' : 'results'}
                {searchQuery && ` for "${searchQuery}"`}
              </div>
            )}

            {/* Products Table */}
            {products.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[100px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead className="hidden sm:table-cell">Price</TableHead>
                      <TableHead className="hidden lg:table-cell">Stock</TableHead>
                      <TableHead className="hidden xl:table-cell">Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product: { 
                        id: string; 
                        name: string; 
                        description?: string;
                        image_url?: string; 
                        price: number; 
                        stock_quantity: number;
                        created_at: string;
                        categories?: { name: string };
                      }) => (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                              {product.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {product.categories?.name ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {product.categories.name}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">Uncategorized</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="font-semibold">${product.price}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={product.stock_quantity > 0 ? 'text-gray-900' : 'text-red-600'}>
                              {product.stock_quantity}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell text-sm text-gray-500">
                          {new Date(product.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <ProductActions productId={product.id} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || categoryId 
                    ? 'Try adjusting your search or filter'
                    : 'Get started by creating your first product'
                  }
                </p>
                {!searchQuery && !categoryId && (
                  <Link href="/admin/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Product
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}