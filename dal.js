const mongoose = require('mongoose');
require('dotenv').config({path: '../.env'});
const url = process.env.MONGODB_URI;

// Define the User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  balance: { type: Number, default: 0 }
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Connect to MongoDB
mongoose.connect(url, {})
  .then(() => {
    console.log("Connected successfully to MongoDB");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });

// Create user account
async function create(name, email, password) {
  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    return newUser;
  } catch (err) {
    throw err;
  }
}

// Find user account
async function find(email) {
  try {
    const users = await User.find({ email });
    return users;
  } catch (err) {
    throw err;
  }
}

// Find one user account
async function findOne(email) {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (err) {
    throw err;
  }
}

// Get balance
async function getBalance(email) {
  try {
    const user = await User.findOne({ email });
    return user.balance;
  } catch (err) {
    throw err;
  }
}

// Update - deposit/withdraw amount
async function update(email, amount) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $inc: { balance: amount } },
      { new: true } // Return the updated document
    );
    return updatedUser;
  } catch (err) {
    throw err;
  }
}

// All users
async function all() {
  try {
    const users = await User.find({});
    return users;
  } catch (err) {
    throw err;
  }
}

module.exports = { create, findOne, getBalance, find, update, all };