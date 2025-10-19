// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppActionButton";
import { createClient } from "@/utils/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | AFC Indonesia',
    default: 'AFC Indonesia',
  },
  description: "High-quality superfood to boost your wellness.",
  icons: {
    icon: '/favicon-afc.ico?v=1', 
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const [
    { data: whatsAppData },
    { data: logoData }
  ] = await Promise.all([
    supabase.from('site_content').select('content_value').eq('content_key', 'whatsapp_number').single(),
    supabase.from('site_content').select('content_value').eq('content_key', 'header_logo_url').single()
  ]);
  
  const whatsappNumber = whatsAppData?.content_value || '';
  const headerLogoUrl = logoData?.content_value || '';

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header logoUrl={headerLogoUrl} />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <WhatsAppButton phoneNumber={whatsappNumber} />
      </body>
    </html>
  );
}