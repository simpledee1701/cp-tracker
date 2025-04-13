const express = require('express');
const dotenv = require('dotenv');
const leetroutes = require('./routes/leetcodeRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', leetroutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});