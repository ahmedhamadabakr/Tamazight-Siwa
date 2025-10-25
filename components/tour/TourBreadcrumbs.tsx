'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface TourBreadcrumbsProps {
  tourTitle: string;
  tourSlug: string;
  className?: string;
}

export function TourBreadcrumbs({ tourTitle, tourSlug, className = '' }: TourBreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`} aria-label="Breadcrumb">
      <Link 
        href="/" 
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      
      <ChevronRight className="w-4 h-4 text-gray-400" />
      
      <Link 
        href="/tours" 
        className="hover:text-blue-600 transition-colors"
      >
        Tours
      </Link>
      
      <ChevronRight className="w-4 h-4 text-gray-400" />
      
      <span className="text-gray-900 font-medium truncate max-w-xs" title={tourTitle}>
        {tourTitle}
      </span>
    </nav>
  );
}

// SEO-friendly URL display component
export function TourUrlDisplay({ tourSlug, className = '' }: { tourSlug: string; className?: string }) {
  const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/tours/${tourSlug}`;
  
  return (
    <div className={`bg-gray-50 border rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Tour URL:</p>
          <p className="text-sm font-mono text-gray-800 break-all">
            {fullUrl}
          </p>
        </div>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              navigator.clipboard.writeText(fullUrl);
            }
          }}
          className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
        >
          Copy
        </button>
      </div>
    </div>
  );
}