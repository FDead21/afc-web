// src/app/blog/[id]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient();
  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single();

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-2">{post.title}</h1>
      <p className="text-gray-600 mb-4">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
      {post.image_url && <img src={post.image_url} alt={post.title} className="w-full aspect-video object-cover rounded-lg mb-8" />}
      
      {/* Render the HTML content from the rich text editor */}
      <div
        className="prose lg:prose-xl"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />
    </div>
  );
}