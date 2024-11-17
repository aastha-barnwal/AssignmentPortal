const express = require('express');

const { registerUser, loginUser, uploadAssignment, fetchAdmins } = require('../controller/UserController');
const UserRoutes = express.Router();
const {isAdminAuthenticated,isUserAuthenticated} = require('../middleware/AuthMiddleware')

UserRoutes.get('/',(req,res)=>{return res.status(200).json({ message: 'Hello User' });})
UserRoutes.post('/register', registerUser);
UserRoutes.post('/login', loginUser);
UserRoutes.post('/upload',isUserAuthenticated, uploadAssignment);
UserRoutes.get('/admins',isUserAuthenticated, fetchAdmins);

module.exports = UserRoutes;

