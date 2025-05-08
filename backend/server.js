require('dotenv').config();
const express = require('express');
const cors = require('cors');
const leetcodeRoutes = require('./routes/leetcodeRoutes');
const codechefRoutes = require('./routes/codechefRoutes');
const codeforcesRoutes = require('./routes/codeforcesRoutes');
const userRoutes = require('./routes/userRoutes');
const contestRoutes = require('./routes/contestRoutes');
const calenderRoutes = require('./routes/calendarRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['Authorization']
}));

app.use(express.json());

app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/codechef', codechefRoutes);
app.use('/api/codeforces',codeforcesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contests',contestRoutes);
app.use('/api/calendar',calenderRoutes);

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