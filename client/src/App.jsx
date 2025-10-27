import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import AIGenerator from './pages/AIGenerator';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MealPlanner from './pages/MealPlanner';
import api from './utils/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/user')
        .then(res => {
          if (res.data.success) {
            setUser(res.data.user);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Loading Dabylicious...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar user={user} logout={logout} />
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/recipe/:id" element={<RecipeDetail user={user} />} />
            <Route path="/ai-generator" element={<AIGenerator user={user} />} />
            <Route path="/profile/:userId" element={<Profile currentUser={user} />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/signup" element={<Signup onLogin={login} />} />
            <Route path="/meal-planner" element={<MealPlanner user={user} />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
