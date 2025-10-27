import { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, TrendingUp, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import api from '../utils/api';

function Home({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // Renamed from 'search' for clarity
  const [filters, setFilters] = useState({
    cuisine: '',
    dietary: '', // Changed from 'diet' to 'dietary' for consistency
    difficulty: ''
  });

  // Effect to load recipes when filters or search query change
  useEffect(() => {
    loadRecipes();
  }, [filters, searchQuery]); // Added searchQuery to dependency array

  const loadRecipes = async () => {
    setLoading(true); // Set loading to true at the start of fetching
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery); // Use searchQuery here
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.dietary) params.append('dietary', filters.dietary);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);

      const response = await api.get(`/recipes?${params.toString()}`); // Use toString() for safety
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
      // Optionally handle error state for the user
      setRecipes([]); // Clear recipes on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    // The useEffect will now handle the loading of recipes when searchQuery changes
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Hero Section */}
        <div className="text-center mb-8 mt-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
            Welcome to <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent block sm:inline">Dabylicious</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 px-2">
            Discover amazing recipes & generate custom dishes with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 px-2">
            <Link to="/recipes" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl backdrop-blur-lg bg-gradient-to-r from-orange-500/30 to-pink-500/30 border border-white/30 text-white hover:from-orange-500/40 hover:to-pink-500/40 transition-all duration-200 font-semibold shadow-lg"
              >
                <ChefHat className="w-5 h-5" />
                Browse Recipes
              </motion.button>
            </Link>
            <Link to="/ai-generator" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl backdrop-blur-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/30 text-white hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-200 font-semibold shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                AI Generator
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search for delicious recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadRecipes} // Directly call loadRecipes on click
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl backdrop-blur-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/30 text-white hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-200 font-semibold shadow-lg disabled:opacity-50"
            >
              Search
            </motion.button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-white/80">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filters:</span>
            </div>
            <select
              value={filters.cuisine}
              onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
              className="w-full sm:w-auto px-4 py-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
            >
              <option value="" className="bg-gray-900">All Cuisines</option>
              <option value="italian" className="bg-gray-900">Italian</option>
              <option value="mexican" className="bg-gray-900">Mexican</option>
              <option value="chinese" className="bg-gray-900">Chinese</option>
              <option value="indian" className="bg-gray-900">Indian</option>
              <option value="american" className="bg-gray-900">American</option>
            </select>

            <select
              value={filters.dietary} // Using 'dietary' here
              onChange={(e) => setFilters({ ...filters, dietary: e.target.value })} // And here
              className="w-full sm:w-auto px-4 py-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
            >
              <option value="" className="bg-gray-900">All Diets</option>
              <option value="vegetarian" className="bg-gray-900">Vegetarian</option>
              <option value="vegan" className="bg-gray-900">Vegan</option>
              <option value="gluten-free" className="bg-gray-900">Gluten-Free</option>
              <option value="keto" className="bg-gray-900">Keto</option>
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="w-full sm:w-auto px-4 py-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
            >
              <option value="" className="bg-gray-900">All Levels</option>
              <option value="easy" className="bg-gray-900">Easy</option>
              <option value="medium" className="bg-gray-900">Medium</option>
              <option value="hard" className="bg-gray-900">Hard</option>
            </select>
          </div>
        </div>

        {/* Recipes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white/70 text-lg">Loading delicious recipes...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.length > 0 ? (
              recipes.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
                  <Sparkles className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white text-lg mb-4">
                    No recipes found. Try adjusting your filters or create one with AI!
                  </p>
                  <Link to="/ai-generator">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl backdrop-blur-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/30 text-white hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-200 font-semibold shadow-lg"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Recipe</span>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Home;