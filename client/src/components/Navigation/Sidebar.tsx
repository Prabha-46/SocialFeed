import React from "react";
import { Camera, Plus, Home, User, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { logout } from "../../store/authSlice";

interface SidebarProps {
  onCreatePost: () => void;
  onLogin: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCreatePost, onLogin }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
      onClick: () => navigate("/"),
    },
    {
      icon: Plus,
      label: "Create",
      path: "/create",
      onClick: onCreatePost,
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      onClick: () => navigate("/profile"),
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex-col z-30 p-6 justify-between">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SocialFeed</h1>
            <p className="text-sm text-gray-500">Share your moments</p>
          </div>
        </div>
        <button
          onClick={onLogin}
          className="w-full flex items-center space-x-3 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors duration-200"
        >
          <User className="w-5 h-5" />
          <span>Login</span>
        </button>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex-col z-30">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SocialFeed</h1>
            <p className="text-sm text-gray-500">Share your moments</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === "/create" && false); // Create is modal, not route

            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Info & Logout */}
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
