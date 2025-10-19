export default function ContactLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section Skeleton */}
      <div className="text-center mb-12">
        <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Contact Info Cards Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-20 mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form Skeleton */}
        <div className="lg:col-span-2">
          <div className="border rounded-lg shadow-lg p-6">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full mb-6 animate-pulse" />
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-11 bg-gray-200 rounded animate-pulse" />
                <div className="h-11 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-11 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}