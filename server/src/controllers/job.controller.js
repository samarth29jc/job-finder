import Job from '../models/Job.js';

// Create a new job
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: {
        job
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get all jobs with filters
export const getAllJobs = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Filter by category if provided
    const query = Job.find(queryObj).populate('createdBy', 'name');

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const jobs = await query.skip(skip).limit(limit);
    const total = await Job.countDocuments(queryObj);

    res.status(200).json({
      status: 'success',
      results: jobs.length,
      total,
      data: {
        jobs
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get a single job
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name');

    if (!job) {
      return res.status(404).json({
        status: 'fail',
        message: 'Job not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        job
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update a job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!job) {
      return res.status(404).json({
        status: 'fail',
        message: 'Job not found or you are not authorized to update this job'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        job
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!job) {
      return res.status(404).json({
        status: 'fail',
        message: 'Job not found or you are not authorized to delete this job'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
