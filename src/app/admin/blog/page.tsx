// src/app/admin/blog/page.tsx
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PostActions from '@/components/admin/PostActions';

export default async function AdminBlogPage() {
  const supabase = createClient();
  const { data: posts } = await supabase.from('posts').select('*').order('created_at', { ascending: false });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <Link href="/admin"><Button variant="outline">&larr; Back to Dashboard</Button></Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Blog Posts</CardTitle>
          <CardDescription>Create, edit, and delete articles for your site.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Link href="/admin/blog/create"><Button>+ Create New Post</Button></Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
             <TableBody>
              {posts?.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {/* Use the PostActions component here */}
                    <PostActions postId={post.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}