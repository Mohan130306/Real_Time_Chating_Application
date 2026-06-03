import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "./redux/slices/authSlice";
import { SocketProvider } from "./context/SocketContext";
import LandingPage from "./pages/LandingPage";
import AuthPage    from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChatPage    from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import SearchUsersPage from "./pages/SearchUsersPage";
import MediaGalleryPage from "./pages/MediaGalleryPage";
import ContactsPage from "./pages/ContactsPage";
import CallPage from "./pages/CallPage";
import NotFoundPage from "./pages/NotFoundPage";
import Spinner     from "./components/shared/Spinner";

const ProtectedRoute = ({ children }) => {
  const { user, initialized } = useSelector((state) => state.auth);
  if (!initialized) return <Spinner fullscreen />;
  return user ? children : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, initialized } = useSelector((state) => state.auth);
  if (!initialized) return <Spinner fullscreen />;
  return user ? <Navigate to="/" replace /> : children;
};

const HomeRoute = () => {
  const { user, initialized } = useSelector((state) => state.auth);
  if (!initialized) return <Spinner fullscreen />;
  return user ? <ChatPage /> : <LandingPage />;
};

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        
        {/* Protected Feature Routes */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchUsersPage /></ProtectedRoute>} />
        <Route path="/media" element={<ProtectedRoute><MediaGalleryPage /></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><ContactsPage /></ProtectedRoute>} />
        <Route path="/call" element={<ProtectedRoute><CallPage /></ProtectedRoute>} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SocketProvider>
  );
}
