const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: true,
    unique: true //Ensures no other user has the same username
    },
  email: { 
    type: String, 
    required: true, 
    unique: true //Ensures no other user has the same email
  },
  password: { 
    type: String,
    required: true 
    }, 
});

//pre middleware
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//instance method
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
