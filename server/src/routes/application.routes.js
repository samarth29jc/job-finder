import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  submitApplication,
  getJobApplications,
  getUserApplications,
  updateApplicationStatus
} from '../controllers/application.controller.js';

const router = express.Router();

// Protected routes
router.use(protect);

// User routes
router.get('/my-applications', getUserApplications);
router.post('/:jobId', upload.single('resume'), submitApplication);

// Admin routes
router.use(restrictTo('admin'));
router.get('/job/:jobId', getJobApplications);
router.patch('/:id/status', updateApplicationStatus);

export default router;
