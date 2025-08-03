import React, { useState } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { createPost, fetchPosts, fetchUserPosts } from "../../store/postsSlice";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.posts);
  const { user } = useAppSelector((state) => state.auth);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !image) return;

    try {
      await dispatch(
        createPost({
          title: title.trim(),
          description: description.trim(),
          image: image,
          userId: user?.id.toString() || "1",
        })
      ).unwrap();

      toast.success("Post created successfully!");

      // Refresh the appropriate post feed
      if (location.pathname === "/profile" && user) {
        dispatch(
          fetchUserPosts({ userId: user.id.toString(), page: 1, reset: true })
        );
      } else {
        dispatch(fetchPosts({ page: 1, reset: true }));
      }

      // Reset form
      setTitle("");
      setDescription("");
      setImage(null);
      setImagePreview("");
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview("");
    // Reset the file input
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setImagePreview("");
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Post Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="What's this post about?"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Share your thoughts..."
              required
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Image
            </label>
            {!image ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-200">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload an image
                  </span>
                </label>
              </div>
            ) : (
              <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium truncate flex-1 mr-2">
                    {image.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  Image selected successfully.
                </div>
              </div>
            )}
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="rounded-xl overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading || !title.trim() || !description.trim() || !image
              }
              className="flex-1 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl font-medium transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
