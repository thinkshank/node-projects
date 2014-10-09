var app = require('express')();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/jquery-1.11.1.js', function(req, res){
  res.sendFile(path.join(__dirname, 'jquery-1.11.1.js'));
});

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
    	io.emit('chat message', msg);
  	});

	socket.on('disconnect', function(){
    	console.log('user disconnected');
  	});

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});