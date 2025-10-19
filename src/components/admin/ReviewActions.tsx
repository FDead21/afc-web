// src/components/admin/ReviewActions.tsx
'use client';

import { Button } from "@/components/ui/button";
import { approveReview, deleteReview } from '@/app/admin/actions';
import { Check, Trash2 } from 'lucide-react';

export default function ReviewActions({ review }: { review: { id: string; is_approved: boolean } }) {
  const handleApprove = async () => {
    await approveReview(review.id);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await deleteReview(review.id);
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      {!review.is_approved && (
        <Button size="sm" onClick={handleApprove} variant="default">
          <Check className="h-4 w-4 mr-1" />
          Approve
        </Button>
      )}
      <Button size="sm" onClick={handleDelete} variant="destructive">
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </div>
  );
}