// src/components/admin/EditPostForm.tsx
'use client';

import { updatePost } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function EditPostForm({ post }: { post: { id: string; title: string; author?: string; image_url?: string; content?: string } }) {
  const [content, setContent] = useState(post.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await updatePost(post.id, formData);

    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage(result.success);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Post Title</Label>
        <Input id="title" name="title" required defaultValue={post.title} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input id="author" name="author" defaultValue={post.author} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image_url">Featured Image URL</Label>
        <Input id="image_url" name="image_url" placeholder="https://example.com/image.png" defaultValue={post.image_url} />
      </div>
      <div className="space-y-2">
        <Label>Content</Label>
        <input type="hidden" name="content" value={content} />
        <RichTextEditor
          initialContent={content}
          onChange={(html) => setContent(html)}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
      {message && <p className="mt-4 text-sm font-medium">{message}</p>}
    </form>
  );
}