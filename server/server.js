// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var settings = require('./config');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(allowCrossDomain);

var port     = process.env.PORT || 9090; // set our port

var mongoose   = require('mongoose');
mongoose.connect(settings.db); // connect to our database
var Poll     = require('./app/models/poll');

// ROUTES FOR OUR API
// =============================================================================

io.on('connection', function (socket) {
	console.log('connected');
});

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET /api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

//=============================================================================
// on routes that end in /poll
// ----------------------------------------------------
router.route('/poll')

	// create a poll (accessed at POST /poll)
	.post(function(req, res) {
		
		var poll = new Poll();		// create a new instance of the poll model
		poll.id = makeid();
		poll.name = req.body.name;  // set the poll name (comes from the request)
		poll.multiple = req.body.multiple;
		poll.answers = req.body.answers;
		poll.votes = req.body.votes;
		poll.save(function(err, poll) {
			if (err)
				res.send(err);

			res.json([{ response: 'Poll created!' },{poll: poll}]);
		});

		
	})

	// get all the poll (accessed at GET /api/poll)
	.get(function(req, res) {
		Poll.find(function(err, poll) {
			if (err)
				res.send(err);

			res.json(poll);
		});
	});

// on routes that end in /poll/:poll_id
// ----------------------------------------------------
router.route('/poll/:poll_id')

	// get the poll with that id
	.get(function(req, res) {
		Poll.findOne({id :req.params.poll_id}, function(err, poll) {
			if (err)
				res.send(err);
			res.json(poll);
		});
	})

	// update the poll with this id
	.put(function(req, res) {
		Poll.findOne({id :req.params.poll_id}, function(err, poll) {
			if (err){
				res.send(err);
			}

			for(x = 0; x < req.body.votes.length; x++){
				if(req.body.votes[x] != null){
					poll.votes[x] += req.body.votes[x];
				}
			}

			poll.markModified('votes');
			poll.save(function(err) {
				io.emit('chat' + req.params.poll_id, poll);
				if (err){
					res.send(err);
				}else{
					res.json(poll);
				}
			});

		});
	})

app.use('/api', router);

server.listen(port);
console.log('Magic happens on port ' + port);
