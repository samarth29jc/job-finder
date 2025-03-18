import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!user || !token) {
      console.log("Access to protected route denied at", location.pathname);
      toast.error('Please login to access this page');
    } else {
      console.log("Protected route access granted to", user.name, "at", location.pathname);
    }
  }, [user, token, location.pathname]);

  if (!user || !token) {
    // Redirect to login with the return url
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute; 