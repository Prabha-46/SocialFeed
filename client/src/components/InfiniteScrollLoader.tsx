import React from 'react';
import { useInView } from 'react-intersection-observer';

interface InfiniteScrollLoaderProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

const InfiniteScrollLoader: React.FC<InfiniteScrollLoaderProps> = ({
  hasMore,
  loading,
  onLoadMore,
}) => {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  React.useEffect(() => {
    if (inView && hasMore && !loading) {
      onLoadMore();
    }
  }, [inView, hasMore, loading, onLoadMore]);

  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You've reached the end!</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex justify-center py-8">
      {loading && (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading more posts...</span>
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollLoader;