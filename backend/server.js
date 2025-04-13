require('dotenv').config();
const express = require('express');
const cors = require('cors');
const leetcodeRoutes = require('./routes/leetcodeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/leetcode', leetcodeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;