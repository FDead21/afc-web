'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

interface WhatsAppButtonProps {
  phoneNumber: string;
  productName: string;
  variant?: 'default' | 'outline';
  className?: string;
}

export default function WhatsAppButton({ 
  phoneNumber, 
  productName,
  variant = 'default',
  className = ''
}: WhatsAppButtonProps) {
  const message = `Hi! Saya tertarik dengan produk ${productName}. Saya ingin lebih tahu / memesan produk ini.`;
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  if (!phoneNumber) return null;

  return (
    <Button
      asChild
      variant={variant}
      className={`gap-2 ${variant === 'default' ? 'bg-green-500 hover:bg-green-600' : ''} ${className}`}
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="w-5 h-5" />
        Order via WhatsApp
      </a>
    </Button>
  );
}