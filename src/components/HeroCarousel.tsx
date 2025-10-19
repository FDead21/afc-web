'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

type HeroSlide = {
  id: string;
  image_url: string;
  headline: string | null;
  subheadline: string | null;
  cta_text: string | null;
  cta_url: string | null;
  display_order: number;
};

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) {
    return (
      <section className="relative bg-gradient-to-r from-blue-500 to-purple-600 min-h-[600px] flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Selamat datang di website kami</h1>
          <p className="text-xl md:text-2xl mb-8">Tidak ada gambar yang dapat ditampilkan untuk saat ini.</p>
          <Link href="/products">
            <Button size="lg" variant="secondary">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image_url}
              alt={slide.headline || 'Hero slide'}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 max-w-5xl">
                {slide.headline && (
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 animate-fade-in drop-shadow-2xl">
                    {slide.headline}
                  </h1>
                )}
                {slide.subheadline && (
                  <p className="text-lg md:text-2xl lg:text-3xl text-white mb-8 animate-fade-in animation-delay-200 drop-shadow-lg">
                    {slide.subheadline}
                  </p>
                )}
                {slide.cta_text && slide.cta_url && (
                  <Link href={slide.cta_url}>
                    <Button size="lg" className="animate-fade-in animation-delay-400 text-lg px-8 py-6">
                      {slide.cta_text}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentIndex
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}