import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

dotenv.config();

const {
  DB_URI = '',
  DB_NAME = 'uyjoy',
  DB_USERS_COLLECTION = 'users',
  DB_PAYMENTS_COLLECTION = 'payments',
  PORT = 3001,
} = process.env;

if (!DB_URI) {
  console.error('Missing DB_URI in environment. Create a .env.local file and set DB_URI.');
  process.exit(1);
}

const client = new MongoClient(DB_URI, {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
});

let db;

async function connectDatabase() {
  try {
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`✅ Connected to MongoDB database: ${DB_NAME}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  return res.json({ success: true, message: 'Server is running', database: DB_NAME });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await db.collection(DB_USERS_COLLECTION).findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash || '');
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const safeUser = {
      _id: user._id,
      email: user.email,
      name: user.name || null,
      role: user.role || 'user',
    };

    return res.json({ success: true, user: safeUser });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed due to server error.' });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const existingUser = await db.collection(DB_USERS_COLLECTION).findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.collection(DB_USERS_COLLECTION).insertOne({
      email,
      passwordHash,
      name: name || null,
      role: 'user',
      createdAt: new Date(),
    });

    return res.status(201).json({ success: true, userId: result.insertedId });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Registration failed due to server error.' });
  }
});

app.post('/api/pay', async (req, res) => {
  const { amount, userId } = req.body;
  if (!amount || !userId) {
    return res.status(400).json({ error: 'Missing amount or userId' });
  }

  console.log(`Processing payment request: User ${userId}, Amount ${amount} UZS`);

  const merchantId = '64352f754a6c8e32900c6d94';
  const tiyinAmount = amount * 100;
  const params = `m=${merchantId};ac.user_id=${userId};a=${tiyinAmount}`;
  const encodedParams = Buffer.from(params).toString('base64');
  const payment_url = `https://checkout.paycom.uz/${encodedParams}`;

  try {
    await db.collection(DB_PAYMENTS_COLLECTION).insertOne({
      userId,
      amount,
      tiyinAmount,
      payment_url,
      createdAt: new Date(),
    });
  } catch (error) {
    console.warn('Failed to save payment log:', error);
  }

  return res.json({
    success: true,
    payment_url,
    message: 'Payment link generated successfully',
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\x1b[36m%s\x1b[0m`, `>>> Backend running on http://localhost:${PORT}`);
    console.log(`\x1b[33m%s\x1b[0m`, `>>> Health check: GET http://localhost:${PORT}/api/health`);
    console.log(`\x1b[33m%s\x1b[0m`, `>>> Login endpoint: POST http://localhost:${PORT}/api/login`);
    console.log(`\x1b[33m%s\x1b[0m`, `>>> Register endpoint: POST http://localhost:${PORT}/api/register`);
    console.log(`\x1b[33m%s\x1b[0m`, `>>> Payment endpoint: POST http://localhost:${PORT}/api/pay`);
  });
});
