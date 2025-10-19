// src/components/admin/IngredientActions.tsx
'use client';

import { deleteIngredient } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';

export default function IngredientActions({ ingredientId }: { ingredientId: string }) {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      await deleteIngredient(ingredientId);
    }
  };

  return (
    // We will add an Edit button here later
    <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
  );
}