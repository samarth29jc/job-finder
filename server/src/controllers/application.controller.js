import Application from '../models/Application.js';
import Job from '../models/Job.js';

// Submit a job application
export const submitApplication = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        status: 'fail',
        message: 'Job not found'
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        status: 'fail',
        message: 'You have already applied for this job'
      });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      description: req.body.description,
      resume: req.file.filename
    });

    res.status(201).json({
      status: 'success',
      data: {
        application
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get all applications for a job (admin only)
export const getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email')
      .populate('job', 'title');

    res.status(200).json({
      status: 'success',
      results: applications.length,
      data: {
        applications
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get user's applications
export const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company');

    res.status(200).json({
      status: 'success',
      results: applications.length,
      data: {
        applications
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update application status (admin only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      {
        new: true,
        runValidators: true
      }
    );

    if (!application) {
      return res.status(404).json({
        status: 'fail',
        message: 'Application not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        application
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
