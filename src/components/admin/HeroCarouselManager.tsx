'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Plus, GripVertical, Eye, EyeOff } from 'lucide-react';
import { uploadImage } from '@/app/admin/actions';

type HeroSlide = {
  id: string;
  image_url: string;
  headline: string | null;
  subheadline: string | null;
  cta_text: string | null;
  cta_url: string | null;
  display_order: number;
  is_active: boolean;
};

export default function HeroCarouselManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('hero_images')
      .select('*')
      .order('display_order');
    setSlides(data || []);
    setLoading(false);
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    const supabase = createClient();
    await supabase
      .from('hero_images')
      .update({ is_active: !currentState })
      .eq('id', id);
    fetchSlides();
  };

  const deleteSlide = async (id: string) => {
    if (!confirm('Delete this slide?')) return;
    const supabase = createClient();
    await supabase.from('hero_images').delete().eq('id', id);
    fetchSlides();
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Existing Slides */}
      {slides.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Current Slides ({slides.length})</h3>
          {slides.map((slide) => (
            <Card key={slide.id} className={!slide.is_active ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={slide.image_url}
                    alt={slide.headline || 'Slide'}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{slide.headline || 'Untitled'}</h4>
                    <p className="text-sm text-gray-600">{slide.subheadline}</p>
                    {slide.cta_text && (
                      <p className="text-sm text-blue-600 mt-1">
                        CTA: {slide.cta_text} → {slide.cta_url}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(slide.id, slide.is_active)}
                    >
                      {slide.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteSlide(slide.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Slide Button */}
      {!showAddForm && (
        <Button onClick={() => setShowAddForm(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Slide
        </Button>
      )}

      {/* Add New Slide Form */}
      {showAddForm && (
        <AddSlideForm
          onSuccess={() => {
            setShowAddForm(false);
            fetchSlides();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

function AddSlideForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    headline: '',
    subheadline: '',
    cta_text: '',
    cta_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsSubmitting(true);

    // Upload image first
    const imageFormData = new FormData();
    imageFormData.append('file', file);
    const uploadResult = await uploadImage(imageFormData);

    if (uploadResult.error) {
      alert('Image upload failed: ' + uploadResult.error);
      setIsSubmitting(false);
      return;
    }

    // Create slide
    const supabase = createClient();
    const { error } = await supabase.from('hero_images').insert([
      {
        image_url: uploadResult.publicUrl,
        headline: formData.headline || null,
        subheadline: formData.subheadline || null,
        cta_text: formData.cta_text || null,
        cta_url: formData.cta_url || null,
        display_order: 0,
        is_active: true,
      },
    ]);

    if (error) {
      alert('Failed to create slide: ' + error.message);
    } else {
      onSuccess();
    }
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Hero Slide</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <Label>Hero Image *</Label>
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded" />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <Label htmlFor="slide-image" className="cursor-pointer text-blue-600">
                  Click to upload
                </Label>
                <Input
                  id="slide-image"
                  type="file"
                  accept="image/*"
                  required
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => setPreview(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <Label>Headline</Label>
            <Input
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="Elevate Your Wellness Journey"
            />
          </div>

          <div>
            <Label>Sub-headline</Label>
            <Textarea
              value={formData.subheadline}
              onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
              placeholder="Discover our premium range..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>CTA Button Text</Label>
              <Input
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                placeholder="Shop Now"
              />
            </div>
            <div>
              <Label>CTA Button URL</Label>
              <Input
                value={formData.cta_url}
                onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                placeholder="/products"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting || !file}>
              {isSubmitting ? 'Creating...' : 'Create Slide'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}