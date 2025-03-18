import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
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
import { loginSuccess, logout } from './redux/slices/authSlice';
import api from './utils/api';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Component to handle auth state initialization
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);

  useEffect(() => {
    console.log("AuthInitializer running, current user:", user?.name, "token exists:", !!token);
    
    const initializeAuth = async () => {
      try {
        // If we already have user and token in Redux, no need to fetch again
        if (user && token) {
          console.log("Already authenticated as:", user.name, "with role:", user.role);
          return;
        }
        
        // Otherwise, check localStorage
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          console.log("No token in localStorage, user is not authenticated");
          return;
        }

        console.log("Found token in localStorage, verifying with server...");
        try {
          // Set the token in header for this request
          const response = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          
          if (response.data?.status === 'success' && response.data?.data?.user) {
            console.log("Server verified user:", response.data.data.user.name, "with role:", response.data.data.user.role);
            dispatch(loginSuccess({
              user: response.data.data.user,
              token: storedToken
            }));
          } else {
            console.warn("Server returned invalid user data");
            dispatch(logout());
          }
        } catch (error) {
          console.error('Error verifying auth with server:', error.message);
          dispatch(logout());
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        dispatch(logout());
      }
    };

    initializeAuth();
  }, [dispatch, user, token]);

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
            <ToastContainer position="top-right" autoClose={3000} />
          </MainLayout>
        </AuthInitializer>
      </Router>
    </Provider>
  );
}

export default App; 