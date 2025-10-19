// src/components/WhatsAppButton.tsx
'use client';

import Link from 'next/link';

export default function WhatsAppButton({ phoneNumber }: { phoneNumber: string }) {
  if (!phoneNumber) return null;

  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#128C7E] transition-colors"
      aria-label="Hubungi kami di WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
      >
        <path d="M16.6 14.2c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.7-.8.9-.1.1-.3.1-.5 0-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6s0-.3.1-.4c.1-.1.2-.2.4-.4.1-.1.2-.2.2-.4.1-.1 0-.3-.1-.4-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.3c.1 0 1.5.7 3.5 2.5 1.8 1.5 2.1 1.7 2.8 1.9.7.2 1.3.1 1.8-.1.5-.2 1.5-1 1.7-1.9.2-.9.2-1.7.1-1.9-.1-.2-.3-.3-.5-.4zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
      </svg>
    </Link>
  );
}