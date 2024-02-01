const router = require('express').Router();
const {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
  logout,
} = require('../../controllers/user-controller');

const { authMiddleware } = require('../../utils/auth');

// User Routes
router.post('/signup', createUser);
router.post('/login', login);
router.post('/logout', authMiddleware, logout); // You can implement a logout endpoint if needed
router.get('/me', authMiddleware, getSingleUser);

// Book Routes
router.route('/books/:bookId')
  .delete(authMiddleware, deleteBook)
  .post(authMiddleware, saveBook);

module.exports = router;
