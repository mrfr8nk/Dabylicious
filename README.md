
# 🍳 Dabylicious

**An AI-Powered Recipe Generator & Meal Planning Platform**

A modern, full-stack web application that combines AI technology with recipe management to help users discover, create, and plan delicious meals. Features WhatsApp OTP authentication, AI-powered recipe generation, meal planning, and a beautiful glassmorphism UI.

---

## 🚀 Features

- **AI Recipe Generation**: Generate custom recipes using OpenAI based on ingredients, dietary preferences, and cuisine types
- **WhatsApp OTP Authentication**: Secure signup and login using One-Time Passwords sent via WhatsApp
- **Meal Planner**: Plan your weekly meals with an intuitive calendar interface
- **Recipe Management**: Browse, save, and manage your favorite recipes
- **Image Analysis**: Upload food images and get AI-powered recipe suggestions
- **Profile Management**: Complete user profile system with customizable preferences
- **Responsive Design**: Beautiful glassmorphism UI that works seamlessly across all devices
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing

---

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern UI library with latest features
- **Vite 7.1.7** - Lightning-fast build tool and dev server
- **React Router DOM 7.9.4** - Client-side routing
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **Framer Motion 12.23.24** - Animation library for smooth transitions
- **Axios 1.12.2** - HTTP client for API requests
- **Lucide React 0.548.0** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.21.2** - Web application framework
- **MongoDB 6.20.0** - NoSQL database
- **JWT (jsonwebtoken 9.0.2)** - Token-based authentication
- **bcryptjs 2.4.3** - Password hashing
- **OpenAI 6.7.0** - AI-powered recipe generation
- **CORS 2.8.5** - Cross-Origin Resource Sharing

### Development Tools
- **ESLint** - Code linting and quality
- **Concurrently 9.2.1** - Run multiple commands simultaneously
- **Autoprefixer** - CSS vendor prefixing
- **PostCSS** - CSS transformations

---

## 📁 Project Structure

```
dabylicious/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── routes/                   # Backend API routes
│   ├── ai.js               # AI recipe generation endpoints
│   ├── recipes.js          # Recipe CRUD operations
│   ├── meal-plans.js       # Meal planning endpoints
│   └── user.js             # User management endpoints
├── models/                  # Database schemas
├── utils/                   # Backend utilities
├── server.js               # Express server configuration
└── package.json
```

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- OpenAI API key
- OTP service access

### Environment Variables
Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OTP_API_URL=https://otp.dynamictech.gleeze.com
PORT=3001
OPENAI_API_KEY=your_openai_api_key
```

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd dabylicious
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. **Start the application**
```bash
npm start
```

This will start both the backend server (port 3001) and frontend dev server (port 5000) concurrently.

---

## 🔐 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: 7-day token expiration
- **WhatsApp OTP**: Two-factor authentication via SMS
- **Bearer Token**: Secure API endpoint protection
- **Environment Variables**: Sensitive data stored securely
- **CORS Protection**: Configured cross-origin policies

---

## 📱 API Endpoints

### Authentication
- `POST /api/signup` - Request OTP for new user
- `POST /api/verify-signup` - Verify OTP and complete signup
- `POST /api/login` - Request OTP for login
- `POST /api/verify-login` - Verify OTP and complete login

### User Management
- `GET /api/user` - Get current user info (requires auth)
- `PUT /api/user` - Update user profile (requires auth)

### Recipes
- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Create new recipe (requires auth)
- `GET /api/recipes/:id` - Get recipe by ID
- `PUT /api/recipes/:id` - Update recipe (requires auth)
- `DELETE /api/recipes/:id` - Delete recipe (requires auth)

### AI Features
- `POST /api/ai/generate` - Generate recipe with AI
- `POST /api/ai/analyze-image` - Analyze food image

### Meal Planning
- `GET /api/meal-plans` - Get user meal plans
- `POST /api/meal-plans` - Create meal plan
- `PUT /api/meal-plans/:id` - Update meal plan
- `DELETE /api/meal-plans/:id` - Delete meal plan

---

## 🎨 UI Features

- **Glassmorphism Design**: Modern frosted glass effect
- **Smooth Animations**: Powered by Framer Motion
- **Responsive Layout**: Mobile-first design approach
- **Dark/Light Theme**: User-preferred color scheme
- **Instagram-Style Dashboard**: Beautiful user interface
- **Interactive Components**: Engaging user experience

---

## 🚀 Deployment

This application is optimized for deployment on **Replit**.

### Deployment Configuration
- Frontend builds to static files
- Backend runs on Express server
- MongoDB Atlas for production database
- Environment variables managed via Replit Secrets

---

## 👨‍💻 Developer

**Darrell Mucheri (Mr Frank)**

- 📧 Contact: +263719647303
- 🎯 Role: Full-Stack Developer
- 💼 Expertise: React, Node.js, MongoDB, AI Integration

---

## 📄 License

This project is licensed under the MIT License - feel free to use it for your own projects!

---

## 🙏 Acknowledgments

- OpenAI for AI-powered recipe generation
- Replit for hosting and development environment
- The React and Node.js communities
- All contributors and users of Dabylicious

---

## 🐛 Known Issues & Future Enhancements

### Planned Features
- Google OAuth integration
- Email-based authentication
- Recipe image upload and storage
- Social features (following, sharing recipes)
- Recipe collections and favorites
- Nutritional information display
- Shopping list generation
- Recipe reviews and ratings

---

## 📞 Support

For support, bug reports, or feature requests:
- Contact: +263719647303
- Developer: Darrell Mucheri (Mr Frank)

---

Made with ❤️ for food lovers by **Darrell Mucheri (Mr Frank)**

---

**Last Updated**: January 2025
**Version**: 1.0.0
# Dabylicious
# Dabylicious
