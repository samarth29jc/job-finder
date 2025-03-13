import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Job Portal
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-indigo-600">
                  Jobs
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin" className="text-gray-700 hover:text-indigo-600">
                      Dashboard
                    </Link>
                    <Link to="/create-job" className="text-gray-700 hover:text-indigo-600">
                      Post Job
                    </Link>
                  </>
                )}
                <Link to="/applications" className="text-gray-700 hover:text-indigo-600">
                  Applications
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-indigo-600">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 