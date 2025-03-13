# Job Portal and Admin Dashboard

A full-stack MERN application for job seekers and employers with a comprehensive admin dashboard for managing job postings and applications.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Future Enhancements](#future-enhancements)

## Overview

This Job Portal application provides a platform for users to view job listings, apply for positions, and track their applications. Employers (admins) can post new job opportunities and manage applications through a dedicated dashboard.

## Features

### For Job Seekers
- Browse job listings with category-based filtering
- View detailed job information
- User registration and authentication
- Apply to jobs with resume upload
- Track application status

### For Employers/Admins
- Post new job listings
- View and manage all job postings
- Review applications
- Update application status (accept/reject)
- Dashboard with statistics

## Technology Stack

### Frontend
- React.js
- Redux Toolkit for state management
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling
- React Toastify for notifications

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Multer for file uploads
- bcrypt.js for password hashing

## Project Structure

```
project-root/
│
├── client/                  # Frontend React application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── layouts/         # Layout components
│   │   ├── pages/           # Page components
│   │   ├── redux/           # Redux store and slices
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main application component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── .env                 # Environment variables
│   └── package.json         # Frontend dependencies
│
├── server/                  # Backend Express application
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   └── index.js         # Server entry point
│   ├── uploads/             # Uploaded files
│   ├── .env                 # Environment variables
│   └── package.json         # Backend dependencies
│
└── README.md                # Project documentation
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Setting up the Backend
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd job-portal
   ```

2. Install server dependencies
   ```bash
   cd server
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>
   JWT_EXPIRES_IN=7d
   UPLOAD_PATH=uploads
   ```

4. Create the uploads directory
   ```bash
   mkdir uploads
   ```

5. Start the server
   ```bash
   npm run dev
   ```

### Setting up the Frontend
1. Open a new terminal and navigate to the client directory
   ```bash
   cd ../client
   ```

2. Install client dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

## Usage

### User Registration and Login
1. Navigate to `/register` to create a new account
2. Use your email and password to log in at `/login`

### Browsing Jobs
1. View all available jobs on the home page
2. Filter jobs by category using the category buttons
3. Click on a job card to view detailed information

### Applying for Jobs
1. Log in to your account
2. Navigate to a job's detail page
3. Fill out the application form and upload your resume
4. Track your applications in the "Applications" section

### Admin Dashboard
1. Log in with an admin account
2. Access the admin dashboard from the navigation menu
3. View all job postings and their application counts
4. Manage job postings (view, edit, delete)
5. Post new job listings through the "Post New Job" button
6. Review and update application statuses

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs (with optional filtering)
- `GET /api/jobs/:id` - Get a specific job
- `POST /api/jobs` - Create a new job (admin only)
- `PATCH /api/jobs/:id` - Update a job (admin only)
- `DELETE /api/jobs/:id` - Delete a job (admin only)

### Applications
- `POST /api/applications/:jobId` - Submit a job application
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/job/:jobId` - Get applications for a job (admin only)
- `PATCH /api/applications/:id/status` - Update application status (admin only)

## Future Enhancements

- Advanced search functionality
- User profile management
- Email notifications for application status updates
- Job bookmarking
- Company profiles and verification
- Analytics dashboard for admins
- Integration with third-party job boards
- Mobile application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React.js](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/) 