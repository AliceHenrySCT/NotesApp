//routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  //getUsername,
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');
const { isAuthenticated } = require('../middlewares/auth');

//Define routes
router.post('/register', register); //Creates a new uswer
router.post('/login', login);//Verifies user email&password
router.get('/welcome', isAuthenticated, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.username}` });
});
router.post('/', createNote); //Create a new note
router.get('/user/:user', getNotes); //Get all notes for current user
router.get('/id/:id', getNoteById); //Get a note by ID
router.put('/:id', updateNote); //Update a note by ID
router.delete('/:id', deleteNote); //Delete a note by ID

module.exports = router;
