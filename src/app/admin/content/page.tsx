// src/app/admin/content/page.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateSiteContent } from '@/app/admin/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Separator } from '@/components/ui/separator';
import HeroImageForm from '@/components/admin/HeroImageForm';
import Link from 'next/link';
import { ArrowLeft, Save, Image, Type, Info, Settings, CheckCircle, AlertCircle, Eye, Mail, MapPin, Phone, LayoutGrid } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeroCarouselManager from '@/components/admin/HeroCarouselManager';
import HomepageSectionOrder from '@/components/admin/HomepageSectionOrder';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
      <Save className="mr-2 h-4 w-4" />
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export default function ContentPage() {
  const [state, formAction] = useFormState(updateSiteContent, { error: undefined, success: undefined });
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*');
      const contentMap = data?.reduce((acc, item) => {
        acc[item.content_key] = item.content_value || '';
        return acc;
      }, {} as Record<string, string>) || {};
      setContent(contentMap);
      setLoading(false);
    };
    fetchContent();
  }, []);

  const handleInputChange = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold mb-1">Site Content</h1>
            <p className="text-gray-600">Manage your website content and settings</p>
          </div>
          <Link href="/" target="_blank">
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview Site
            </Button>
          </Link>
        </div>

        {/* Success/Error Messages */}
        {state.success && (
          <div className="border border-green-200 bg-green-50 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm">{state.success}</p>
          </div>
        )}
        
        {state.error && (
          <div className="border border-red-200 bg-red-50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{state.error}</p>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="layout" className="w-full">
          <TabsList className="w-full flex overflow-x-auto lg:grid lg:grid-cols-4 lg:w-auto">
              <TabsTrigger value="layout">
                <LayoutGrid className="h-4 w-4 mr-2 hidden sm:inline" />
                Layout
              </TabsTrigger>
              <TabsTrigger value="hero-carousel">
              <Image className="h-4 w-4 mr-2 hidden sm:inline" />
              Hero Carousel
            </TabsTrigger>
            <TabsTrigger value="about">
              <Info className="h-4 w-4 mr-2 hidden sm:inline" />
              About
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Mail className="h-4 w-4 mr-2 hidden sm:inline" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2 hidden sm:inline" />
              Settings
            </TabsTrigger>
          </TabsList>

          

          <form action={formAction} className="mt-6 space-y-6">

            {/* About Tab */}
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About Us Page</CardTitle>
                  <CardDescription>Edit the content for your About Us page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="about_title">Page Title</Label>
                    <Input 
                      id="about_title" 
                      name="about_title" 
                      value={content.about_title || ''} 
                      onChange={(e) => handleInputChange('about_title', e.target.value)}
                      placeholder="About AFC Indonesia"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="about_p1">First Paragraph</Label>
                    <Textarea 
                      id="about_p1" 
                      name="about_p1" 
                      value={content.about_p1 || ''} 
                      onChange={(e) => handleInputChange('about_p1', e.target.value)}
                      rows={4}
                      placeholder="Introduce your company..."
                    />
                    <p className="text-sm text-gray-500">Opening paragraph about your company</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="about_p2">Second Paragraph</Label>
                    <Textarea 
                      id="about_p2" 
                      name="about_p2" 
                      value={content.about_p2 || ''} 
                      onChange={(e) => handleInputChange('about_p2', e.target.value)}
                      rows={4}
                      placeholder="Explain your mission and values..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="about_p3">Third Paragraph</Label>
                    <Textarea 
                      id="about_p3" 
                      name="about_p3" 
                      value={content.about_p3 || ''} 
                      onChange={(e) => handleInputChange('about_p3', e.target.value)}
                      rows={4}
                      placeholder="Share your goals and commitment..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
              
              
            {/* Contact Tab */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Edit the contact details displayed on your contact page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input 
                      id="contact_email" 
                      name="contact_email" 
                      type="email"
                      value={content.contact_email || ''} 
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      placeholder="support@afc-web.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input 
                      id="contact_phone" 
                      name="contact_phone" 
                      type="tel"
                      value={content.contact_phone || ''} 
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_address_line1" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address Line 1
                    </Label>
                    <Input 
                      id="contact_address_line1" 
                      name="contact_address_line1" 
                      value={content.contact_address_line1 || ''} 
                      onChange={(e) => handleInputChange('contact_address_line1', e.target.value)}
                      placeholder="123 Health Street"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_address_line2">Address Line 2</Label>
                    <Input 
                      id="contact_address_line2" 
                      name="contact_address_line2" 
                      value={content.contact_address_line2 || ''} 
                      onChange={(e) => handleInputChange('contact_address_line2', e.target.value)}
                      placeholder="Wellness City, WC 12345"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-3">Preview</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 bg-white rounded-lg p-3">
                        <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Email Us</p>
                          <p className="text-sm text-gray-600">{content.contact_email || 'support@afc-web.com'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white rounded-lg p-3">
                        <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Call Us</p>
                          <p className="text-sm text-gray-600">{content.contact_phone || '+1 (555) 123-4567'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white rounded-lg p-3">
                        <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Visit Us</p>
                          <p className="text-sm text-gray-600">
                            {content.contact_address_line1 || '123 Health Street'}<br/>
                            {content.contact_address_line2 || 'Wellness City, WC 12345'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Site Settings</CardTitle>
                  <CardDescription>Configure general site settings and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                    <Input 
                      id="whatsapp_number" 
                      name="whatsapp_number" 
                      value={content.whatsapp_number || ''} 
                      onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                      placeholder="+1234567890"
                      type="tel"
                    />
                    <p className="text-sm text-gray-500">Include country code (e.g., +1234567890)</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="header_logo_url">Header Logo URL</Label>
                    <Input 
                      id="header_logo_url" 
                      name="header_logo_url" 
                      value={content.header_logo_url || ''} 
                      onChange={(e) => handleInputChange('header_logo_url', e.target.value)}
                      placeholder="https://example.com/logo.png"
                      type="url"
                    />
                    <p className="text-sm text-gray-500">
                      Direct URL to your logo image. Recommended height: 32-40px
                    </p>
                  </div>

                  {content.header_logo_url && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <p className="text-sm font-medium mb-2">Logo Preview:</p>
                      <img 
                        src={content.header_logo_url} 
                        alt="Logo preview" 
                        className="h-10 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<p class="text-red-600 text-sm">Invalid image URL</p>';
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sticky Save Button */}
            <div className="sticky bottom-4 bg-white border rounded-lg shadow-lg p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <p className="text-sm text-gray-600">Remember to save your changes</p>
              <SubmitButton />
            </div>
          </form>

          {/* Homepage Tab */}
            <TabsContent value="layout">
              <Card>
                <CardHeader>
                  <CardTitle>Homepage Layout</CardTitle>
                  <CardDescription>Drag to reorder sections on your homepage</CardDescription>
                </CardHeader>
                <CardContent>
                  <HomepageSectionOrder/>
                </CardContent>
              </Card>
            </TabsContent>

           <TabsContent value="hero-carousel">
            <Card>
              <CardHeader>
                <CardTitle>Hero Carousel Manager</CardTitle>
                <CardDescription>
                  Manage your homepage hero carousel slides. Create multiple slides with different images and messages.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HeroCarouselManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}