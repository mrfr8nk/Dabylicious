import { Link } from 'react-router-dom';
import { ChefHat, Home, Sparkles, Calendar, User, LogIn, UserPlus, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar({ user, logout }) {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/ai-generator', icon: Sparkles, label: 'AI Generator' },
  ];

  const userLinks = user ? [
    { to: '/meal-planner', icon: Calendar, label: 'Meal Planner' },
    { to: `/profile/${user.id}`, icon: User, label: 'Profile' },
  ] : [];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-white/10 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.3 }}
            >
              <ChefHat className="w-8 h-8 text-orange-400" />
            </motion.div>
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300">
              Dabylicious
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {[...navLinks, ...userLinks].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/10 text-white transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </motion.button>

            {/* Auth Buttons */}
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-all duration-200 shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/30 text-white hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-200 shadow-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden backdrop-blur-xl bg-white/10 dark:bg-black/10 border-t border-white/20"
          >
            <div className="px-4 py-4 space-y-2">
              {[...navLinks, ...userLinks].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}

              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 w-full"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span>Toggle Theme</span>
              </button>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg backdrop-blur-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-all duration-200 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg backdrop-blur-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/30 text-white hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-200"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;