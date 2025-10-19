// src/app/about/page.tsx
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AboutPage() {
  const supabase = createClient();
  const { data: contentData } = await supabase.from("site_content").select('*');
  const content = contentData?.reduce((acc, item) => {
    acc[item.content_key] = item.content_value;
    return acc;
  }, {} as Record<string, string>) || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">{content.about_title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-gray-700">
          <p>{content.about_p1}</p>
          <p>{content.about_p2}</p>
          <p>{content.about_p3}</p>
        </CardContent>
      </Card>
    </div>
  );
}