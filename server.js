// Initialize express and handlebars packages
var express = require("express");
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser')

// Initialize the packages we need to access MongoDB
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodejs');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));

// Renders the webpage for viewing all of the polls
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

// Renders the webpage for viewing a particular poll
app.get('/polls/:poll_id', function(req, res) {
   var collection = db.get('polls');
   var poll_id = req.params.poll_id;
   
   collection.findById(poll_id,function(error,poll){
      res.render('poll', poll);
   });
});

// gets the vote results
app.get('/polls/:poll_id/results', function(req, res) {
  var polls = db.get('polls');
  var poll_votes = db.get('poll_votes');
  var poll_id = req.params.poll_id;

  polls.findById(poll_id,function(error,poll){
    poll_votes.count( { poll_id: mongo.ObjectId(poll_id) }, function(error, count) {
      poll['vote_count'] = count;
      poll_votes.count( { poll_id: mongo.ObjectId(poll_id), vote_choice: 1 }, function(error, count) {
        poll['yes_count'] = count;
        poll_votes.count( { poll_id: mongo.ObjectId(poll_id), vote_choice: 2 }, function(error, count) {
          poll['no_count'] = count;
          res.render('result', poll);
        });
      });
    });
  });
});

// API for submitting a vote
app.post('/polls/:poll_id/vote', function(req, res) {
  var polls = db.get('polls');
  var poll_votes = db.get('poll_votes');
  var poll_id = req.params.poll_id;

  // get the submitted form values
  var vote_choice = req.body.vote_choice;
  var agree_prediction = req.body.agree_prediction;

  poll_votes.insert({
    poll_id: mongo.ObjectId(poll_id),
    vote_choice: parseInt(vote_choice),
    agree_prediction: parseInt(agree_prediction)
  }, function(err, doc) {

    if (err) {
      res.send("There was an error: " + err);
    }
    else {
      polls.update({
        _id: mongo.ObjectId(poll_id)
      }, {
        $inc: {
          vote_count_auto: 1
        }
      }, function(err, doc) {
        if(err) {
          res.send("There was an error: " + err);
        }
        else {
          res.send("Vote submitted!");
        }
      });
    }
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