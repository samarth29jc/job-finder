import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './redux/store';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetails from './pages/JobDetails';
import AdminDashboard from './pages/AdminDashboard';
import CreateJob from './pages/CreateJob';
import Applications from './pages/Applications';
import { loginSuccess } from './redux/slices/authSlice';
import api from './utils/api';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Component to handle auth state initialization
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          dispatch(loginSuccess({
            user: response.data.data.user,
            token
          }));
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthInitializer>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/jobs/:id"
                element={
                  <ProtectedRoute>
                    <JobDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/create-job"
                element={
                  <AdminRoute>
                    <CreateJob />
                  </AdminRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <ProtectedRoute>
                    <Applications />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer />
          </MainLayout>
        </AuthInitializer>
      </Router>
    </Provider>
  );
}

export default App; 