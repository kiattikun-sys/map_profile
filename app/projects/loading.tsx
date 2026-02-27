export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="pt-16 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="h-3 w-32 bg-blue-600/50 rounded-full mb-3 animate-pulse" />
          <div className="h-10 w-64 bg-blue-600/50 rounded-xl mb-3 animate-pulse" />
          <div className="h-5 w-96 bg-blue-600/30 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="flex-1 pt-10 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
                <div className="flex gap-2 pt-2">
                  <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
