// 1. Load environment variables first
require('dotenv').config();

// 2. Import all dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 3. Import routes AFTER requiring express
const authRoutes = require('./routes/auth');
const vaultRoutes = require('./routes/vault');

// 4. Initialize Express app
const app = express();

// 5. Middleware setup
app.use(cors());
app.use(express.json());

// 6. Route setup (NOW app is already declared)
app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);

// 7. Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server started on port ${process.env.PORT || 5000}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
