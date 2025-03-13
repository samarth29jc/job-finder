import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import JobCard from '../components/JobCard';
import api from '../utils/api';

const categories = ['All', 'MERN', 'MEAN', 'PHP', 'Frontend', 'Backend', 'Python', 'Other'];

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'All' ? { category: selectedCategory } : {};
      const response = await api.get('/jobs', { params });
      setJobs(response.data.data.jobs);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Jobs</h1>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <p className="text-xl">No jobs found</p>
          {!user && (
            <p className="mt-2">
              Please{' '}
              <a href="/login" className="text-indigo-600 hover:text-indigo-500">
                login
              </a>{' '}
              to apply for jobs
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home; 