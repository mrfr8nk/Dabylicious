# Dabylicious Authentication API

## Overview
This is a WhatsApp OTP-based authentication system for the Dabylicious recipe platform. The API provides secure user signup, login, and profile management using MongoDB and JWT tokens.

**Status:** Migrated from Vercel to Replit (October 25, 2025)

## Recent Changes
- **October 25, 2025:** Migrated from Vercel serverless functions to Replit
  - Removed Vercel-specific files (api/ folder, vercel.json)
  - Configured Express server to run continuously on port 5000
  - Set up environment variables (MONGODB_URI, JWT_SECRET)
  - Installed dependencies using npm

## Project Architecture

### Tech Stack
- **Backend:** Node.js with Express.js
- **Database:** MongoDB (MongoDB Atlas)
- **Authentication:** JWT (JSON Web Tokens)
- **OTP Service:** WhatsApp OTP via https://otp.dynamictech.gleeze.com
- **Password Hashing:** bcryptjs

### API Endpoints

#### Authentication
- `POST /api/signup` - Request OTP for new user registration
- `POST /api/verify-signup` - Verify OTP and complete signup
- `POST /api/login` - Request OTP for existing user login
- `POST /api/verify-login` - Verify OTP and login

#### User Management
- `GET /api/user` - Get current user profile (requires Bearer token)
- `PUT /api/user` - Update user profile (requires Bearer token)

### Database Collections
- **users** - Stores verified user accounts
- **pendingSignups** - Temporary storage for signup verification process

### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `OTP_API_URL` - OTP service endpoint (default: https://otp.dynamictech.gleeze.com)
- `PORT` - Server port (default: 5000)

## Security Features
- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiration
- Bearer token authentication for protected routes
- CORS enabled for cross-origin requests
- Environment-based secret management

## Future Development Plans
- Integrate with recipe website frontend
- Add Google OAuth signup
- Add email-based signup/login
- Implement user profiles with profile pictures
- Add recipe favorites and collections
- Build social features (following, sharing)

## User Preferences
None documented yet.
