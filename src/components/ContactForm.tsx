// src/components/ContactForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContactForm } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-gray-900 hover:bg-gray-800">
      {pending ? (
        <>
          <span className="animate-spin mr-2">⏳</span>
          Mengirim...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Kirim Pesan
        </>
      )}
    </Button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Kirimi kami pesan</CardTitle>
        <CardDescription>
          Isi halaman berikut dan tim kami akan coba menghubungi anda dalam 24 jam.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {state.success}
            </AlertDescription>
          </Alert>
        )}
        
        {state.error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {state.error}
            </AlertDescription>
          </Alert>
        )}

        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Afc Indonesia" 
                required 
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email *</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="afc@gmail.com" 
                required 
                className="h-11"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Pesan Anda *</Label>
            <Textarea 
              id="message" 
              name="message" 
              placeholder="Beritahu kami apa yang kami bisa bantu..." 
              required 
              rows={6}
              className="resize-none"
            />
          </div>
          
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}