require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./Config/database');
const routes = require('./Router/index');
const wafMiddleware = require('./MiddleWare/wafMiddleware');
const rateLimiter = require('./MiddleWare/rateLimiter');
const errorHandler = require('./MiddleWare/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.use(wafMiddleware);
app.use(rateLimiter({ maxRequests: 100, windowMs: 15 * 60 * 1000 }));

connectDB();

app.get('/', (req, res) => {
  res.json({ 
    message: 'Gym App API is running',
    status: 'active',
    version: '1.0.0'
  });
});

app.use('/api/v1', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/v1`);
});

module.exports = app;
