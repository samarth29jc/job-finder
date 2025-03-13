import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide job category'],
    enum: ['MERN', 'MEAN', 'PHP', 'Frontend', 'Backend', 'Python', 'Other']
  },
  description: {
    type: String,
    required: [true, 'Please provide job description']
  },
  experience: {
    type: String,
    required: [true, 'Please provide required experience']
  },
  company: {
    type: String,
    required: [true, 'Please provide company name']
  },
  location: {
    type: String,
    required: [true, 'Please provide job location']
  },
  salary: {
    type: String,
    required: [true, 'Please provide salary range']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
