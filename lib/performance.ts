// Performance monitoring utilities
import React from 'react';

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeObservers();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return;

    // First Contentful Paint
    this.observePerformanceEntry('paint', (entries) => {
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
      }
    });

    // Largest Contentful Paint
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        this.metrics.lcp = lastEntry.startTime;
      }
    });

    // Cumulative Layout Shift
    let clsValue = 0;
    this.observePerformanceEntry('layout-shift', (entries) => {
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.metrics.cls = clsValue;
    });

    // First Input Delay
    this.observePerformanceEntry('first-input', (entries) => {
      for (const entry of entries) {
        this.metrics.fid = (entry as any).processingStart - entry.startTime;
        break; // Only measure the first input
      }
    });

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    }
  }

  private observePerformanceEntry(type: string, callback: (entries: any[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ type, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Performance observer for ${type} not supported:`, error);
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  // Log metrics to console or send to analytics
  logMetrics() {
    const metrics = this.getMetrics();
    console.group('🚀 Performance Metrics');
    console.table(metrics);
    console.groupEnd();

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metrics);
    }
  }

  private async sendToAnalytics(metrics: Partial<PerformanceMetrics>) {
    try {
      // Send to your analytics service
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'performance_metrics', metrics);
      }
    } catch (error) {
      console.warn('Failed to send metrics to analytics:', error);
    }
  }

  // Cleanup observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  if (typeof window !== 'undefined') {
    return PerformanceMonitor.getInstance();
  }
  return null;
}

// Utility to measure component render time
export function measureRenderTime(componentName: string) {
  return function<T extends React.ComponentType<any>>(Component: T): T {
    const MeasuredComponent = (props: React.ComponentProps<T>) => {
      React.useEffect(() => {
        const startTime = performance.now();
        return () => {
          const endTime = performance.now();
          console.log(`⏱️ ${componentName} render time: ${endTime - startTime}ms`);
        };
      });
      return React.createElement(Component, props);
    };
    return MeasuredComponent as T;
  };
}

// Bundle size utilities
export const BundleAnalyzer = {
  // Get current bundle size from webpack stats
  async getBundleSize() {
    try {
      const response = await fetch('/_next/static/chunks/webpack.json');
      const stats = await response.json();
      return this.analyzeWebpackStats(stats);
    } catch (error) {
      console.warn('Could not fetch webpack stats:', error);
      return null;
    }
  },

  analyzeWebpackStats(stats: any) {
    const assets = stats.assets || [];
    const totalSize = assets.reduce((sum: number, asset: any) => sum + asset.size, 0);
    
    return {
      totalSize,
      assets: assets.map((asset: any) => ({
        name: asset.name,
        size: asset.size,
        sizeKB: (asset.size / 1024).toFixed(2),
      })),
      chunks: stats.chunks?.length || 0,
    };
  },
};

// Performance optimization suggestions
export const PerformanceSuggestions = {
  analyzeMetrics(metrics: Partial<PerformanceMetrics>) {
    const suggestions: string[] = [];

    if (metrics.fcp && metrics.fcp > 1800) {
      suggestions.push('🐌 First Contentful Paint is slow. Consider optimizing server response time and critical resources.');
    }

    if (metrics.lcp && metrics.lcp > 2500) {
      suggestions.push('🖼️ Largest Contentful Paint is slow. Optimize images and reduce render-blocking resources.');
    }

    if (metrics.cls && metrics.cls > 0.1) {
      suggestions.push('📐 Cumulative Layout Shift is high. Ensure proper image dimensions and avoid inserting content above existing content.');
    }

    if (metrics.fid && metrics.fid > 100) {
      suggestions.push('⚡ First Input Delay is high. Reduce JavaScript execution time and main thread work.');
    }

    if (metrics.ttfb && metrics.ttfb > 800) {
      suggestions.push('🌐 Time to First Byte is slow. Optimize server response time and use CDN.');
    }

    return suggestions;
  },
};
