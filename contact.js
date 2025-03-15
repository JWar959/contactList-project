
require('dotenv').config();
const Database = require('./index');
const bcrypt = require('bcryptjs'); 

const db = new Database();
db.initialize().then( async () => {

    console.log('Database initialization complete!');
    // call the default admin function here
    await addDefaultUser(db);

}).catch(err => {
    console.error('Database initialization failed:', err);
});

const pug = require('pug');
const express = require('express');
const session = require('express-session');

// We can add the default user in here
async function addDefaultUser(db){
    
    // assign the default user name and password first
    const adminUsername = 'cmps369';
    const adminPassword = 'rcnj';

    // Check to see if the user exists 
    const existingUser = await db.read('Users',[
        { column: 'username', value: adminUsername}
    ]);

    if(existingUser.length === 0){
        // If we're here, then we have a non-repeat genuwine new user
        // We'll need to hash and salt next.
       const salt = bcrypt.genSaltSync(10);
       const hashedPassword = bcrypt.hashSync(adminPassword, salt);
       
       // Now we can safely add the admin user to the Database
       await db.create('Users', [
        { column: 'firstName', value: 'Admin'},
        { column: 'lastName', value: 'User'},
        { column: 'username', value: adminUsername },
        { column: 'password', value: hashedPassword }
       ]);

       console.log(`Default admin account created: %{adminUserName}`);
    }
    else{
        // If we're here, the account already exists
        console.log('Admin account already exists ${adminUsername}');
    }

}

/*
// need to connect the routes here since they're split into different file
const contactsRouter = require('./routes/contacts');
*/

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




/*
app.get('/', async (req, res) => {
    // Collect information from the db
    const contacts = await req.db.read('Contacts', []);
    res.render('contact', {contacts});
});
*/


// connect the routes that we split into a seperate folder
app.use('/accounts', require('./routes/accountsRoute'));
app.use('/contact', require('./routes/contactsRoute'));
app.use('/', require('./routes/contacts'));



app.listen(8080, () => {
    console.log('App listening on port 8080');
});