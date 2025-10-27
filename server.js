const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const recipesModule = require('./routes/recipes');
const aiModule = require('./routes/ai');
const userModule = require('./routes/user');
const mealPlansModule = require('./routes/meal-plans');

const app = express();
const PORT = process.env.PORT || 3001;

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const OTP_API = process.env.OTP_API_URL || 'https://otp.dynamictech.gleeze.com';

if (!MONGODB_URI) {
  console.error('FATAL: MONGODB_URI environment variable is required');
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is required');
  process.exit(1);
}

let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;
  const client = await MongoClient.connect(MONGODB_URI);
  cachedDb = client.db('authSystem');
  return cachedDb;
}

async function sendOTP(phone) {
  const response = await fetch(`${OTP_API}/api/sendotp?number=${encodeURIComponent(phone)}`);
  return await response.json();
}

async function verifyOTP(phone, code) {
  const response = await fetch(`${OTP_API}/api/verifyotp?number=${encodeURIComponent(phone)}&code=${code}`);
  return await response.json();
}

app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

async function initializeRoutes() {
  const db = await connectDB();
  recipesModule.setDB(db);
  aiModule.setDB(db);
  userModule.setDB(db);
  mealPlansModule.setDB(db);
}

initializeRoutes().then(() => {
  app.use('/api/recipes', recipesModule.router);
  app.use('/api/ai', aiModule.router);
  app.use('/api/user', userModule.router);
  app.use('/api/meal-plans', mealPlansModule.router);
  console.log('All routes initialized');
}).catch(err => {
  console.error('Failed to initialize routes:', err);
});

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const db = await connectDB();
    const exists = await db.collection('users').findOne({ 
      $or: [{ email }, { phone }] 
    });
    
    if (exists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const otpResult = await sendOTP(phone);
    
    if (!otpResult.success) {
      return res.status(500).json({ error: 'Failed to send OTP' });
    }

    await db.collection('pendingSignups').updateOne(
      { phone },
      { 
        $set: { 
          name, 
          email, 
          phone, 
          password: await bcrypt.hash(password, 10),
          createdAt: new Date() 
        } 
      },
      { upsert: true }
    );

    return res.json({ 
      success: true, 
      message: 'OTP sent to your WhatsApp' 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/verify-signup', async (req, res) => {
  try {
    const { phone, code } = req.body;
    
    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone and code required' });
    }

    const otpResult = await verifyOTP(phone, code);
    
    if (!otpResult.success) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const db = await connectDB();
    const pending = await db.collection('pendingSignups').findOne({ phone });
    
    if (!pending) {
      return res.status(400).json({ error: 'Signup session expired' });
    }

    const result = await db.collection('users').insertOne({
      name: pending.name,
      email: pending.email,
      phone: pending.phone,
      password: pending.password,
      verified: true,
      profilePicture: '',
      bio: '',
      dietaryPreferences: [],
      allergies: [],
      favoriteRecipes: [],
      recipeBooks: [],
      cookingJournal: [],
      following: [],
      followers: [],
      createdRecipes: [],
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await db.collection('pendingSignups').deleteOne({ phone });

    const token = jwt.sign(
      { userId: result.insertedId, phone }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return res.json({ 
      success: true, 
      token,
      user: { 
        id: result.insertedId, 
        name: pending.name, 
        email: pending.email,
        phone 
      }
    });
  } catch (error) {
    console.error('Verify signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number required' });
    }

    const db = await connectDB();
    const user = await db.collection('users').findOne({ phone });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otpResult = await sendOTP(phone);
    
    if (!otpResult.success) {
      return res.status(500).json({ error: 'Failed to send OTP' });
    }

    return res.json({ 
      success: true, 
      message: 'OTP sent to your WhatsApp' 
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/verify-login', async (req, res) => {
  try {
    const { phone, code } = req.body;
    
    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone and code required' });
    }

    const otpResult = await verifyOTP(phone, code);
    
    if (!otpResult.success) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const db = await connectDB();
    const user = await db.collection('users').findOne({ phone });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign(
      { userId: user._id, phone }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return res.json({ 
      success: true, 
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        phone: user.phone 
      }
    });
  } catch (error) {
    console.error('Verify login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || typeof authHeader !== 'string') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const db = await connectDB();
      const user = await db.collection('users').findOne({ 
        _id: new ObjectId(decoded.userId) 
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({ 
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          verified: user.verified
        }
      });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || typeof authHeader !== 'string') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const { name, email } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const db = await connectDB();
      
      const emailExists = await db.collection('users').findOne({ 
        email,
        _id: { $ne: new ObjectId(decoded.userId) }
      });
      
      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use by another account' });
      }

      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $set: { name, email, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = await db.collection('users').findOne({ 
        _id: new ObjectId(decoded.userId) 
      });

      return res.json({ 
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          verified: user.verified
        }
      });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
