'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/types';

export default function ProductCard({ product }: { product: Product & { product_images?: Array<{ id: string; image_url: string }> } }) {
  const images = product.product_images || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div 
          className="relative aspect-square overflow-hidden bg-gray-100"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex].image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              
              {/* Navigation arrows - only show if multiple images */}
              {images.length > 1 && isHovered && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
              
              {/* Image counter dots */}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white w-4' 
                          : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-grow">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {product.description}
            </p>
          )}
          <p className="text-xl font-bold text-gray-900">${product.price}</p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full">Lihat selengkapnya</Button>
        </CardFooter>
      </Card>
    </Link>
  );
}