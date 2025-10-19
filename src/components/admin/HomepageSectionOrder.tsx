'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Section {
  id: string;
  name: string;
  order: number;
  visible: boolean;
}

export default function HomepageSectionOrder() {
  const [sections, setSections] = useState<Section[]>([
    { id: 'hero', name: 'Hero Carousel', order: 1, visible: true },
    { id: 'products', name: 'Featured Products', order: 2, visible: true },
    { id: 'quiz', name: 'Product Quiz', order: 3, visible: true },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load from database
    const supabase = createClient();
    supabase.from('site_content').select('*').eq('content_key', 'homepage_sections').single()
      .then(({ data }) => {
        if (data?.content_value) {
          setSections(JSON.parse(data.content_value));
        }
      });
  }, []);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    newSections.forEach((s, i) => s.order = i + 1);
    setSections(newSections);
  };

  const toggleVisibility = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, visible: !s.visible } : s
    ));
  };

    const saveOrder = async () => {
    setSaving(true);
    const supabase = createClient();
    
    // Check if record exists
    const { data: existing } = await supabase
        .from('site_content')
        .select('content_key')
        .eq('content_key', 'homepage_sections')
        .single();
    
    if (existing) {
        // Update existing
        await supabase
        .from('site_content')
        .update({ content_value: JSON.stringify(sections) })
        .eq('content_key', 'homepage_sections');
    } else {
        // Insert new
        await supabase
        .from('site_content')
        .insert({ content_key: 'homepage_sections', content_value: JSON.stringify(sections) });
    }
    
    setSaving(false);
    alert('Layout saved! Refresh the homepage to see changes.');
    };

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div key={section.id} className="flex items-center gap-3 p-4 border rounded-lg bg-white">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => moveSection(index, 'up')}
              disabled={index === 0}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
            >
              ▲
            </button>
            <button
              onClick={() => moveSection(index, 'down')}
              disabled={index === sections.length - 1}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
            >
              ▼
            </button>
          </div>
          
          <GripVertical className="h-5 w-5 text-gray-400" />
          
          <div className="flex-1">
            <p className="font-medium">{section.name}</p>
            <p className="text-sm text-gray-500">Order: {section.order}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor={`visible-${section.id}`} className="text-sm">
              {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Label>
            <Switch
              id={`visible-${section.id}`}
              checked={section.visible}
              onCheckedChange={() => toggleVisibility(section.id)}
            />
          </div>
        </div>
      ))}
      
      <Button onClick={saveOrder} disabled={saving} className="w-full">
        {saving ? 'Saving...' : 'Save Layout'}
      </Button>
    </div>
  );
}