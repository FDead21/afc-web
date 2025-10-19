// src/app/api/products/route.ts

import { NextResponse } from 'next/server';
import { createClient as createSupabaseServerClient } from '@/utils/supabase/server';

export async function GET() { 
  const supabase = createSupabaseServerClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  // Pass the request to create a Supabase client that can read cookies
  const supabase = createSupabaseServerClient(); // The function now implicitly handles cookies via the 'cookies()' helper

  // Check if the user is authenticated from the server-side session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get the product data from the request body
  const productData = await request.json();

  // Insert the new product into the database
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request, // Add request here
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServerClient(); // The function now implicitly handles cookies via the 'cookies()' helper
  const { id } = params;

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Delete the product from the database
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Product deleted successfully' });
}