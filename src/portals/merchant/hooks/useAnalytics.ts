
import { useState, useEffect } from 'react';
import { AnalyticsData, AnalyticsDateRange } from '../types/analytics';
import { toast } from 'sonner';

export const useAnalytics = (merchantId?: string) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // No mock data - will be replaced with real Supabase queries

  const fetchAnalytics = async (dateRange?: AnalyticsDateRange) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!merchantId) {
        setAnalytics(null);
        return;
      }
      
      console.log('Fetching analytics for merchant:', merchantId, 'dateRange:', dateRange);
      
      // TODO: Replace with real Supabase analytics query
      // For now, return empty analytics since we don't have real data
      setAnalytics(null);
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching analytics:', error);
      setError(error.message);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format: 'csv' | 'excel', reportType: 'summary' | 'detailed') => {
    try {
      console.log('Exporting report:', format, reportType);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate export delay
      
      // Create mock download
      const filename = `analytics-report-${new Date().toISOString().split('T')[0]}.${format}`;
      toast.success(`Report exported as ${filename}`);
    } catch (err) {
      const error = err as Error;
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [merchantId]);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    exportReport,
    refetch: fetchAnalytics
  };
};
