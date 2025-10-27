import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, Users, ChefHat, Flame, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

function AIGenerator({ user }) {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState([]);
  const [cookingTime, setCookingTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState(null);

  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free',
    'keto', 'paleo', 'low-carb', 'high-protein'
  ];

  const handleDietaryToggle = (option) => {
    setDietary(prev =>
      prev.includes(option)
        ? prev.filter(d => d !== option)
        : [...prev, option]
    );
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedRecipe(null);

    try {
      const ingredientsArray = ingredients
        .split(',')
        .map(i => i.trim())
        .filter(i => i);

      const response = await api.post('/ai/generate', {
        ingredients: ingredientsArray,
        dietaryPreferences: dietary,
        cookingTime: cookingTime ? parseInt(cookingTime) : null
      });

      if (response.data.success) {
        setGeneratedRecipe(response.data.recipe);
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      setError(error.response?.data?.message || 'Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-16 px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full backdrop-blur-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/30 mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            AI Recipe Generator
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Tell us what you have, and we'll create a delicious recipe just for you!
          </p>
        </motion.div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Form Section */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleGenerate}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl mb-8"
        >
          {/* Ingredients Input */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3 text-lg">
              Available Ingredients
            </label>
            <textarea
              placeholder="Enter ingredients separated by commas (e.g., chicken, rice, tomatoes, garlic)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows="4"
              required
              className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
            />
            <p className="text-white/60 text-sm mt-2">Separate ingredients with commas</p>
          </div>

          {/* Dietary Preferences */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3 text-lg">
              Dietary Preferences (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map(option => (
                <motion.button
                  key={option}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDietaryToggle(option)}
                  className={`px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
                    dietary.includes(option)
                      ? 'bg-gradient-to-r from-purple-500/40 to-pink-500/40 border-white/40 text-white'
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Cooking Time */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3 text-lg">
              Maximum Cooking Time (minutes)
            </label>
            <input
              type="number"
              placeholder="e.g., 30"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              min="1"
              className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl backdrop-blur-md bg-red-500/20 border border-red-500/30 text-white"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl backdrop-blur-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/30 text-white hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-200 font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating your recipe...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Recipe</span>
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Generated Recipe */}
        {generatedRecipe && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full backdrop-blur-lg bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Your Custom Recipe</h2>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">{generatedRecipe.title}</h3>
            <p className="text-white/80 mb-6">{generatedRecipe.description}</p>

            {/* Recipe Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/70 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Prep Time</span>
                </div>
                <p className="text-white font-semibold">{generatedRecipe.prepTime} min</p>
              </div>
              <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/70 mb-1">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm">Cook Time</span>
                </div>
                <p className="text-white font-semibold">{generatedRecipe.cookTime} min</p>
              </div>
              <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/70 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Servings</span>
                </div>
                <p className="text-white font-semibold">{generatedRecipe.servings}</p>
              </div>
              <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/70 mb-1">
                  <ChefHat className="w-4 h-4" />
                  <span className="text-sm">Difficulty</span>
                </div>
                <p className="text-white font-semibold capitalize">{generatedRecipe.difficulty}</p>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">Ingredients</h4>
              <ul className="space-y-2">
                {generatedRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80 p-3 rounded-lg hover:bg-white/5 transition-all duration-200">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-500" />
                    <span>{ing.amount} {ing.unit} {ing.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">Instructions</h4>
              <ol className="space-y-3">
                {generatedRecipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-4 p-4 rounded-lg hover:bg-white/5 transition-all duration-200">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {i + 1}
                    </div>
                    <p className="text-white/80 pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Nutrition */}
            {generatedRecipe.nutrition && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-white mb-4">Nutrition (per serving)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg backdrop-blur-md bg-white/5 border border-white/10">
                    <p className="text-white/70 text-sm">Calories</p>
                    <p className="text-white font-semibold">{generatedRecipe.nutrition.calories}</p>
                  </div>
                  <div className="p-3 rounded-lg backdrop-blur-md bg-white/5 border border-white/10">
                    <p className="text-white/70 text-sm">Protein</p>
                    <p className="text-white font-semibold">{generatedRecipe.nutrition.protein}g</p>
                  </div>
                  <div className="p-3 rounded-lg backdrop-blur-md bg-white/5 border border-white/10">
                    <p className="text-white/70 text-sm">Carbs</p>
                    <p className="text-white font-semibold">{generatedRecipe.nutrition.carbs}g</p>
                  </div>
                  <div className="p-3 rounded-lg backdrop-blur-md bg-white/5 border border-white/10">
                    <p className="text-white/70 text-sm">Fat</p>
                    <p className="text-white font-semibold">{generatedRecipe.nutrition.fat}g</p>
                  </div>
                </div>
              </div>
            )}

            {/* View Full Recipe Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/recipe/${generatedRecipe._id}`)}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl backdrop-blur-lg bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-white/30 text-white hover:from-green-500/40 hover:to-emerald-500/40 transition-all duration-200 font-semibold"
            >
              View Full Recipe Page
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AIGenerator;
