import React, { useEffect } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { fetchPosts, resetPosts } from "../store/postsSlice";
import PostCard from "../components/PostCard";
import InfiniteScrollLoader from "../components/InfiniteScrollLoader";

const PostFeed: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, loading, hasMore, currentPage } = useAppSelector(
    (state) => state.posts
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(resetPosts());
      dispatch(fetchPosts({ page: 1, reset: true }));
    }
  }, [dispatch, isAuthenticated]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchPosts({ page: currentPage + 1 }));
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="p-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-80 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🔒</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Please log in</h3>
        <p className="text-gray-600">
          You need to be logged in to view and create posts.
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📸</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-600">
          Be the first to share something amazing!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 lg:py-8">
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} isProfileView={false} />
        ))}
        <InfiniteScrollLoader
          hasMore={hasMore}
          loading={loading}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
};

export default PostFeed;
