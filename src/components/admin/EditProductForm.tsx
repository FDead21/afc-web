// src/components/admin/EditProductForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProduct, uploadImage } from '@/app/admin/actions';
import { X, Upload, Plus } from 'lucide-react';
import { uploadProductImages, deleteProductImage } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign, Hash, Tag, Save, Image as ImageIcon, AlertCircle, Pill, Tags } from 'lucide-react';
import Link from 'next/link';

export default function EditProductForm({ 
  product, 
  categories, 
  allIngredients, 
  linkedIngredientIds, 
  images 
}: { 
  product: { 
    id: string; 
    name: string; 
    description?: string; 
    price: number; 
    stock_quantity: number; 
    category_id: string; 
    image_url?: string; 
    tags?: string[] 
  }; 
  categories: { id: string; name: string }[]; 
  allIngredients: { id: string; name: string }[]; 
  linkedIngredientIds: string[]; 
  images: { id: string; image_url: string }[] 
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(product.image_url);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(linkedIngredientIds);
  const [tags, setTags] = useState<string[]>(product.tags || []);
  const [tagInput, setTagInput] = useState('');
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const toggleIngredient = (ingredientId: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    let imageUrl: string | null = product.image_url;

    if (file) {
      const imageFormData = new FormData();
      imageFormData.append('file', file);
      const uploadResult = await uploadImage(imageFormData);

      if (uploadResult.error) {
        setError(`Image upload failed: ${uploadResult.error}`);
        setIsSubmitting(false);
        return;
      }
      imageUrl = uploadResult.publicUrl ?? null;
    }

    formData.set('image_url', imageUrl || '');
    formData.set('id', product.id);
    formData.set('ingredient_ids', JSON.stringify(selectedIngredients));
    formData.set('tags', tags.join(','));

    const result = await updateProduct(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push('/admin');
    }
  };

  // Suggested tags
  const suggestedTags = ['focus', 'energy', 'recovery', 'wellness', 'immunity', 'performance', 'sleep', 'stress', 'muscle', 'workout', 'natural', 'organic'];

  return (
    <div className="space-y-6">
      {error && (
        <div className="border border-red-200 bg-red-50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Additional Images Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Product Images *
            </CardTitle>
            <CardDescription>Upload multiple high-quality images for your product gallery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {images && images.length > 0 && (
                <div>
                  <Label className="mb-2 block">Current Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img: { id: string; image_url: string }) => (
                      <div key={img.id} className="relative group">
                        <img 
                          src={img.image_url} 
                          alt="Product" 
                          className="h-32 w-full object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm('Delete this image?')) {
                              await deleteProductImage(img.id);
                              window.location.reload();
                            }
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <Label className="mb-2 block">Add More Images</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <Label htmlFor="additional-files" className="cursor-pointer text-blue-600 hover:text-blue-700 block mb-1">
                    Click to upload images
                  </Label>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                  <Input 
                    id="additional-files" 
                    type="file" 
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const formData = new FormData();
                        formData.append('productId', product.id);
                        Array.from(files).forEach(file => formData.append('files', file));
                        
                        const result = await uploadProductImages(null, formData);
                        if (result.error) {
                          setError(result.error);
                        } else {
                          window.location.reload();
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {images.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ This product has no images. Please upload at least one image.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select name="category_id" defaultValue={product.category_id}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: { id: string; name: string }) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Name
              </Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={product.name} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={product.description || ''} 
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price
                </Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  defaultValue={product.price} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Stock Quantity
                </Label>
                <Input 
                  id="stock_quantity" 
                  name="stock_quantity" 
                  type="number" 
                  defaultValue={product.stock_quantity} 
                  required 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Tags Card */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5 text-blue-600" />
              Quiz Tags
            </CardTitle>
            <CardDescription>
              Tags help the quiz recommend this product. Add keywords like focus, energy, recovery.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add Tag Input */}
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Type a tag and press Enter"
                className="flex-1"
              />
              <Button type="button" onClick={addTag} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Suggested Tags */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Suggested tags:</Label>
              <div className="flex flex-wrap gap-2">
                {suggestedTags
                  .filter(tag => !tags.includes(tag))
                  .map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-100"
                      onClick={() => {
                        setTags([...tags, tag]);
                      }}
                    >
                      + {tag}
                    </Badge>
                  ))}
              </div>
            </div>

            {tags.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  💡 Add tags to make this product discoverable through the quiz!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ingredients Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Ingredients
            </CardTitle>
            <CardDescription>Select the ingredients in this product</CardDescription>
          </CardHeader>
          <CardContent>
            {allIngredients.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allIngredients.map((ingredient: { id: string; name: string }) => (
                  <div key={ingredient.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ingredient-${ingredient.id}`}
                      checked={selectedIngredients.includes(ingredient.id)}
                      onCheckedChange={() => toggleIngredient(ingredient.id)}
                    />
                    <Label
                      htmlFor={`ingredient-${ingredient.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {ingredient.name}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No ingredients available.</p>
                <Link href="/admin/ingredients" className="text-blue-600 hover:underline text-sm">
                  Add ingredients first
                </Link>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4">
              {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''} selected
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 bg-white border rounded-lg p-4 sticky bottom-4 shadow-lg">
          <Link href="/admin">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} size="lg">
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}