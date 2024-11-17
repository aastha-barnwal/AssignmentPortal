const bcrypt = require('bcrypt');
const User = require('../model/User');
const Assignment = require('../model/Assignment');

const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        
        // Create a new admin
        const newAdmin = new User({ name, email, password, role: 'admin' });
        await newAdmin.save();
        
        // Generate JWT
        // const token = jwt.sign({ userId: newAdmin._id, role: newAdmin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
    try {
        const admin = await User.findOne({ email });
        if (!admin || admin.role !== 'admin') {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Generate JWT
        // const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ message: 'Login successful'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAssignments = async (req, res) => {
    try {
        // Fetch assignments for the logged-in admin
        const assignments = await Assignment.find({ admin: req.session.user.name });
        res.json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching assignments');
    }
};

const updateAssignmentStatus = async (req, res) => {
    try {
        const { id,action } = req.params;
        if (!['accept', 'reject'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action' });
        }
        const assignment = await Assignment.findById(id);
        
        if (!assignment) {
            return res.status(404).send('Assignment not found');
        }

        assignment.status = action === 'accept' ? 'accepted' : 'rejected';
        await assignment.save();

        res.json({ message: `Assignment ${action}ed successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports={registerAdmin,loginAdmin,getAssignments,updateAssignmentStatus}
