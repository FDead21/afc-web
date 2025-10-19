export default function HomeLoading() {
  return (
    <>
      {/* Hero Skeleton */}
      <section className="text-center py-20 px-4 bg-gray-200 animate-pulse">
        <div className="h-12 bg-gray-300 rounded w-96 mx-auto mb-4" />
        <div className="h-6 bg-gray-300 rounded w-[600px] mx-auto mb-8" />
        <div className="h-11 bg-gray-300 rounded w-32 mx-auto" />
      </section>

      {/* Featured Products Skeleton */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
          <div className="h-9 bg-gray-200 rounded w-64 mx-auto mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden shadow">
                <div className="h-64 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Skeleton */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="h-9 bg-gray-200 rounded w-80 mx-auto mb-8 animate-pulse" />
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </section>
    </>
  );
}