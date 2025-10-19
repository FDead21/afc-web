// src/app/products/[id]/page.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ReviewForm from '@/components/ReviewForm'; 
import { Star } from 'lucide-react';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import type { Metadata } from 'next';
import ProductImageGallery from '@/components/ProductImageGallery';
import WhatsAppButton from '@/components/WhatsAppButton';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;
  const cookieStore = cookies();
    const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
      },
    }
  );
  
  const { data: product } = await supabase.from('products').select('name, description').eq('id', id).single();

  if (!product) {
    return { title: 'Produk tidak dapat ditemukan', description: 'Produk ini tidak dapat ditemukan.' };
  }

  return {
    title: product.name,
    description: product.description?.substring(0, 160) || 'A high-quality superfood.',
  };
}

function StarRating({ rating, totalReviews }: { rating: number, totalReviews: number }) {
  const fullStars = Math.round(rating);
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-5 h-5 ${i < fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        ))}
      </div>
      <span className="text-gray-500 text-sm">({totalReviews} reviews)</span>
    </div>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
      },
    }
  );

  const { data: whatsappData } = await supabase
  .from('site_content')
  .select('content_value')
  .eq('content_key', 'whatsapp_number')
  .single();

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name), reviews(*), product_ingredients(*, ingredients(*)), product_images(id, image_url)')
    .eq('id', id)
    .eq('reviews.is_approved', true)
    .single();

  if (!product) {
    notFound();
  }

  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) / reviews.length
    : 0;

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.product_images?.map((img: { image_url: string }) => img.image_url) || [],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'AFC Indonesia',
    },
    sku: product.id,
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.id}`,
      priceCurrency: 'IDR', 
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: reviews.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      reviewCount: reviews.length,
    } : undefined,
  };

  return (
<>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    <div className="container mx-auto px-4 py-8">
      <Link href="/products">
        <Button variant="outline" className="mb-8">&larr; Kembali ke Produk</Button>
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
        {/* Image Column */}
        <div>
          <div className="sticky top-24">
          <ProductImageGallery images={product.product_images || []} productName={product.name} />
        </div>
        </div>
        {/* Details Column */}
        <div className="flex flex-col justify-center">
          {product.categories && (
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                {product.categories.name}
              </span>
            </div>
          )}
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
          {reviews.length > 0 && (
            <div className="mb-4">
              <StarRating rating={averageRating} totalReviews={reviews.length} />
            </div>
          )}
          
          <p className="text-3xl font-semibold my-4">${product.price}</p>
            <div className="prose prose-gray mb-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              {product.description || 'No description available.'}
            </p>
          </div>

          <WhatsAppButton 
            phoneNumber={whatsappData?.content_value || ''} 
            productName={product.name}
            className="w-full"
          />
        </div>

        {product.product_ingredients && product.product_ingredients.length > 0 && (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Bahan Utama</h3>
            <div className="space-y-3">
              {product.product_ingredients.map((pi: { ingredients: { name: string; description?: string } }, index: number) => (
                <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">{pi.ingredients.name}</p>
                    {pi.ingredients.description && (
                      <p className="text-sm text-gray-600 mt-1">{pi.ingredients.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* <div className="border-t pt-12">
          <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <ReviewForm productId={product.id} />
              </div>
            </div>
            
            <div className="lg:col-span-2">
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="bg-white border rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-lg">{review.reviewer_name}</p>
                          <StarRating rating={review.rating} totalReviews={0} />
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-lg">No reviews yet.</p>
                  <p className="text-gray-400 text-sm mt-1">Be the first to leave a review!</p>
                </div>
              )}
            </div>
          </div>
        </div> */}
      </div>
    </div>
    </>
  );
}