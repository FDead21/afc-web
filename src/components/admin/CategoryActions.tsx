// src/components/admin/CategoryActions.tsx
'use client';

import { deleteCategory } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';

export default function CategoryActions({ categoryId }: { categoryId: string }) {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(categoryId);
    }
  };

  return (
    // We will add an Edit button here later
    <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
  );
}