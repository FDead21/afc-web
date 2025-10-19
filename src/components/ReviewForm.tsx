// src/components/ReviewForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitReview } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'Submitting...' : 'Submit Review'}</Button>;
}

export default function ReviewForm({ productId }: { productId: string }) {
  const [state, formAction] = useFormState(submitReview, {});
  const [rating, setRating] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setRating(0);
    }
  }, [state.success]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
        <CardDescription>Share your thoughts with other customers.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="rating" value={rating} />
          
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`cursor-pointer ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" name="name" placeholder="e.g., Jane Doe" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea id="comment" name="comment" placeholder="What did you like or dislike?" />
          </div>

          <SubmitButton />
        </form>
        {state.success && <p className="mt-4 text-green-600">{state.success}</p>}
        {state.error && <p className="mt-4 text-red-600">{state.error}</p>}
      </CardContent>
    </Card>
  );
}