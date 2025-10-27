const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

let db;

function setDB(database) {
  db = database;
}

function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  const jwt = require('jsonwebtoken');
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

router.post('/', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const { name, startDate, endDate } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ error: 'Name, start date, and end date are required' });
    }

    const mealPlan = {
      userId: new ObjectId(decoded.userId),
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      meals: [],
      groceryList: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('mealPlans').insertOne(mealPlan);

    res.json({ 
      success: true, 
      mealPlanId: result.insertedId,
      mealPlan: { ...mealPlan, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating meal plan:', error);
    res.status(500).json({ error: 'Failed to create meal plan' });
  }
});

router.get('/', async (req, res) => {
  try {
    const decoded = verifyToken(req);

    const mealPlans = await db.collection('mealPlans').find({
      userId: new ObjectId(decoded.userId)
    }).sort({ createdAt: -1 }).toArray();

    res.json({ success: true, mealPlans });
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({ error: 'Failed to fetch meal plans' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const decoded = verifyToken(req);

    const mealPlan = await db.collection('mealPlans').findOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(decoded.userId)
    });

    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    const recipeIds = mealPlan.meals.map(meal => meal.recipeId);
    const recipes = await db.collection('recipes').find({
      _id: { $in: recipeIds }
    }).toArray();

    const mealsWithRecipes = mealPlan.meals.map(meal => ({
      ...meal,
      recipe: recipes.find(r => r._id.toString() === meal.recipeId.toString())
    }));

    res.json({ 
      success: true, 
      mealPlan: {
        ...mealPlan,
        meals: mealsWithRecipes
      }
    });
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    res.status(500).json({ error: 'Failed to fetch meal plan' });
  }
});

router.post('/:id/meals', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const { date, mealType, recipeId } = req.body;

    const recipe = await db.collection('recipes').findOne({
      _id: new ObjectId(recipeId)
    });

    const meal = {
      date: new Date(date),
      mealType,
      recipeId: new ObjectId(recipeId),
      recipeName: recipe.title
    };

    await db.collection('mealPlans').updateOne(
      { 
        _id: new ObjectId(req.params.id),
        userId: new ObjectId(decoded.userId)
      },
      { 
        $push: { meals: meal },
        $set: { updatedAt: new Date() }
      }
    );

    const groceryItems = recipe.ingredients.map(ing => ({
      ingredient: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      checked: false
    }));

    await db.collection('mealPlans').updateOne(
      {
        _id: new ObjectId(req.params.id),
        userId: new ObjectId(decoded.userId)
      },
      { $push: { groceryList: { $each: groceryItems } } }
    );

    res.json({ success: true, meal });
  } catch (error) {
    console.error('Error adding meal to plan:', error);
    res.status(500).json({ error: 'Failed to add meal to plan' });
  }
});

router.patch('/:id/grocery/:index', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const { checked } = req.body;
    const index = parseInt(req.params.index);

    await db.collection('mealPlans').updateOne(
      { 
        _id: new ObjectId(req.params.id),
        userId: new ObjectId(decoded.userId)
      },
      { $set: { [`groceryList.${index}.checked`]: checked } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating grocery item:', error);
    res.status(500).json({ error: 'Failed to update grocery item' });
  }
});

module.exports = { router, setDB };
