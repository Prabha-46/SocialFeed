import React, { useEffect } from "react";
import { User, Calendar, ThumbsUp, ThumbsDown } from "lucide-react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { fetchUserPosts, resetUserPosts } from "../store/postsSlice";
import PostCard from "../components/PostCard";
import InfiniteScrollLoader from "../components/InfiniteScrollLoader";

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    userPosts,
    userPostsLoading,
    userPostsHasMore,
    userPostsCurrentPage,
  } = useAppSelector((state) => state.posts);

  useEffect(() => {
    if (user) {
      dispatch(resetUserPosts());
      dispatch(
        fetchUserPosts({ userId: user.id.toString(), page: 1, reset: true })
      );
    }
  }, [dispatch, user]);

  const handleLoadMore = () => {
    if (!userPostsLoading && userPostsHasMore && user) {
      dispatch(
        fetchUserPosts({
          userId: user.id.toString(),
          page: userPostsCurrentPage + 1,
        })
      );
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Please log in</h3>
        <p className="text-gray-600">
          You need to be logged in to view your profile.
        </p>
      </div>
    );
  }

  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
  const totalDislikes = userPosts.reduce((sum, post) => sum + post.dislikes, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 lg:py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {user.username}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Age: {user.age}</span>
              </div>
              <div className="capitalize">{user.gender}</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-100 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">
              {userPosts.length}
            </div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div className="text-center p-4 bg-gray-100 rounded-xl">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <ThumbsUp className="w-5 h-5 text-blue-600 fill-current" />
              <div className="text-2xl font-bold text-blue-600">
                {totalLikes}
              </div>
            </div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
          <div className="text-center p-4 bg-gray-100 rounded-xl">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <ThumbsDown className="w-5 h-5 text-gray-600 fill-current" />
              <div className="text-2xl font-bold text-gray-600">
                {totalDislikes}
              </div>
            </div>
            <div className="text-sm text-gray-600">Total Dislikes</div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Posts</h2>

        {userPostsLoading && userPosts.length === 0 ? (
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
        ) : userPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600">
              Start sharing your thoughts with the world!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {userPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                showActions={true}
                isProfileView={true}
              />
            ))}
            <InfiniteScrollLoader
              hasMore={userPostsHasMore}
              loading={userPostsLoading}
              onLoadMore={handleLoadMore}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
