const mongoose = require('mongoose');
require('dotenv').config({path: './.env.local'});
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
//mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
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
    return user;
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


/*
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

require('dotenv').config({path: './.env.local'});
const url         = process.env.MONGODB_URI;
let db            = null;
 
// connect to mongo
MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
    console.log("Connected successfully to db server");

    // connect to myproject database
    db = client.db('myproject');
});

// create user account
function create(name, email, password){
    return new Promise((resolve, reject) => {    
        const collection = db.collection('users');
        const doc = {name, email, password, balance: 0};
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });    
    })
}

// find user account
function find(email){
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')
            .find({email: email})
            .toArray(function(err, docs) {
                err ? reject(err) : resolve(docs);
        });    
    })
}

// find user account
function findOne(email){
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')
            .findOne({email: email})
            .then((doc) => resolve(doc))
            .catch((err) => reject(err));    
    })
}

// getBalance
function getBalance(email) {
    return new Promise((resolve, reject) => {
        const customer = db
            .collection('users')
            .findOne({email: email})
            .then((doc) => resolve(doc))
            .catch((err) => reject(err));
    })
}

// update - deposit/withdraw amount
function update(email, amount){
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')            
            .findOneAndUpdate(
                { email: email},
                { $inc: {balance: amount}},
                { returnOriginal: false },
                function (err, documents) {
                    err ? reject(err) : resolve(documents);
                }
            );            


    });    
}

// all users
function all(){
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')
            .find({})
            .toArray(function(err, docs) {
                err ? reject(err) : resolve(docs);
        });    
    })
}


module.exports = {create, findOne, getBalance, find, update, all};
*/