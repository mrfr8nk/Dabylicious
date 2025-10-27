const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

let db;

function setDB(database) {
  db = database;
}

router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      cuisine, 
      dietary, 
      difficulty, 
      maxTime,
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'ingredients.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: 'i' };
    }
    
    if (dietary) {
      query.dietaryTags = { $in: dietary.split(',') };
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (maxTime) {
      query.$expr = {
        $lte: [{ $add: ['$prepTime', '$cookTime'] }, parseInt(maxTime)]
      };
    }

    const sortOptions = {};
    if (sort.startsWith('-')) {
      sortOptions[sort.substring(1)] = -1;
    } else {
      sortOptions[sort] = 1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const recipes = await db.collection('recipes')
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    const total = await db.collection('recipes').countDocuments(query);

    res.json({
      success: true,
      recipes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipe = await db.collection('recipes').findOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ success: true, recipe });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

router.post('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      title,
      description,
      image,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      difficulty,
      cuisine,
      dietaryTags,
      nutrition
    } = req.body;

    const jwt = require('jsonwebtoken');
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await db.collection('users').findOne({
      _id: new ObjectId(decoded.userId)
    });

    const recipe = {
      title,
      description,
      image: image || 'https://via.placeholder.com/400x300?text=Recipe',
      ingredients,
      instructions,
      prepTime: parseInt(prepTime),
      cookTime: parseInt(cookTime),
      servings: parseInt(servings),
      difficulty,
      cuisine,
      dietaryTags: dietaryTags || [],
      nutrition: nutrition || {},
      author: new ObjectId(decoded.userId),
      authorName: user.name,
      isAIGenerated: false,
      ratings: [],
      averageRating: 0,
      totalRatings: 0,
      favorites: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('recipes').insertOne(recipe);
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $push: { createdRecipes: result.insertedId } }
    );

    res.json({ 
      success: true, 
      recipeId: result.insertedId,
      recipe: { ...recipe, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

router.post('/:id/rate', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { rating, comment } = req.body;
    const jwt = require('jsonwebtoken');
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const ratingObj = {
      userId: new ObjectId(decoded.userId),
      rating: parseInt(rating),
      comment: comment || '',
      createdAt: new Date()
    };

    const recipe = await db.collection('recipes').findOne({
      _id: new ObjectId(req.params.id)
    });

    const existingRatingIndex = recipe.ratings.findIndex(
      r => r.userId.toString() === decoded.userId
    );

    if (existingRatingIndex >= 0) {
      recipe.ratings[existingRatingIndex] = ratingObj;
    } else {
      recipe.ratings.push(ratingObj);
    }

    const avgRating = recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length;

    await db.collection('recipes').updateOne(
      { _id: new ObjectId(req.params.id) },
      { 
        $set: { 
          ratings: recipe.ratings,
          averageRating: avgRating,
          totalRatings: recipe.ratings.length
        } 
      }
    );

    res.json({ success: true, averageRating: avgRating });
  } catch (error) {
    console.error('Error rating recipe:', error);
    res.status(500).json({ error: 'Failed to rate recipe' });
  }
});

module.exports = { router, setDB };
