//controllers/noteController.js
const Note = require('../models/Note');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();
const { isAuthenticated } = require('../middlewares/auth');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);
    const id = user._id;
    res.status(200).json({ message: 'Login successful', token, id});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Create Note
const createNote = async (req, res) => {
  try {
    const { title, description, owners } = req.body;
    
    
    const newNote = new Note({
      title,
      description,
      owners,
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    if (err.name === 'ValidationError') {
      //Validation error handling
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

//Get all Notes for current user
const getNotes = async (req, res) => {
  try {
    const { user } = req.params;
    const notes = await Note.find({ owners: user}); //Fetch all notes from database that have the current user as an owner
    if (!notes) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

//Get a specific Note by ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

//Update Note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, owners} = req.body;
    const note = await Note.findByIdAndUpdate(
      id,
      { title, description, owners},
      { new: true} 
    );
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

//Delete Note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(200).json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
