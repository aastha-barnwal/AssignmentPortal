// Middleware to check if the user is an admin
const isAdminAuthenticated = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        next(); // Proceed if admin
    } else {
        res.status(403).send('Permission denied. Admins only.');
    }
};
const isUserAuthenticated = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'user') {
        next(); 
    } else {
        res.status(401).send('Unauthorized: Please log in');
    }
};

module.exports = {isAdminAuthenticated,isUserAuthenticated};
