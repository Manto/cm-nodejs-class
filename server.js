// Initialize express and handlebars packages
var express = require("express");
var exphbs  = require('express-handlebars');

// Initialize the packages we need to access MongoDB
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodejs');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

// Defining routes
app.get('/', function(req, res) {
   var collection = db.get('polls');

   // Find all polls from MongoDB and pass that data over to template
   collection.find({},{},function(error,data){
      res.render('home', {
          now : new Date(),
          polls: data
      });
   });
});

app.get('/polls/:poll_id', function(req, res) {
   var collection = db.get('polls');
   var poll_id = req.params.poll_id;
   
   collection.findById(poll_id,function(error,poll){
      res.render('poll', poll);
   });
});


app.get('/about', function(req, res) {
   res.render('about');
});

// Define a static folder to serve images, CSS files, etc
app.use('/static', express.static('public'));

// Start the server!
var port = Number(process.env.PORT || 5000);
app.listen(port);