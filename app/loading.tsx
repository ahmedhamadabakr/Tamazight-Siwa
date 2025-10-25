export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="text-center">
        {/* Optimized loading spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600 mx-auto mb-4"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-amber-400 animate-pulse mx-auto"></div>
        </div>
        
        {/* Loading text with animation */}
        <div className="space-y-2">
          <p className="text-amber-800 font-medium animate-pulse">Loading your Siwa experience...</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
