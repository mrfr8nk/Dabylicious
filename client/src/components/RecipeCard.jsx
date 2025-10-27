import { Link } from 'react-router-dom';
import { Clock, Star, Users, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

function RecipeCard({ recipe }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/recipe/${recipe._id}`}
        className="block group"
      >
        <div className="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 dark:bg-black/10 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Rating Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full backdrop-blur-md bg-black/30 border border-white/20">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-semibold">
                {recipe.averageRating?.toFixed(1) || 'New'}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5 space-y-3">
            <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-500 group-hover:bg-clip-text transition-all duration-300">
              {recipe.title}
            </h3>
            
            <p className="text-white/70 text-sm line-clamp-2">
              {recipe.description?.substring(0, 100) || 'Delicious recipe waiting for you!'}
            </p>

            {/* Meta Information */}
            <div className="flex items-center justify-between text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.prepTime + recipe.cookTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>

            {/* Dietary Tags */}
            {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipe.dietaryTags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <div className="w-6 h-6 rounded-full backdrop-blur-md bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center">
                <ChefHat className="w-3 h-3 text-white" />
              </div>
              <span className="text-white/70 text-sm">
                {recipe.authorName || 'Chef'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default RecipeCard;
