# Social Feed

A full-stack social media web application with user authentication, post creation (with image upload), likes/dislikes, and user profiles.

## Live Demo

[https://social-feed-xi.vercel.app/](https://social-feed-xi.vercel.app/)

---

## Features

- User registration and login (JWT-based authentication)
- Create, view, and delete posts (with image upload to S3)
- Like and dislike posts
- View posts by user or all users (with pagination)
- User profile with post history
- Responsive UI

## Tech Stack

- **Frontend:** React (Vite), TypeScript, Axios, Tailwind CSS
- **Backend:** NestJS, TypeORM, MySQL, AWS S3 (for images)
- **Deployment:**
  - Frontend: Vercel ([Live URL](https://social-feed-xi.vercel.app/))
  - Backend: Railway
  - Database: Railway MySQL

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Backend Setup

1. `cd social-media-backend`
2. Copy `.env.example` to `.env` and fill in your environment variables (DB, JWT, S3, etc.)
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the backend:
   ```sh
   npm run start:dev
   ```

### Frontend Setup

1. `cd client`
2. Create a `.env` file with:
   ```env
   VITE_API_URL=https://your-backend.up.railway.app
   ```
   (Replace with your actual backend URL)
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the frontend:
   ```sh
   npm run dev
   ```

## Deployment

- **Frontend:** Push to GitHub and connect to Vercel. Set `VITE_API_URL` in Vercel project settings.
- **Backend:** Push to GitHub and connect to Railway. Set all environment variables in Railway dashboard.

## Environment Variables

- See `.env.example` in both backend and frontend for required variables.

## License

MIT
