const express = require('express');
const app = express();
const PORT = 3000;

// Logging Middleware
function loggerMiddleware(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}

// Bearer Token Authentication Middleware
function authMiddleware(req, res, next) {
  const authHeader = req.get('Authorization') || req.get('authorization');
  
  if (!authHeader)
    return res.status(401).json({ message: 'Authorization header missing' });
  
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer')
    return res.status(400).json({ message: 'Malformed Authorization header' });
  
  if (parts[1] !== 'mysecrettoken')
    return res.status(403).json({ message: 'Invalid Bearer token' });
  
  next();
}

// Apply logger globally
app.use(loggerMiddleware);

// Public Route
app.get('/public', (req, res) => {
  res.json({ message: 'Welcome to the public route. No token required!' });
});

// Protected Route
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Access granted to protected route!' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
