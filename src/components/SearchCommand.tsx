// src/components/SearchCommand.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchSite } from '@/app/actions';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { FileText, Package } from 'lucide-react';

type SearchResult = {
  type: string;
  id: string;
  title: string;
};

export default function SearchCommand({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Debounce the search query
    const timeoutId = setTimeout(async () => {
      if (query.length > 1) {
        const searchResults = await searchSite(query);
        setResults(searchResults);
      } else {
        setResults([]);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    const url = result.type === 'Produk' ? `/products/${result.id}` : `/blog/${result.id}`;
    router.push(url);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Cari produk atau artikel..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {results.length === 0 && query.length > 1 && <CommandEmpty>Hasil tidak ditemukan.</CommandEmpty>}
        {results.length > 0 && (
          <CommandGroup heading="Results">
            {results.map((result) => (
              <CommandItem key={`${result.type}-${result.id}`} onSelect={() => handleSelect(result)}>
                {result.type === 'Product' ? <Package className="mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
                <span>{result.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}