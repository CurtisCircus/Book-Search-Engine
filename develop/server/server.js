// Import necessary modules
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const session = require('express-session'); // For managing user sessions
const passport = require('passport'); // For authentication
require('./config/passport')(passport); // Passport configuration file

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Serve static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Routes
app.use(routes);

// Connect to MongoDB
db.once('open', () => {
  console.log('Connected to the database');

  // Start the server
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
