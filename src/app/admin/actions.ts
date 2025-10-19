// src/app/admin/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const ingredientIdsStr = formData.get('ingredient_ids') as string;
  const ingredientIds = ingredientIdsStr ? JSON.parse(ingredientIdsStr) : [];  
  const tagsStr = formData.get('tags') as string;
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];


  // Insert product WITHOUT image_url
  const { data: product, error } = await supabase.from('products').insert([
    {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category_id: formData.get('category_id') as string || null,
      stock_quantity: parseInt(formData.get('stock_quantity') as string),
      tags: tags
    },
  ]).select().single();

  if (error) return { error: error.message };

  // Link ingredients
  if (ingredientIds.length > 0 && product) {
    const productIngredients = ingredientIds.map((ingredientId: string) => ({
      product_id: product.id,
      ingredient_id: ingredientId,
    }));
    await supabase.from('product_ingredients').insert(productIngredients);
  }

  revalidatePath('/admin');
  revalidatePath('/admin/products');
  return { success: 'Product created successfully.', productId: product.id };
}

export async function updateProduct(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const productId = formData.get('id') as string;
  const ingredientIdsStr = formData.get('ingredient_ids') as string;
  const ingredientIds = ingredientIdsStr ? JSON.parse(ingredientIdsStr) : [];
  const tagsStr = formData.get('tags') as string;
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];

  // Update product WITHOUT image_url
  const { error } = await supabase
    .from('products')
    .update({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category_id: formData.get('category_id') as string,
      stock_quantity: parseInt(formData.get('stock_quantity') as string),
      tags: tags 
    })
    .eq('id', productId);
  
  if (error) return { error: error.message };

  // Update product ingredients
  await supabase.from('product_ingredients').delete().eq('product_id', productId);
  if (ingredientIds.length > 0) {
    const productIngredients = ingredientIds.map((ingredientId: string) => ({
      product_id: productId,
      ingredient_id: ingredientId,
    }));
    await supabase.from('product_ingredients').insert(productIngredients);
  }

  revalidatePath('/admin');
  revalidatePath('/admin/products');
  revalidatePath(`/admin/edit/${productId}`);
  revalidatePath(`/products/${productId}`);

  return { success: 'Product updated successfully' };
}

export async function deleteProduct(productId: string) {
  const supabase = createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  // Delete the product (cascade should handle product_ingredients)
  const { error } = await supabase.from('products').delete().eq('id', productId);

  if (error) {
    return { error: error.message };
  }

  // Refresh the data on the admin page
  revalidatePath('/admin');
  revalidatePath('/admin/products');
  return { success: 'Product deleted successfully' };
}

export async function uploadImage(formData: FormData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file provided.' };
  }

  // Create a unique file path
  const filePath = `public/${user.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('product_images')
    .upload(filePath, file);

  if (uploadError) {
    return { error: `Upload failed: ${uploadError.message}` };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('product_images')
    .getPublicUrl(filePath);

  return { success: 'Image uploaded successfully', publicUrl };
}

export async function updateSiteContent(
  prevState: { error?: string; success?: string }, 
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const keys = [
    'hero_headline', 'hero_subheadline',
    'about_title', 'about_p1', 'about_p2', 'about_p3',
    'contact_email', 'contact_phone', 'contact_address_line1', 'contact_address_line2',
    'whatsapp_number', 'favicon_url', 'header_logo_url'
  ];

  for (const key of keys) {
    const value = formData.get(key) as string;
    const { error } = await supabase
      .from('site_content')
      .update({ content_value: value })
      .eq('content_key', key);

    if (error) return { error: `Failed to update ${key}.` };
  }

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/contact');
  return { success: 'Content updated successfully!' };
}

export async function createPost(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const postData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    author: formData.get('author') as string,
    image_url: formData.get('image_url') as string,
  };

  const { error } = await supabase.from('posts').insert([postData]);

  if (error) {
    return { error: `Failed to create post: ${error.message}` };
  }

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  return { success: 'Post created successfully!' };
}

export async function deletePost(postId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase.from('posts').delete().eq('id', postId);

  if (error) {
    return { error: `Failed to delete post: ${error.message}` };
  }

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  return { success: 'Post deleted successfully.' };
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const postData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    author: formData.get('author') as string,
    image_url: formData.get('image_url') as string,
  };

  const { error } = await supabase.from('posts').update(postData).eq('id', postId);

  if (error) {
    return { error: `Failed to update post: ${error.message}` };
  }

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  revalidatePath(`/blog/${postId}`);
  return { success: 'Post updated successfully!' };
}

export async function createCategory(prevState: { error?: string; success?: string } | null, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const categoryName = formData.get('name') as string;
  if (!categoryName) return { error: 'Category name is required.' };

  const { error } = await supabase.from('categories').insert([{ name: categoryName }]);

  if (error) {
    return { error: `Failed to create category: ${error.message}` };
  }

  revalidatePath('/admin/categories');
  return { success: 'Category created successfully!' };
}

export async function deleteCategory(categoryId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase.from('categories').delete().eq('id', categoryId);

  if (error) {
    return { error: `Failed to delete category: ${error.message}` };
  }
  
  revalidatePath('/admin/categories');
  return { success: 'Category deleted successfully.' };
}

export async function approveReview(reviewId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('reviews')
    .update({ is_approved: true })
    .eq('id', reviewId);

  if (error) return { error: 'Failed to approve review.' };

  revalidatePath('/admin/reviews');
  return { success: 'Review approved.' };
}

export async function deleteReview(reviewId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

  if (error) return { error: 'Failed to delete review.' };

  revalidatePath('/admin/reviews');
  return { success: 'Review deleted.' };
}

export async function createIngredient(prevState: { error?: string; success?: string } | null, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const ingredientData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    image_url: formData.get('image_url') as string || null,
  };

  if (!ingredientData.name) return { error: 'Ingredient name is required.' };

  const { error } = await supabase.from('ingredients').insert([ingredientData]);

  if (error) return { error: `Failed to create ingredient: ${error.message}` };
  
  revalidatePath('/admin/ingredients');
  return { success: 'Ingredient created successfully!' };
}

export async function deleteIngredient(ingredientId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase.from('ingredients').delete().eq('id', ingredientId);

  if (error) return { error: `Failed to delete ingredient: ${error.message}` };
  
  revalidatePath('/admin/ingredients');
  return { success: 'Ingredient deleted successfully.' };
}

export async function updateHeroImage(prevState: { error?: string; success?: string } | null, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const file = formData.get('heroImage') as File;
  if (!file || file.size === 0) {
    return { error: 'Please select an image to upload.' };
  }

  // Upload the new image
  const filePath = `public/hero/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from('product_images').upload(filePath, file);
  if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage.from('product_images').getPublicUrl(filePath);

  // Update the URL in the database
  const { error: dbError } = await supabase
    .from('site_content')
    .update({ content_value: publicUrl })
    .eq('content_key', 'hero_image_url');

  if (dbError) return { error: `Database update failed: ${dbError.message}` };

  revalidatePath('/'); // Revalidate the homepage to show the new image
  return { success: 'Hero image updated successfully!' };
}

export async function uploadProductImages(prevState: { error?: string; success?: string } | null, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const productId = formData.get('productId') as string;
  const files = formData.getAll('files') as File[];

  if (!productId || files.length === 0) {
    return { error: 'Product ID and files are required.' };
  }

  for (const file of files) {
    if (file.size === 0) continue;

    const filePath = `public/products/${productId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('product_images').upload(filePath, file);

    if (uploadError) return { error: `Upload failed: ${uploadError.message}` };
    
    const { data: { publicUrl } } = supabase.storage.from('product_images').getPublicUrl(filePath);

    await supabase.from('product_images').insert([{ product_id: productId, image_url: publicUrl }]);
  }
  
  revalidatePath(`/admin/edit/${productId}`);
  return { success: 'Images uploaded successfully!' };
}

export async function deleteProductImage(imageId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  // Note: For simplicity, this only deletes the database record.
  // Deleting the file from storage is an extra step we can add later if needed.
  const { error } = await supabase.from('product_images').delete().eq('id', imageId);

  if (error) return { error: 'Failed to delete image.' };
  
  // Revalidating is tricky here, so we'll refresh on the client.
  return { success: 'Image deleted.' };
}

export async function createQuizQuestion(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data, error } = await supabase.from('quiz_questions').insert([{
    question: formData.get('question') as string,
    order_index: parseInt(formData.get('order_index') as string)
  }]).select().single();

  if (error) return { error: error.message };
  
  revalidatePath('/admin/quiz');
  return { success: 'Question created', questionId: data.id };
}

export async function createQuizAnswer(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const tags = (formData.get('tags') as string).split(',').map(t => t.trim());
  
  const { error } = await supabase.from('quiz_answers').insert([{
    question_id: formData.get('question_id') as string,
    text: formData.get('text') as string,
    product_tags: tags
  }]);

  if (error) return { error: error.message };
  
  revalidatePath('/admin/quiz');
  return { success: 'Answer created' };
}

export async function deleteQuizQuestion(questionId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase.from('quiz_questions').delete().eq('id', questionId);
  if (error) return { error: error.message };
  
  revalidatePath('/admin/quiz');
  return { success: 'Question deleted' };
}

export async function deleteQuizAnswer(answerId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase.from('quiz_answers').delete().eq('id', answerId);
  if (error) return { error: error.message };
  
  revalidatePath('/admin/quiz');
  return { success: 'Answer deleted' };
}

