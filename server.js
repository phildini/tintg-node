var port = process.env.port || 5000;
var io = require('socket.io').listen(port);
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