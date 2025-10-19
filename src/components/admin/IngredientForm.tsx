// src/components/admin/IngredientForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createIngredient } from '@/app/admin/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'Creating...' : 'Create Ingredient'}</Button>;
}

export default function IngredientForm() {
  const [state, formAction] = useFormState(createIngredient, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Ingredient</CardTitle>
        <CardDescription>Create a new ingredient to add to products.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ingredient Name</Label>
            <Input id="name" name="name" placeholder="e.g., Vitamin C" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Describe the ingredient and its benefits..." />
          </div>
           <div className="space-y-2">
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input id="image_url" name="image_url" placeholder="https://example.com/image.png" />
          </div>
          <SubmitButton />
          {state.success && <p className="text-sm text-green-600">{state.success}</p>}
          {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}