import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob
} from '../controllers/job.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJob);

// Protected routes (admin only)
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createJob);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
