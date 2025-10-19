'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Category = {
  id: string;
  name: string;
};

export default function ProductFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';

  const handleFilterChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    
    router.push(`/products?${params.toString()}`);
  };

  return (
    <Select value={selectedCategory} onValueChange={handleFilterChange}>
      <SelectTrigger className="w-[200px] h-10">
        <SelectValue placeholder="Semua Prduk" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Produk</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}