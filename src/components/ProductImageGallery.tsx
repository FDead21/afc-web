'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Image = {
  id: string;
  image_url: string;
};

export default function ProductImageGallery({ images, productName }: { images: Image[], productName: string }) {
  const [mainImageIndex, setMainImageIndex] = useState(0);

  if (images.length === 0) {
    return (
      <Card className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-muted-foreground">Tidak ada foto</p>
      </Card>
    );
  }

  const nextImage = () => {
    setMainImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setMainImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="grid gap-4">
      {/* Main Image with Navigation */}
      <Card className="aspect-square overflow-hidden rounded-lg relative group">
        <img
          src={images[mainImageIndex].image_url}
          alt={`${productName} - Image ${mainImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {mainImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </Card>
      
      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button key={image.id} onClick={() => setMainImageIndex(index)}>
              <Card className={`aspect-square overflow-hidden rounded-md transition-all ${
                mainImageIndex === index ? 'ring-2 ring-primary shadow-md' : 'hover:ring-2 hover:ring-gray-300'
              }`}>
                <img
                  src={image.image_url}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}