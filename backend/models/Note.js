const mongoose = require('mongoose');

//Note Schema definition
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true, //Removes leading and trailing spaces
    required: true,
    maxLength: 15,//Limits charcter length
  },
  description: {
    type: String,
    trim: true, //Removes leading and trailing spaces
    required: true,
  },
  owners: {
    type: Array,
  },
}, { timestamps: true }); //Automatically add createdAt and updatedAt timestamps

//Create a Mongoose model for the Note schema
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
