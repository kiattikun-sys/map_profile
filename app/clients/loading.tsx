export default function ClientsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="pt-16 bg-gradient-to-br from-blue-700 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="h-3 w-24 bg-blue-600/50 rounded-full mb-3 animate-pulse" />
          <div className="h-10 w-48 bg-blue-600/50 rounded-xl mb-3 animate-pulse" />
          <div className="h-5 w-80 bg-blue-600/30 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
              <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
              <div className="h-3 w-16 bg-blue-100 rounded animate-pulse mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
