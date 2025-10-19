// src/app/admin/edit/[id]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import EditProductForm from '@/components/admin/EditProductForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient();

  const [
    { data: product },
    { data: categories },
    { data: allIngredients },
    { data: linkedIngredients },
    { data: images }
  ] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
    supabase.from('ingredients').select('id, name').order('name'),
    supabase.from('product_ingredients').select('ingredient_id').eq('product_id', id),
    supabase.from('product_images').select('id, image_url').eq('product_id', id).order('created_at')
  ]);

  if (!product) {
    notFound();
  }

  const linkedIngredientIds = linkedIngredients?.map(i => i.ingredient_id) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-gray-600">{product.name}</p>
          </div>
        </div>

        <EditProductForm 
          product={product} 
          categories={categories || []}
          allIngredients={allIngredients || []}
          linkedIngredientIds={linkedIngredientIds}
          images={images || []}
        />
      </div>
    </div>
  );
}