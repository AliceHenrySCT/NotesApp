const Note = require('../models/Note');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();
const { isAuthenticated } = require('../middlewares/auth');

//Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password }); //Create new user in database
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Log in an existing user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }); //Find user by email
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password); //Check if password matches
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Login successful', token, id: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get all users from the database
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ error: 'No users found' });
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

//Get a user's username by ID
const getUsername = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user.username);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

//Remove a user from a note's ownership
const removeUser = async (req, res) => {
  try {
    const obj = req.params;
    const data = obj.id.split(",");
    const note = await Note.findById(data[1]); //Find the note by ID

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const index = note.owners.indexOf(data[0]);
    note.owners.splice(index, 1); //Remove the user from the owners list

    const updatedNote = await Note.findByIdAndUpdate(
      data[1],
      { owners: note.owners },
      { new: true }
    );

    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

//Create a new note
const createNote = async (req, res) => {
  try {
    const { title, description, owners } = req.body;
    const newNote = new Note({ title, description, owners }); //Create note instance
    await newNote.save(); //Save note to database
    res.status(201).json(newNote);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

//Get all notes for a specific user
const getNotes = async (req, res) => {
  try {
    const { user } = req.params;
    const notes = await Note.find({ owners: user }); //Find notes owned by the user
    if (!notes) {
      return res.status(404).json({ error: 'Notes not found' });
    }
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

//Get a note by its ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id); //Find note by ID
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

//Update a note by its ID
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, owners } = req.body;

    const note = await Note.findByIdAndUpdate(
      id,
      { title, description, owners },
      { new: true } //Return updated note
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

//Delete a note by its ID
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id); //Delete note from database
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
  getUsers,
  getUsername,
  removeUser,
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
