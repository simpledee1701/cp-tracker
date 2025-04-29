require('dotenv').config();
const express = require('express');
const cors = require('cors');
const leetcodeRoutes = require('./routes/leetcodeRoutes');
const codechefRoutes = require('./routes/codechefRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(cors());
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/codechef', codechefRoutes);

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