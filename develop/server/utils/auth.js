const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = 'mysecretsshhhhh';
const expiration = '2h';
const User = require('../models/User'); // Import your User model

module.exports = {
  authMiddleware: function (req, res, next) {
    let token = req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      next();
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'Invalid token!' });
    }
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  signUp: async function ({ username, email, password }) {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email is already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({ username, email, password: hashedPassword });

      return {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      };
    } catch (error) {
      throw new Error('Registration failed');
    }
  },

  logIn: async function ({ email, password }) {
    try {
      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }

      const token = this.signToken({ username: user.username, email: user.email, _id: user._id });
      return token;
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  isLoggedIn: function (req) {
    return req.user ? true : false;
  },
};
