import React from "react";
import { Home, Plus, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";

interface MobileBottomNavProps {
  onCreatePost: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onCreatePost }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) return null;

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

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-200 group relative ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
              title={item.label}
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                } transition-transform duration-200`}
              />
              <span className="text-xs font-medium">{item.label}</span>

              {/* Tooltip for touch devices */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
