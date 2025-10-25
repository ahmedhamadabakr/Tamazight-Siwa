'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, RefreshCw } from 'lucide-react';

interface SlugManagerProps {
  tourId: string;
  currentTitle: string;
  currentSlug?: string;
  onSlugUpdate?: (newSlug: string) => void;
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

export function SlugManager({ tourId, currentTitle, currentSlug, onSlugUpdate }: SlugManagerProps) {
  const [slug, setSlug] = useState(currentSlug || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerateSlug = () => {
    const newSlug = generateSlug(currentTitle);
    setSlug(newSlug);
  };

  const handleUpdateSlug = async () => {
    if (!slug.trim()) {
      setMessage('Slug cannot be empty');
      return;
    }

    setIsUpdating(true);
    setMessage('');

    try {
      const response = await fetch(`/api/tours/${tourId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: currentTitle,
          slug: slug.trim(),
          // Add other required fields to prevent validation errors
          description: 'Updated via slug manager',
          duration: '1 day',
          price: 100,
          location: 'Siwa',
          category: 'Adventure'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Slug updated successfully!');
        onSlugUpdate?.(slug.trim());
      } else {
        setMessage(data.error || 'Failed to update slug');
      }
    } catch (error) {
      setMessage('Network error occurred');
      console.error('Error updating slug:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/tours/${slug}`;
    navigator.clipboard.writeText(url);
    setMessage('URL copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleOpenTour = () => {
    const url = `/tours/${slug}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">URL Slug Management</h3>
        <Badge variant="outline" className="text-xs">
          SEO Friendly URLs
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Title:
          </label>
          <p className="text-sm text-gray-600 bg-white p-2 rounded border">
            {currentTitle}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Slug:
          </label>
          <div className="flex space-x-2">
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Enter URL slug"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateSlug}
              className="whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Generate
            </Button>
          </div>
        </div>

        {slug && (
          <div className="bg-white p-3 rounded border">
            <p className="text-xs text-gray-500 mb-1">Preview URL:</p>
            <div className="flex items-center justify-between">
              <code className="text-sm text-blue-600 break-all">
                {typeof window !== 'undefined' ? window.location.origin : ''}/tours/{slug}
              </code>
              <div className="flex space-x-1 ml-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="p-1 h-auto"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleOpenTour}
                  className="p-1 h-auto"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={handleUpdateSlug}
            disabled={isUpdating || !slug.trim()}
            className="flex-1"
          >
            {isUpdating ? 'Updating...' : 'Update Slug'}
          </Button>
        </div>

        {message && (
          <div className={`text-sm p-2 rounded ${
            message.includes('success') || message.includes('copied')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use lowercase letters, numbers, and hyphens only</li>
          <li>Keep it short and descriptive</li>
          <li>Avoid special characters and spaces</li>
          <li>Make it SEO-friendly and memorable</li>
        </ul>
      </div>
    </div>
  );
}