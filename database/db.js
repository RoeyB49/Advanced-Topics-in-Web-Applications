const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://RoeyBiton:A1234@cluster0.amgly.mongodb.net/blog');
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
