
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

// need to connect the routes here since they're split into different file
const contactsRouter = require('./routes/contacts');

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

/*
// Write a function to test using the database
async function testDataStore(){

    const db = new Database();
    await db.initialize();

    // insert a contact into the database
    const newContactId = await db.create('Contacts', [


        {column: 'firstName', value: 'John'},
        {column: 'lastName', value: 'Warren'},
        {column: 'phone', value:'555-555-5555' },
        {column: 'email', value:'jwarren@example.com' },
        {column: 'street', value: "123 Elm Street" }
    ]);

    console.log(`Entry placed into contact list with ID: ${newContactId}`);

    // read contacts from the database
    const contacts = await db.read('Contacts', []);
    console.log('All Contacts: ', contacts);

}

testDataStore().catch(console.error);
*/
app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/newContact', (req, res) => {
    res.render('newContact');
})

app.get('/signup', (req, res) => {
    res.render('signup');
})

// connect the routes that we split into a seperate folder
app.use('/', require('./routes/contacts'));


/*
app.get('/', async (req, res) => {
    // Collect information from the db
    const contacts = await req.db.read('Contacts', []);
    res.render('contact', {contacts});
});
*/

app.listen(8080, () => {
    console.log('App listening on port 8080');
});