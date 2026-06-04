import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a1a2e', color: '#fff', border: '1px solid #e94560' }
        }} />
        <Navbar />
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/properties"      element={<Properties />} />
          <Route path="/properties/:id"  element={<PropertyDetail />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/dashboard"       element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/add-property"    element={<PrivateRoute><AddProperty /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
