var express = require("express");
var exphbs  = require('express-handlebars');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
   res.render('home', {
       now : new Date()
   });
});

app.get('/about', function(req, res) {
   res.render('about');
});

app.use('/static', express.static('public'));

var port = Number(process.env.PORT || 5000);
app.listen(port);