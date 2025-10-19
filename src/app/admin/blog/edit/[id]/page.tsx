// src/app/admin/blog/edit/[id]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditPostForm from '@/components/admin/EditPostForm';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient();
  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single();

  if (!post) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8">
       <div className="mb-4">
        <Link href="/admin/blog"><Button variant="outline">&larr; Back to Blog Posts</Button></Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <EditPostForm post={post} />
        </CardContent>
      </Card>
    </div>
  );
}