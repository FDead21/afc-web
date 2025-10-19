// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Fetch products and posts
  const { data: products } = await supabase.from('products').select('id, created_at');
  const { data: posts } = await supabase.from('posts').select('id, created_at');

  const productUrls = products?.map(product => ({
    url: `${siteUrl}/products/${product.id}`,
    lastModified: new Date(product.created_at),
  })) || [];
  
  const postUrls = posts?.map(post => ({
    url: `${siteUrl}/blog/${post.id}`,
    lastModified: new Date(post.created_at),
  })) || [];

  // Static page URLs
  const staticUrls = [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/products`, lastModified: new Date() },
    { url: `${siteUrl}/blog`, lastModified: new Date() },
    { url: `${siteUrl}/about`, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
  ];

  return [...staticUrls, ...productUrls, ...postUrls];
}