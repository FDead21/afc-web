// src/app/admin/blog/create/page.tsx
'use client';

import { createPost } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import RichTextEditor from '@/components/admin/RichTextEditor'; // CORRECT: Import our TipTap editor

export default function CreatePostPage() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Manual submit handler
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await createPost(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push('/admin/blog');
    }
  };

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          {/* The form now correctly uses onSubmit */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" name="author" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Featured Image URL</Label>
              <Input id="image_url" name="image_url" placeholder="https://example.com/image.png" />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              {/* This hidden input's value is controlled by the editor's state */}
              <input type="hidden" name="content" value={content} />
              {/* CORRECT: Use the TipTap RichTextEditor component */}
              <RichTextEditor
                initialContent=""
                onChange={(html) => setContent(html)}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </Button>
          </form>
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}