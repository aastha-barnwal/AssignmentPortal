const express = require('express');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const session = require('express-session');
const User = require('../model/User'); // Import the User model

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.use(
    session({
        secret: 'aasthaBarnwal',
        resave: false,
        saveUninitialized: true,
    })
);

// Generate Google OAuth2 URL
router.get('/google', (req, res) => {
    const redirectUri = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=openid%20email%20profile`;
    res.redirect(redirectUri);
});

// Handle OAuth2 Callback
router.get('/google/callback', async (req, res) => {
    const { code } = req.query;

    try {
        // Exchange the authorization code for tokens
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code',
        });

        const { id_token, access_token } = response.data;

        // Verify the ID token
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, name } = payload;

        const isAdminEmail = email.endsWith('@growthX.com'); 
        const role = isAdminEmail ? 'admin' : 'user';
        
        
        
        // Find or create the user in the database
        let user = await User.findOne({ googleId: sub });
        if (!user) {
            user = new User({
                googleId: sub,
                name,
                email,
                role,
            });
            await user.save();
        }

        // Save user in the session
        req.session.user = user;

        // Redirect to the dashboard
        res.redirect(`/${role}`);
    } catch (error) {
        console.error('Error during Google OAuth2 callback:', error);
        res.status(500).send('Authentication failed');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
