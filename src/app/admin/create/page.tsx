'use client';

import { createProduct } from '@/app/admin/actions';
import { uploadProductImages } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Package, DollarSign, Hash, Tag, Save, Image as ImageIcon, AlertCircle, Pill, X, Plus, Tags } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from '@/utils/supabase/client';

export default function CreateProductPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [ingredients, setIngredients] = useState<{ id: string; name: string; description?: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const [{ data: cats }, { data: ings }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('ingredients').select('*').order('name')
      ]);
      setCategories(cats || []);
      setIngredients(ings || []);
    };
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
      
      const newPreviews = selectedFiles.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(newPreviews).then(newPreviewUrls => {
        setPreviews(prev => [...prev, ...newPreviewUrls]);
      });
      
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
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

    if (files.length === 0) {
      setError('Please upload at least one product image');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set('category_id', selectedCategory);
    formData.set('ingredient_ids', JSON.stringify(selectedIngredients));
    formData.set('tags', tags.join(','));
    
    const result = await createProduct(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else if (result.productId) {
      const imgFormData = new FormData();
      imgFormData.append('productId', result.productId);
      files.forEach(file => imgFormData.append('files', file));
      
      const uploadResult = await uploadProductImages(null, imgFormData);
      
      if (uploadResult.error) {
        setError(`Product created but image upload failed: ${uploadResult.error}`);
        setIsSubmitting(false);
      } else {
        router.push('/admin');
      }
    }
  };

  const suggestedTags = ['focus', 'energy', 'recovery', 'wellness', 'immunity', 'performance', 'sleep', 'stress', 'muscle', 'workout', 'natural', 'organic'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Create New Product</h1>
            <p className="text-gray-600">Add a new product to your catalog</p>
          </div>
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Product Images *
              </CardTitle>
              <CardDescription>Upload multiple high-quality images (at least one required)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="h-32 w-full object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <Label htmlFor="files" className="cursor-pointer text-blue-600 hover:text-blue-700 block">
                    Click to upload images
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                  <Input 
                    id="files" 
                    type="file" 
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Product Name *
                </Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="e.g., Focus Formula" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Category *</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Describe your product..." 
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Price *
                  </Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    step="0.01" 
                    required 
                    placeholder="29.99"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock_quantity" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Stock Quantity *
                  </Label>
                  <Input 
                    id="stock_quantity" 
                    name="stock_quantity" 
                    type="number" 
                    required 
                    placeholder="100"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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
                        onClick={() => setTags([...tags, tag])}
                      >
                        + {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Ingredients
              </CardTitle>
              <CardDescription>Select the ingredients in this product</CardDescription>
            </CardHeader>
            <CardContent>
              {ingredients.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ingredients.map((ingredient) => (
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
            </CardContent>
          </Card>

          <div className="flex items-center justify-between gap-4 bg-white border rounded-lg p-4 sticky bottom-4 shadow-lg">
            <Link href="/admin">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} size="lg">
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}