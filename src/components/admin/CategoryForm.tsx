// src/components/admin/CategoryForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useActionState } from 'react'
import { createCategory } from '@/app/admin/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'Creating...' : 'Create Category'}</Button>;
}

export default function CategoryForm() {
  const [state, formAction] = useActionState(createCategory, { error: '' });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if ('success' in state && state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <Input name="name" placeholder="e.g., Immunity Boosters" required />
      <SubmitButton />
      {'success' in state && state.success && <p className="text-sm text-green-600">{state.success}</p>}
      {'error' in state && state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}