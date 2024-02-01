const router = require('express').Router();
const path = require('path');

// Import your API routes
const apiRoutes = require('./api');

// Import your HTML routes (if any)
// const htmlRoutes = require('./html');

router.use('/api', apiRoutes);

// HTML routes (serve React front-end in production)
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Add any additional HTML routes as needed

module.exports = router;
