import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AdminRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    // Debug logging
    if (!user || !token) {
      console.log("Admin route access denied - user not authenticated at", location.pathname);
      toast.error('Please login to access this page');
    } else if (user.role !== 'admin') {
      console.log("Admin route access denied for non-admin user:", user.name, "with role:", user.role);
      toast.error('You do not have admin privileges to access this page');
    } else {
      console.log("Admin route access granted to", user.name);
    }
  }, [user, token, location.pathname]);

  if (!user || !token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== 'admin') {
    // Redirect to home if not an admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute; 