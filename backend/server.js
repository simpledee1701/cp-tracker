require('dotenv').config();
const express = require('express');
const cors = require('cors');
const leetcodeRoutes = require('./routes/leetcodeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/leetcode', leetcodeRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  const errorDetails = process.env.NODE_ENV === 'production' 
    ? { message: err.message || 'Internal server error' }
    : { message: err.message, stack: err.stack };
    
  res.status(err.status || 500).json({
    success: false,
    error: errorDetails
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;