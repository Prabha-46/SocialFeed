import React, { useState } from "react";
import { X, User, Lock, UserPlus } from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { login, signup, clearError } from "../../store/authSlice";
import { toast } from "react-toastify";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    gender: "male",
    age: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isSignup) {
        await dispatch(signup(formData)).unwrap();
        setIsSignup(false);
        setFormData({ username: "", password: "", gender: "male", age: "" });
        toast.success("Signup successful! Please log in.");
      } else {
        await dispatch(
          login({ username: formData.username, password: formData.password })
        ).unwrap();
        onClose();
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({ username: "", password: "", gender: "male", age: "" });
    dispatch(clearError());
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {isSignup && (
            <>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your age"
                  min="13"
                  max="120"
                  required
                />
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="space-y-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isSignup ? (
                    <UserPlus className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span>{isSignup ? "Create Account" : "Sign In"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMode}
              className="w-full px-4 py-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl font-medium transition-colors duration-200"
            >
              {isSignup
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
