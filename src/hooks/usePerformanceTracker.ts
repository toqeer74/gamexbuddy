import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
}

export const usePerformanceTracker = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const performanceObserver = (list: PerformanceObserverEntryList) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({
            ...prev,
            fcp: entry.startTime,
            firstPaint: entry.startTime
          } as PerformanceMetrics));
        }

        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({
            ...prev,
            lcp: entry.startTime
          } as PerformanceMetrics));
        }

        if (entry.entryType === 'layout-shift') {
          setMetrics(prev => ({
            ...prev,
            cls: (prev?.cls || 0) + ((entry as PerformanceEntry & { value: number }).value || 0)
          } as PerformanceMetrics));
        }
      });
    };

    // Create performance observers
    if ('PerformanceObserver' in window) {
      try {
        // FCP and Paint
        const paintObserver = new PerformanceObserver(performanceObserver);
        paintObserver.observe({ entryTypes: ['paint'] });

        // LCP
        const lcpObserver = new PerformanceObserver(performanceObserver);
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // CLS
        const clsObserver = new PerformanceObserver(performanceObserver);
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Performance observer not supported:', error);
      }
    }

    // Track navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (navigation) {
      setMetrics({
        fcp: 0,
        lcp: 0,
        cls: 0,
        fid: 0,
        ttfb: navigation.responseStart - navigation.requestStart,
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstPaint: 0
      });
    }

    // Measure FID (First Input Delay)
    const measureFID = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            setMetrics(prev => ({
              ...prev,
              fid: (entry as any).processingStart - entry.startTime
            } as PerformanceMetrics));
          }
        }
      });
      observer.observe({ entryTypes: ['first-input'] });

      return () => observer.disconnect();
    };

    const cleanup = measureFID();

    // Mark as ready after initial load
    setTimeout(() => setIsReady(true), 1000);

    return () => {
      cleanup?.();
    };
  }, []);

  const reportMetrics = () => {
    if (metrics && isReady) {
      // Send to analytics
      console.log('🏃 Performance Metrics:', {
        'First Contentful Paint': `${metrics.fcp?.toFixed(2)}ms`,
        'Largest Contentful Paint': `${metrics.lcp?.toFixed(2)}ms`,
        'Cumulative Layout Shift': metrics.cls?.toFixed(4),
        'First Input Delay': `${metrics.fid?.toFixed(2)}ms`,
        'Time to First Byte': `${metrics.ttfb?.toFixed(2)}ms`,
        'Total Load Time': `${metrics.loadTime?.toFixed(2)}ms`,
        'DOM Content Loaded': `${metrics.domContentLoaded?.toFixed(2)}ms`
      });

      // Send to analytics service (GA4, Mixpanel, etc.)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'page_performance', {
          custom_map: {
            metric1: metrics.fcp,
            metric2: metrics.lcp,
            metric3: metrics.cls,
            metric4: metrics.fid,
            metric5: metrics.loadTime
          }
        });
      }
    }
  };

  return { metrics, isReady, reportMetrics };
};