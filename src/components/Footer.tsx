// src/components/Footer.tsx
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-6 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} AFC Indonesia. All Rights Reserved.</p>
        <div className="border-t px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}