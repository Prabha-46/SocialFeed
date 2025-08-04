import React, { useState, useRef, useEffect } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Trash2,
  MoreHorizontal,
  User,
} from "lucide-react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import {
  likePostAsync,
  dislikePostAsync,
  deletePostAsync,
} from "../store/postsSlice";
import type { Post } from "../store/postsSlice";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
  showActions?: boolean;
  isProfileView?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  showActions = true,
  isProfileView = false,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (descRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(descRef.current).lineHeight
      );
      const maxHeight = lineHeight * 3;
      setIsTruncated(descRef.current.scrollHeight > maxHeight + 1);
    }
  }, [post.description]);

  const handleLike = () => {
    if (isProfileView) return;
    dispatch(likePostAsync(post.id));
  };

  const handleDislike = () => {
    if (isProfileView) return;
    dispatch(dislikePostAsync(post.id));
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deletePostAsync(post.id)).unwrap();
      setShowDeleteConfirm(false);
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete =
    user && isProfileView && String(user.id) === String(post.userId);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {post.user?.username}
            </h3>
            <p className="text-sm text-gray-500">
              <span>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </p>
          </div>
        </div>
        {canDelete && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[120px] z-10">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Image */}
      <div className="relative">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full object-cover"
        />
      </div>

      {/* Post Content */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h2>
        <p
          ref={descRef}
          className={`text-gray-700 mb-4 leading-relaxed overflow-hidden ${
            !expanded ? "line-clamp-3" : ""
          }`}
          style={{ wordBreak: "break-word" }}
        >
          {post.description}
        </p>
        {isTruncated && !expanded && (
          <button
            className="text-blue-500 hover:underline mb-4"
            onClick={() => setExpanded(true)}
          >
            See more
          </button>
        )}
        {isTruncated && expanded && (
          <button
            className="text-blue-500 hover:underline mb-4"
            onClick={() => setExpanded(false)}
          >
            See less
          </button>
        )}

        {/* Like/Dislike Section */}
        {showActions && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={isProfileView}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  isProfileView
                    ? "cursor-default"
                    : "transform hover:scale-105 cursor-pointer"
                } ${
                  post.userAction === "LIKE"
                    ? "bg-blue-100 text-blue-600"
                    : isProfileView
                    ? "text-gray-500"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <ThumbsUp
                  className={`w-5 h-5 transition-all duration-200 ${
                    post.userAction === "LIKE" ? "fill-current" : ""
                  }`}
                />
                <span className="font-medium">{post.likes}</span>
              </button>
              <button
                onClick={handleDislike}
                disabled={isProfileView}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  isProfileView
                    ? "cursor-default"
                    : "transform hover:scale-105 cursor-pointer"
                } ${
                  post.userAction === "DISLIKE"
                    ? "bg-gray-200 text-gray-700"
                    : isProfileView
                    ? "text-gray-500"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <ThumbsDown
                  className={`w-5 h-5 transition-all duration-200 ${
                    post.userAction === "DISLIKE" ? "fill-current" : ""
                  }`}
                />
                <span className="font-medium">{post.dislikes}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Post
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors duration-200"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
