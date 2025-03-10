const pug = require('pug');
const express = require('express');
const app = express();

app.use(express.urlencoded({extended : true})); // enables body parsing
app.set('view engine', 'pug'); // setting view engine

app.get('/', (req, res) => {
    res.render('contact', {a:10, b:12});
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

app.listen(8080, () => {
    console.log('App listening on port 8080');
});