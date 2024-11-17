const express = require('express')
const connectDB = require('./db.js');
require('dotenv').config();
const userRoutes = require('./route/UserRoutes'); 
const adminRoutes = require('./route/AdminRoutes');
const app = express();
connectDB();
app.use(express.json());
// const isAuthenticated = require('./middleware/AuthMiddleware.js');

// app.get('/dashboard', isAuthenticated, (req, res) => {
//     res.json({ message: `Welcome, ${req.session.user.name}` });
// });
const authRoutes = require('./route/Auth'); // Adjust the path as necessary
app.use('/auth', authRoutes);

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


