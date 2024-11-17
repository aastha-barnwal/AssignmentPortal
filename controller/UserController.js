
const bcrypt = require('bcrypt');
const User = require('../model/User');
const Assignment = require('../model/Assignment');


const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        // Create a new user
        const newUser = new User({ name, email, password, role });
        await newUser.save();

        // Generate JWT
        // const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        // const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const uploadAssignment = async (req, res) => {
    const { task, admin } = req.body;
    const userId = req.session.user.name; // Get the logged-in user

    // Create a new assignment
    const newAssignment = new Assignment({
        userId,
        task,
        admin, 
    });

    try {
        await newAssignment.save();
        res.status(201).send('Assignment uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading assignment');
    }
};

const fetchAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' });
        res.json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports= {registerUser,loginUser,uploadAssignment,fetchAdmins}
