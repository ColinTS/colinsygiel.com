var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
 
// set up the template engine
app.set('views', './views');
app.set('view engine', 'pug');
 
// GET response for '/'
app.get('/', function (req, res) {
    // render the 'index' template, and pass in a few variables
    res.render('index');
});
 
// start up the server
app.listen(3000, function () {
    console.log('Listening on http://localhost:3000');
});