import React from 'react';
import { Camera, Plus, LogOut, User, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { logout } from '../store/authSlice';

interface HeaderProps {
  onCreatePost: () => void;
  onLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreatePost, onLogin }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-md bg-white/90">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SocialFeed</h1>
              <p className="text-sm text-gray-500">Share your moments</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${
                    location.pathname === '/' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Feed</span>
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${
                    location.pathname === '/profile' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={onCreatePost}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Post</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;