var fs = require('fs')
var app = require('http').createServer(handler),
io = require('socket.io').listen(app);


var theport = process.env.port || 5000;
app.listen(theport);
console.log ("http server on port: " + theport);

function handler (req, res) {
  fs.readFile(__dirname + "/index.html",
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading index.html");
    }
    res.writeHead(200);
    res.end(data);
  });
}

var redis = require('redis');
var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL);

var sub = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
sub.auth(redisURL.auth.split(":")[1]);

sub.subscribe('games');

io.sockets.on('connection', function (socket) {

    socket.on('room', function(room){
        socket.join(room);
    })
    sub.on('message', function(channel, message){
        console.log(message);
        io.sockets.in(message).emit('reload', 'hello');
    });
});

