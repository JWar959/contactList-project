const pug = require('pug');
const express = require('express');
const app = express();
app.use(express.urlencoded({extended : true})); // enables body parsing
app.set('view engine', 'pug'); // sets pug as template

app.get('/foo', (req, res) => {
    res.render('foo', {a:10, b:12});
});

app.listen(8080, () => {
    console.log('App listening on port 8080');
});