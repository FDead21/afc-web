'use client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    router.push(`/products?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        type="text"
        placeholder="Cari Produk..."
        className="pl-10"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('search') || ''}
      />
    </div>
  );
}