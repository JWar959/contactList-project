
require('dotenv').config();
const Database = require('./index'); 

const db = new Database();
db.initialize().then(() => {
    console.log('Database initialization complete!');
}).catch(err => {
    console.error('Database initialization failed:', err);
});


const pug = require('pug');
const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({extended : true})); // enables body parsing
app.set('view engine', 'pug'); // setting view engine

app.use((req, res, next) => {
    console.log('Adding database to request...');
    req.db = db;
    next();
})

// Session setup
app.use(session({
    secret: 'cmps369',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Allow pug templates the user's data if the session exists
app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = {
            id: req.session.user.id,
            email: req.session.user.email
        };
    }
    next();
});

app.get('/', async (req, res) => {
    // Collect information from the db
    const contacts = await req.db.read('Contacts', []);
    res.render('contact', {contacts});
});

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/signup', (req, res) => {
    res.render('signup');
})

app.get('/newContact', (req, res) => {
    res.render('newContact');
})

app.post('/newContact', async (req, res) => {
    await req.db.create('Contacts', [
        { column: 'firstName', value: req.body.firstNameCreate },
        { column: 'lastName', value: req.body.lastNameCreate },
        { column: 'phone', value: req.body.phoneNumCreate },
        { column: 'email', value: req.body.emailCreate },
        { column: 'street', value: req.body.streetCreate },
        { column: 'city', value: req.body.cityCreate },
        { column: 'state', value: req.body.stateCreate },
        { column: 'zip', value: req.body.zipCreate },
        { column: 'country', value: req.body.countryCreate },
        { column: 'contactByEmail', value: req.body.emailCheck !== undefined ? 1 : 0 },
        { column: 'contactByPhone', value: req.body.phoneCheck !== undefined ? 1 : 0 }
    ]);
    res.redirect('/');
});



app.listen(8080, () => {
    console.log('App listening on port 8080');
});