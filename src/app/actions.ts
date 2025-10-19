// src/app/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

interface FormState {
  error?: string;
  success?: string;
}

export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient();
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // Basic validation
  if (!name || !email || !message) {
    return { error: 'Please fill out all fields.' };
  }

  const { error } = await supabase.from('messages').insert([{ name, email, message }]);

  if (error) {
    return { error: `Submission failed: ${error.message}` };
  }

  revalidatePath('/contact');
  return { success: 'Thank you for your message! We will get back to you soon.' };
}

export async function submitReview(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient();

  const reviewData = {
    product_id: formData.get('productId') as string,
    reviewer_name: formData.get('name') as string,
    rating: Number(formData.get('rating')),
    comment: formData.get('comment') as string,
  };

  if (!reviewData.product_id || !reviewData.reviewer_name || !reviewData.rating) {
    return { error: 'Please fill out all required fields.' };
  }

  const { error } = await supabase.from('reviews').insert([reviewData]);

  if (error) {
    return { error: `Submission failed: ${error.message}` };
  }

  revalidatePath(`/products/${reviewData.product_id}`);
  return { success: 'Thank you for your review!' };
}

export async function searchSite(query: string) {
  if (!query) {
    return [];
  }
  const supabase = createClient();

  // Search for products and posts in parallel
  const [
    { data: products },
    { data: posts }
  ] = await Promise.all([
    supabase.from('products').select('id, name').ilike('name', `%${query}%`).limit(5),
    supabase.from('posts').select('id, title').ilike('title', `%${query}%`).limit(5)
  ]);

  // Combine and format the results
  const productResults = products?.map(p => ({ type: 'Product', id: p.id, title: p.name })) || [];
  const postResults = posts?.map(p => ({ type: 'Blog Post', id: p.id, title: p.title })) || [];

  return [...productResults, ...postResults];
}