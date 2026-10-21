import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatRoom from './pages/ChatRoom';

export default function App() {
  const { user, loading } = useAuth();

  // 1. Wait for Firebase to check auth status
  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }

  // 2. If logged in, they can only see the ChatRoom
  if (user) {
    return (
      <Routes>
        <Route path="/" element={<ChatRoom />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // 3. If NOT logged in, they can only see Login or Signup
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* If they go to any other URL, redirect them to Login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}