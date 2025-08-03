import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Sidebar from "./components/Navigation/Sidebar";
import MobileHeader from "./components/MobileHeader";
import MobileBottomNav from "./components/Navigation/MobileBottomNav";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import CreatePostModal from "./components/Modals/CreatePostModal";
import LoginModal from "./components/Modals/LoginModal";

function AppContent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsLoginModalOpen(true);
    window.addEventListener("open-login-modal", handler);
    return () => window.removeEventListener("open-login-modal", handler);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 lg:pl-64">
      {/* Desktop Sidebar */}
      <Sidebar
        onCreatePost={() => setIsCreateModalOpen(true)}
        onLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Mobile Header */}
      <MobileHeader onLogin={() => setIsLoginModalOpen(true)} />

      {/* Main Content */}
      <main className="pb-16 lg:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onCreatePost={() => setIsCreateModalOpen(true)} />

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
