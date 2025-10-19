// src/app/page.tsx
import { createClient } from "@/utils/supabase/server";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Product } from "@/types";
import Quiz from "@/components/Quiz";
import HeroCarousel from "@/components/HeroCarousel";
import { JSX } from "react";

export default async function HomePage() {
  const supabase = createClient();
  
  const [
    { data: allProducts },
    { data: products },
    { data: heroSlides },
    { data: questions },
    { data: sectionOrderData }
  ] = await Promise.all([
    supabase.from("products").select('*, product_images(id, image_url)'),
    supabase.from("products").select('*, product_images(id, image_url)').order('created_at', { ascending: false }).limit(3),
    supabase.from("hero_images").select('*').eq('is_active', true).order('display_order'),
    supabase.from('quiz_questions').select(`
      id,
      question,
      order_index,
      answers:quiz_answers(
        id,
        text,
        product_tags,
        question_id
      )
    `).order('order_index'),
    supabase.from('site_content').select('content_value').eq('content_key', 'homepage_sections').single()
  ]);

  // Parse section order
  const defaultSections = [
    { id: 'hero', name: 'Hero Carousel', order: 1, visible: true },
    { id: 'products', name: 'Featured Products', order: 2, visible: true },
    { id: 'quiz', name: 'Product Quiz', order: 3, visible: true },
  ];
  
  const sections = sectionOrderData?.content_value 
    ? JSON.parse(sectionOrderData.content_value)
    : defaultSections;

  // Sort by order and filter visible
  const visibleSections = sections
      .filter((s: { id: string; name: string; order: number; visible: boolean }) => s.visible)
      .sort((a: { order: number }, b: { order: number }) => a.order - b.order);

  // Section components map
  const sectionComponents: Record<string, JSX.Element> = {
    hero: <HeroCarousel key="hero" slides={heroSlides || []} />,
    
    products: (
      <section key="products" className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Produk Andalan Kami</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(products as Product[])?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    ),
    
    quiz: (
      <section key="quiz" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Anda bingung mulai darimana?</h2>
          <Quiz products={allProducts || []} questions={questions || []} />
        </div>
      </section>
    ),
  };

  return (
    <>
      {visibleSections.map((section: { id: string; name: string; order: number; visible: boolean }) => sectionComponents[section.id])}
    </>
  );
}