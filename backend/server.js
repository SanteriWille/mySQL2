const db = require('./db')
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'] 
}));
app.use(express.json());

const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes)

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveren kjører på http://localhost:${PORT}`);
});