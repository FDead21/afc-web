// src/app/blog/page.tsx
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function BlogPage() {
  const supabase = createClient();
  const { data: posts } = await supabase.from('posts').select('*').order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post) => (
          <Link href={`/blog/${post.id}`} key={post.id}>
            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                {post.image_url && <img src={post.image_url} alt={post.title} className="aspect-video w-full object-cover rounded-t-lg" />}
                <CardTitle className="mt-4">{post.title}</CardTitle>
                <CardDescription>By {post.author} on {new Date(post.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* We can show a snippet of content here later */}
              </CardContent>
              <CardFooter>
                  <Button variant="link">Read More &rarr;</Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}