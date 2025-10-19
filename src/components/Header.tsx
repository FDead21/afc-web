// src/components/Header.tsx
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, X, Home, Package, FileText, Info, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header({ logoUrl }: { logoUrl: string }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Produk Kami', icon: Package },
    // { href: '/blog', label: 'Blog', icon: FileText },
    // { href: '/about', label: 'About Us', icon: Info },
    { href: '/contact', label: 'Kontak', icon: Mail },
  ];

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
  const handleScroll = () => setIsScrolled(window.scrollY > 10);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`border-b sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-sm' 
        : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          {logoUrl ? (
            <img src={logoUrl} alt="AFC Indonesia Logo" className="h-10 w-auto" />
          ) : (
            'AFC Indoensia'
          )}
        </Link>
       
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`text-gray-600 hover:text-gray-900 transition-all relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-900 after:transition-all ${
                pathname === link.href ? 'text-gray-900 font-medium after:w-full after:bg-gray-900' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Buka Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
              <div className="flex flex-col h-full">
                {/* Header Section */}
                <SheetHeader className="px-6 py-5 border-b">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-left">
                      <Link 
                        href="/" 
                        onClick={() => setIsSheetOpen(false)}
                        className="inline-block"
                      >
                        {logoUrl ? (
                          <img 
                            src={logoUrl} 
                            alt="AFC Indonesia Logo" 
                            className="h-8 w-auto" 
                          />
                        ) : (
                          <span className="text-xl font-bold">AFC Indonesia</span>
                        )}
                      </Link>
                    </SheetTitle>
                  </div>
                </SheetHeader>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6">
                  <div className="space-y-1">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsSheetOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                          pathname === link.href 
                            ? 'bg-gray-100 text-gray-900 font-semibold' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        >
                          <Icon className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                          <span className="font-medium">{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}