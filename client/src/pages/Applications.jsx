import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/applications/my-applications');
      setApplications(response.data.data.applications);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, { status });
      toast.success('Application status updated');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {user.role === 'admin' ? 'All Applications' : 'My Applications'}
      </h1>

      {applications.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-xl">No applications found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {applications.map((application) => (
              <li key={application._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {application.job.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {application.job.company}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          application.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : application.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : application.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Description:</span> {application.description}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-semibold">Resume:</span>{' '}
                      <a
                        href={`/uploads/${application.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        View Resume
                      </a>
                    </p>
                  </div>

                  {user.role === 'admin' && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'accepted')}
                        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'rejected')}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Applications; 