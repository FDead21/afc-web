// src/app/contact/page.tsx
import { createClient } from '@/utils/supabase/server';
import ContactForm from '@/components/ContactForm';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';

export default async function ContactPage() {
  const supabase = createClient();
  const { data: contentData } = await supabase.from('site_content').select('*');
  const content = contentData?.reduce((acc, item) => {
    acc[item.content_key] = item.content_value;
    return acc;
  }, {} as Record<string, string>) || {};
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Anda punya pertanyaan mengenai produk kami? Kami dengan senang dapat mendengarkan keinginan anda. Kirim pesan anda dan kami akan membalas sesegera mungkin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email Kami</h3>
                  <p className="text-sm text-gray-600">{content.contact_email || 'support@afc-web.com'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Hubungi Kami</h3>
                  <p className="text-sm text-gray-600">{content.contact_phone || '+1 (555) 123-4567'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Kunjungi Kami</h3>
                  <p className="text-sm text-gray-600">
                    {content.contact_address_line1 || '123 Health Street'}<br/>
                    {content.contact_address_line2 || 'Wellness City, WC 12345'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Contact Form - Client Component */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}