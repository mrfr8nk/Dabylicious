const { ObjectId } = require('mongodb');

const RecipeSchema = {
  _id: ObjectId,
  title: String,
  description: String,
  image: String,
  ingredients: [
    {
      name: String,
      amount: String,
      unit: String
    }
  ],
  instructions: [String],
  prepTime: Number,
  cookTime: Number,
  servings: Number,
  difficulty: String,
  cuisine: String,
  dietaryTags: [String],
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  author: ObjectId,
  authorName: String,
  isAIGenerated: Boolean,
  ratings: [
    {
      userId: ObjectId,
      rating: Number,
      comment: String,
      createdAt: Date
    }
  ],
  averageRating: Number,
  totalRatings: Number,
  favorites: Number,
  createdAt: Date,
  updatedAt: Date
};

const UserProfileSchema = {
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  password: String,
  profilePicture: String,
  bio: String,
  verified: Boolean,
  dietaryPreferences: [String],
  allergies: [String],
  favoriteRecipes: [ObjectId],
  recipeBooks: [
    {
      name: String,
      recipes: [ObjectId],
      createdAt: Date
    }
  ],
  cookingJournal: [
    {
      recipeId: ObjectId,
      notes: String,
      rating: Number,
      cookedAt: Date
    }
  ],
  following: [ObjectId],
  followers: [ObjectId],
  createdRecipes: [ObjectId],
  badges: [
    {
      name: String,
      icon: String,
      earnedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
};

const MealPlanSchema = {
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  startDate: Date,
  endDate: Date,
  meals: [
    {
      date: Date,
      mealType: String,
      recipeId: ObjectId,
      recipeName: String
    }
  ],
  groceryList: [
    {
      ingredient: String,
      amount: String,
      unit: String,
      checked: Boolean
    }
  ],
  createdAt: Date,
  updatedAt: Date
};

module.exports = {
  RecipeSchema,
  UserProfileSchema,
  MealPlanSchema
};
