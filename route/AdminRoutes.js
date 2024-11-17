const express = require('express');
const { registerAdmin, loginAdmin, getAssignments, updateAssignmentStatus } = require('../controller/AdminController');
const AdminRoutes = express.Router();
const {isAdminAuthenticated,isUserAuthenticated} = require('../middleware/AuthMiddleware')

AdminRoutes.get('/',(req,res)=>{return res.status(200).json({ message: 'Hello Admin' });})
AdminRoutes.post('/register', registerAdmin);
AdminRoutes.post('/login', loginAdmin);
AdminRoutes.get('/assignments',isAdminAuthenticated, getAssignments);
AdminRoutes.post('/assignments/:id/:action',isAdminAuthenticated, updateAssignmentStatus);

module.exports = AdminRoutes;
