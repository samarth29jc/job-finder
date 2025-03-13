import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../utils/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    resume: null,
  });

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data.data.job);
    } catch (error) {
      toast.error('Failed to fetch job details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'resume') {
      setFormData({ ...formData, resume: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    try {
      setApplying(true);
      const data = new FormData();
      data.append('description', formData.description);
      data.append('resume', formData.resume);

      await api.post(`/applications/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Application submitted successfully');
      navigate('/applications');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Company:</span> {job.company}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Location:</span> {job.location}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Category:</span> {job.category}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Experience:</span> {job.experience}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Salary:</span> {job.salary}
            </p>
          </div>
        </div>
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
          <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
        </div>
      </div>

      {user && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Apply for this Job</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Why should you be hired for this position?
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                Upload Resume (PDF, DOC, DOCX)
              </label>
              <input
                type="file"
                id="resume"
                name="resume"
                required
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={applying}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {applying ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobDetails; 