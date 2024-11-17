const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true }, // Google ID for OAuth2
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth2 users
    role: { type: String, enum: ['user', 'admin'], required: true },
});

const User = mongoose.model('User', userSchema);
module.exports = User;

