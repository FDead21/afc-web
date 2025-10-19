// src/components/admin/HeroImageForm.tsx
'use client';

import { useState } from 'react';
import { updateHeroImage } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function HeroImageForm({ currentImageUrl }: { currentImageUrl: string | null }) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateHeroImage(null, formData);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (result.success) {
      setMessage({ type: 'success', text: result.success });
    }
    
    setIsUploading(false);
  };

  return (
    <div className="space-y-4">
      {currentImageUrl && (
        <div>
          <Label className="mb-2 block">Current Hero Image</Label>
          <img 
            src={currentImageUrl} 
            alt="Current hero" 
            className="w-full h-48 object-cover rounded-lg border"
          />
        </div>
      )}

      {message && (
        <div className={`border rounded-lg p-4 flex items-start gap-3 ${
          message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {message.text}
          </p>
        </div>
      )}

      {/* SEPARATE FORM - NOT NESTED */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="heroImage">Upload New Hero Image</Label>
          <Input
            id="heroImage"
            name="heroImage"
            type="file"
            accept="image/*"
            required
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        {preview && preview !== currentImageUrl && (
          <div>
            <Label className="mb-2 block">Preview</Label>
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-lg border"
            />
          </div>
        )}

        <Button type="submit" disabled={isUploading}>
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload Hero Image'}
        </Button>
      </form>
    </div>
  );
}