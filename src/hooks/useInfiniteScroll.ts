
import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 100
}: UseInfiniteScrollProps) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + threshold >= document.documentElement.offsetHeight) {
        if (hasMore && !isLoading && !isFetching) {
          setIsFetching(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, isFetching, threshold]);

  useEffect(() => {
    if (!isFetching || !hasMore) return;
    
    const fetchMore = async () => {
      try {
        await onLoadMore();
      } catch (error) {
        console.error('Error loading more data:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchMore();
  }, [isFetching, onLoadMore, hasMore]);

  return { isFetching };
};
