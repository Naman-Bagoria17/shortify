# 🔗 Shortify - URL Shortener

A modern, full-stack URL shortener application built with React and Node.js. Transform long URLs into short, shareable links with beautiful analytics and user management.

![Shortify](https://img.shields.io/badge/Shortify-URL%20Shortener-blue)
![React](https://img.shields.io/badge/React-18+-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## ✨ Features

- 🔗 **URL Shortening**: Convert long URLs into short, memorable links
- 👤 **User Authentication**: Secure login/register with JWT tokens
- 📊 **Analytics**: Track clicks and monitor link performance
- 🎨 **Modern UI**: Beautiful, responsive design with glass morphism effects
- 📱 **Mobile Friendly**: Fully responsive across all devices
- 🔍 **Search & Filter**: Find your links quickly with search functionality
- 📋 **Easy Sharing**: One-click copy and social media sharing
- 🗂️ **Link Management**: Organize and manage all your shortened URLs

## 🚀 Tech Stack

### Frontend
- **React 18+** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Redux Toolkit** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running
- Git installed

### Clone the Repository
```bash
git clone https://github.com/Naman-Bagoria17/shortify.git
cd shortify
```

### Backend Setup
```bash
cd BACKEND
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm run dev
```

### Frontend Setup
```bash
cd FRONTEND
npm install

# Start the development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the BACKEND directory:

```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
APP_URL=http://localhost:3000/
NODE_ENV=development
```

## 🚀 Deployment

### Deploy to Render (Recommended)

This project includes a `render.yaml` file for easy deployment to Render.

1. **Fork this repository** to your GitHub account
2. **Connect to Render**: Go to [Render Dashboard](https://dashboard.render.com) and connect your GitHub
3. **Create New Service**: Choose "Blueprint" and select this repository
4. **Set Environment Variables** in Render dashboard:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong random string (generate one [here](https://generate-secret.vercel.app/32))
5. **Deploy**: Render will automatically deploy both frontend and backend

### Environment Variables Required:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Shorten URLs**: Paste your long URL and get a short link
3. **Custom Slugs**: Create custom short URLs (premium feature)
4. **Track Analytics**: Monitor clicks and performance
5. **Manage Links**: View, edit, and delete your shortened URLs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Naman Bagoria**
- GitHub: [@Naman-Bagoria17](https://github.com/Naman-Bagoria17)
- LinkedIn: [Naman Bagoria](https://www.linkedin.com/in/naman-bagoria)

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by modern URL shortening services
- Built with love and lots of coffee ☕

---

⭐ Star this repository if you found it helpful!
