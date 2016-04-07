var express = require("express");
var exphbs  = require('express-handlebars');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

POLLS = [
   {
      id: 1,
      name: "Will Warriors Win NBA Championship?"
   },
   {
      id: 2,
      name: "Will Donald Trump Win Republican Nomination?"
   },
];

app.get('/', function(req, res) {
   res.render('home', {
       now : new Date(),
       polls: POLLS
   });
});

function findPoll(poll_id) {
   for(var i=0; i < POLLS.length; i++) {
      var poll = POLLS[i];
      if (poll.id == poll_id) {
         return poll;
      }
   }
   
   return null;
}

app.get('/polls/:poll_id', function(req, res) {
   var poll_id = req.params.poll_id;
   
   var poll = findPoll(poll_id);
   res.render('poll', poll);
});


app.get('/about', function(req, res) {
   res.render('about');
});

app.use('/static', express.static('public'));

var port = Number(process.env.PORT || 5000);
app.listen(port);