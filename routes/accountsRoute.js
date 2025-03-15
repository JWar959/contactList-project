const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/login', async (req, res) => {
    const usernameTemp = req.body.username;
    const passwordTemp = req.body.password;

    try {
        // Check if the user exists
        const userExist = await req.db.read('Users', [
            { column: 'username', value: usernameTemp }
        ]);

        // If the user does NOT exist
        if (userExist.length === 0) {
            return res.render('login', { error: "User does not exist. Please sign up first." });
        }

        // Extract user information
        const user = userExist[0];

        // Check if the password matches (using bcrypt)
        const passwordMatch = bcrypt.compareSync(passwordTemp, user.password);

        if (passwordMatch) {
            // Successful login
            req.session.user = {
                id: user.id,
                username: user.username
            };
            console.log('User logged in successfully!');
            res.redirect('/');
        } else {
            // Incorrect password
            res.render('login', { error: "Incorrect password. Please try again." });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.render('login', { error: 'Failed to retrieve user information from database.' });
    }
});

/*
router.post('/signup', (req, res) => {
*/

/*
           // If we're here, then we didn't find a match in our databse and can continue
           await req.db.create('Users', [
            {column: 'firstName', value: req.body.firstName},
            {column: 'lastName', value: req.body.lastName},
            {column: 'username', value: req.body.username},
            {column: 'password', value: req.body.password}
        ]);
        console.log('User added to list of registered users.');
        res.redirect('/');
*/

module.exports = router;