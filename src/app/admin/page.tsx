// src/app/admin/page.tsx
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProductActions from '@/components/admin/ProductActions';
import type { Product } from '@/types';
import CategoryChart from '@/components/admin/CategoryChart';
import { Package, MessageSquare, LayoutList, Star, Plus, Settings, FileText, Image, Mail, Shield, ArrowRight, HelpCircle } from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [
    { count: productCount },
    { count: categoryCount },
    { count: messageCount },
    { count: pendingReviewCount },
    { count: quizQuestionCount },
    { data: recentProducts },
    { data: chartData }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false),
    supabase.from('quiz_questions').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }).limit(5),
    supabase.rpc('get_product_count_by_category')
  ]);

  const quickActions = [
    { href: '/admin/create', label: 'Create Product', icon: Plus, color: 'blue' },
    { href: '/admin/categories', label: 'Categories', icon: LayoutList, color: 'purple' },
    { href: '/admin/ingredients', label: 'Ingredients', icon: Settings, color: 'green' },
    { href: '/admin/blog', label: 'Blog Posts', icon: FileText, color: 'orange' },
    { href: '/admin/quiz', label: 'Quiz', icon: HelpCircle, color: 'indigo' },
    { href: '/admin/messages', label: 'Messages', icon: Mail, color: 'red' },
    { href: '/admin/reviews', label: 'Reviews', icon: Shield, color: 'yellow' },
    { href: '/admin/content', label: 'Homepage', icon: Image, color: 'pink' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here is an overview of your store.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/products">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{productCount ?? 0}</div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  View all products <ArrowRight className="h-3 w-3 ml-1" />
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/categories">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <LayoutList className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{categoryCount ?? 0}</div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  Manage categories <ArrowRight className="h-3 w-3 ml-1" />
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/messages">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">New Messages</CardTitle>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{messageCount ?? 0}</div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  View messages <ArrowRight className="h-3 w-3 ml-1" />
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/reviews">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Reviews</CardTitle>
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Star className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingReviewCount ?? 0}</div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  Moderate reviews <ArrowRight className="h-3 w-3 ml-1" />
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Link href="/admin/quiz">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-indigo-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Quiz Questions</CardTitle>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{quizQuestionCount ?? 0}</div>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                Manage quiz <ArrowRight className="h-3 w-3 ml-1" />
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Charts Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Products per Category</CardTitle>
              <CardDescription>Visual breakdown of your product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData && chartData.length > 0 ? (
                <CategoryChart data={chartData} />
              ) : (
                <div className="h-[350px] flex items-center justify-center text-gray-400">
                  <p>No data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your store content efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.href} href={action.href}>
                      <div className="group p-4 rounded-lg border hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                        <div className="flex flex-col items-center text-center gap-2">
                          <div className={`h-10 w-10 rounded-full bg-${action.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className={`h-5 w-5 text-${action.color}-600`} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{action.label}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Products</CardTitle>
                <CardDescription>Latest products added to your catalog</CardDescription>
              </div>
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentProducts && recentProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead className="hidden sm:table-cell">Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProducts.map((product: Product & { categories?: { name: string } }) => (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.categories?.name || 'Uncategorized'}
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell font-semibold">${product.price}</TableCell>
                        <TableCell className="text-right">
                          <ProductActions productId={product.id} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No products yet</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first product</p>
                <Link href="/admin/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Product
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}