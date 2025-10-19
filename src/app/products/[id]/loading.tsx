// src/app/products/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-32 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Image Column */}
        <div className="aspect-square">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
        {/* Details Column */}
        <div className="flex flex-col justify-center space-y-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-1/2" />
        </div>
      </div>
    </div>
  );
}