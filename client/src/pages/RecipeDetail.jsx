import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, Heart, ChefHat, Flame, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

function RecipeDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    loadRecipe();
    if (user) {
      checkFavorite();
    }
  }, [id, user]);

  const loadRecipe = async () => {
    try {
      const response = await api.get(`/recipes/${id}`);
      setRecipe(response.data.recipe);
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const response = await api.get('/user/favorites');
      setIsFavorited(response.data.recipes.some(r => r._id === id));
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(`/user/favorites/${id}`);
      setIsFavorited(response.data.favorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleRating = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(`/recipes/${id}/rate`, {
        rating,
        comment
      });
      setComment('');
      loadRecipe();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8">
          <p className="text-white text-lg">Recipe not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-96 rounded-3xl overflow-hidden mb-8"
        >
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {recipe.title}
            </motion.h1>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 text-white/90"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-lg bg-white/10 border border-white/20">
                <ChefHat className="w-5 h-5" />
                <span>{recipe.authorName}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-lg bg-white/10 border border-white/20">
                <Clock className="w-5 h-5" />
                <span>{recipe.prepTime + recipe.cookTime} min</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-lg bg-white/10 border border-white/20">
                <Users className="w-5 h-5" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-lg bg-white/10 border border-white/20">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span>{recipe.averageRating?.toFixed(1) || 'New'}</span>
              </div>
            </motion.div>
          </div>

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavorite}
            className="absolute top-8 right-8 p-3 rounded-full backdrop-blur-lg bg-white/20 border border-white/30 hover:bg-white/30 transition-all duration-200"
          >
            <Heart
              className={`w-6 h-6 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </motion.button>
        </motion.div>

        {/* Tags */}
        {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {recipe.dietaryTags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full backdrop-blur-lg bg-white/10 border border-white/20 text-white/90"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-orange-400" />
                Description
              </h2>
              <p className="text-white/80 leading-relaxed">{recipe.description}</p>
            </motion.div>

            {/* Ingredients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                    className="flex items-center gap-3 text-white/80 p-3 rounded-lg hover:bg-white/5 transition-all duration-200"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-500" />
                    <span>
                      <span className="font-semibold text-white">{ing.amount} {ing.unit}</span> {ing.name}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((step, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                    className="flex gap-4 p-4 rounded-lg hover:bg-white/5 transition-all duration-200"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <p className="text-white/80 pt-1">{step}</p>
                  </motion.li>
                ))}
              </ol>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Ratings & Reviews</h2>
              
              {user && (
                <form onSubmit={handleRating} className="mb-6 space-y-4">
                  <div>
                    <label className="block text-white/80 mb-2">Your Rating:</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
                    >
                      <option value="5" className="bg-gray-900">⭐⭐⭐⭐⭐ (5 stars)</option>
                      <option value="4" className="bg-gray-900">⭐⭐⭐⭐ (4 stars)</option>
                      <option value="3" className="bg-gray-900">⭐⭐⭐ (3 stars)</option>
                      <option value="2" className="bg-gray-900">⭐⭐ (2 stars)</option>
                      <option value="1" className="bg-gray-900">⭐ (1 star)</option>
                    </select>
                  </div>
                  <div>
                    <textarea
                      placeholder="Write your review (optional)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-3 rounded-xl backdrop-blur-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/30 text-white hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-200 font-semibold"
                  >
                    Submit Review
                  </motion.button>
                </form>
              )}

              <div className="space-y-4">
                {recipe.ratings && recipe.ratings.length > 0 ? (
                  recipe.ratings.map((r, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < r.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-white/30'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-white/60 text-sm">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {r.comment && <p className="text-white/80">{r.comment}</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-white/60 text-center py-8">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nutrition */}
            {recipe.nutrition && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  Nutrition (per serving)
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Calories', value: recipe.nutrition.calories },
                    { label: 'Protein', value: `${recipe.nutrition.protein}g` },
                    { label: 'Carbs', value: `${recipe.nutrition.carbs}g` },
                    { label: 'Fat', value: `${recipe.nutrition.fat}g` },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-lg backdrop-blur-md bg-white/5"
                    >
                      <span className="text-white/80">{item.label}</span>
                      <span className="text-white font-semibold">{item.value || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
