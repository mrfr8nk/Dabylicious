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

router.post('/favorites/:recipeId', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const recipeId = new ObjectId(req.params.recipeId);

    const user = await db.collection('users').findOne({
      _id: new ObjectId(decoded.userId)
    });

    const isFavorited = user.favoriteRecipes?.some(id => id.toString() === recipeId.toString());

    if (isFavorited) {
      await db.collection('users').updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $pull: { favoriteRecipes: recipeId } }
      );
      await db.collection('recipes').updateOne(
        { _id: recipeId },
        { $inc: { favorites: -1 } }
      );
      res.json({ success: true, favorited: false });
    } else {
      await db.collection('users').updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $addToSet: { favoriteRecipes: recipeId } }
      );
      await db.collection('recipes').updateOne(
        { _id: recipeId },
        { $inc: { favorites: 1 } }
      );
      res.json({ success: true, favorited: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

router.get('/favorites', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    
    const user = await db.collection('users').findOne({
      _id: new ObjectId(decoded.userId)
    });

    const favoriteRecipes = await db.collection('recipes').find({
      _id: { $in: user.favoriteRecipes || [] }
    }).toArray();

    res.json({ success: true, recipes: favoriteRecipes });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

router.post('/recipe-books', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Recipe book name is required' });
    }

    const recipeBook = {
      name,
      recipes: [],
      createdAt: new Date()
    };

    await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $push: { recipeBooks: recipeBook } }
    );

    res.json({ success: true, recipeBook });
  } catch (error) {
    console.error('Error creating recipe book:', error);
    res.status(500).json({ error: 'Failed to create recipe book' });
  }
});

router.post('/recipe-books/:bookName/recipes/:recipeId', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const { bookName, recipeId } = req.params;

    await db.collection('users').updateOne(
      { 
        _id: new ObjectId(decoded.userId),
        'recipeBooks.name': bookName
      },
      { 
        $addToSet: { 
          'recipeBooks.$.recipes': new ObjectId(recipeId) 
        } 
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding recipe to book:', error);
    res.status(500).json({ error: 'Failed to add recipe to book' });
  }
});

router.post('/cooking-journal', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const { recipeId, notes, rating } = req.body;

    const journalEntry = {
      recipeId: new ObjectId(recipeId),
      notes,
      rating: parseInt(rating),
      cookedAt: new Date()
    };

    await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $push: { cookingJournal: journalEntry } }
    );

    res.json({ success: true, entry: journalEntry });
  } catch (error) {
    console.error('Error adding cooking journal entry:', error);
    res.status(500).json({ error: 'Failed to add journal entry' });
  }
});

router.get('/cooking-journal', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    
    const user = await db.collection('users').findOne({
      _id: new ObjectId(decoded.userId)
    });

    const journal = user.cookingJournal || [];
    const recipeIds = journal.map(entry => entry.recipeId);
    
    const recipes = await db.collection('recipes').find({
      _id: { $in: recipeIds }
    }).toArray();

    const journalWithRecipes = journal.map(entry => ({
      ...entry,
      recipe: recipes.find(r => r._id.toString() === entry.recipeId.toString())
    }));

    res.json({ success: true, journal: journalWithRecipes });
  } catch (error) {
    console.error('Error fetching cooking journal:', error);
    res.status(500).json({ error: 'Failed to fetch cooking journal' });
  }
});

router.post('/follow/:userId', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const targetUserId = new ObjectId(req.params.userId);

    const currentUser = await db.collection('users').findOne({
      _id: new ObjectId(decoded.userId)
    });

    const isFollowing = currentUser.following?.some(id => id.toString() === targetUserId.toString());

    if (isFollowing) {
      await db.collection('users').updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $pull: { following: targetUserId } }
      );
      await db.collection('users').updateOne(
        { _id: targetUserId },
        { $pull: { followers: new ObjectId(decoded.userId) } }
      );
      res.json({ success: true, following: false });
    } else {
      await db.collection('users').updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $addToSet: { following: targetUserId } }
      );
      await db.collection('users').updateOne(
        { _id: targetUserId },
        { $addToSet: { followers: new ObjectId(decoded.userId) } }
      );
      res.json({ success: true, following: true });
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    res.status(500).json({ error: 'Failed to toggle follow' });
  }
});

router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await db.collection('users').findOne({
      _id: new ObjectId(req.params.userId)
    }, {
      projection: { password: 0 }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const createdRecipes = await db.collection('recipes').find({
      author: user._id
    }).toArray();

    res.json({ 
      success: true, 
      user: {
        ...user,
        createdRecipes
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

module.exports = { router, setDB };
