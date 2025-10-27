const express = require('express');
const { ObjectId } = require('mongodb');
const { generateRecipe, analyzeRecipeImage } = require('../utils/openai');
const router = express.Router();

let db;
let openai = null;

function setDB(database) {
  db = database;
}

function setOpenAI(openaiInstance) {
  openai = openaiInstance;
}

router.post('/generate', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!openai) {
      return res.status(503).json({ 
        error: 'AI features are currently unavailable. Please contact the administrator.' 
      });
    }

    const { ingredients, dietaryPreferences, cookingTime } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'Ingredients are required' });
    }

    const jwt = require('jsonwebtoken');
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.collection('users').findOne({
      _id: new ObjectId(decoded.userId)
    });

    const generatedRecipe = await generateRecipe(
      ingredients,
      dietaryPreferences || [],
      cookingTime
    );

    const recipe = {
      ...generatedRecipe,
      image: 'https://via.placeholder.com/400x300?text=AI+Generated+Recipe',
      author: new ObjectId(decoded.userId),
      authorName: user.name,
      isAIGenerated: true,
      dietaryTags: dietaryPreferences || [],
      ratings: [],
      averageRating: 0,
      totalRatings: 0,
      favorites: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('recipes').insertOne(recipe);

    res.json({
      success: true,
      recipeId: result.insertedId,
      recipe: { ...recipe, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({ 
      error: 'Failed to generate recipe',
      message: error.message 
    });
  }
});

router.post('/analyze-image', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!openai) {
      return res.status(503).json({ 
        error: 'AI features are currently unavailable. Please contact the administrator.' 
      });
    }

    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    const generatedRecipe = await analyzeRecipeImage(base64Image);

    res.json({
      success: true,
      recipe: generatedRecipe
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ 
      error: 'Failed to analyze image',
      message: error.message 
    });
  }
});

module.exports = { router, setDB, setOpenAI };