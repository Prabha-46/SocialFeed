import React from 'react';
import { Camera, LogOut } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

interface MobileHeaderProps {
  onLogin: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onLogin }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-md bg-white/90">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">SocialFeed</h1>
            </div>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 group relative"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                
                {/* Tooltip */}
                <div className="absolute -bottom-10 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Logout
                </div>
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
              >
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;