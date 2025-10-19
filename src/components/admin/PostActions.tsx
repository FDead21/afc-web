'use client';

import { deletePost } from '@/app/admin/actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PostActions({ postId }: { postId: string }) {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const result = await deletePost(postId);
      if (result.error) {
        alert(result.error);
      }
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <Link href={`/admin/blog/edit/${postId}`}>
        <Button variant="outline" size="sm">Edit</Button>
      </Link>
      <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
    </div>
  );
}