var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi()
});

board.on('ready', function () {

  var Motor1A = 'P1-16';
  var Motor1B = 'P1-18';
  var Motor1E = 'P1-22'; 

  var Motor2A = 'P1-23';
  var Motor2B = 'P1-21';
  var Motor2E = 'P1-19';   


  // Normalize and store in vars
  var p16 = new five.Pin(Motor1A);
  var p18 = new five.Pin(Motor1B);
  var p22 = new five.Pin(Motor1E); 

  var p23 = new five.Pin(Motor2A);
  var p21 = new five.Pin(Motor2B);
  var p19 = new five.Pin(Motor2E); 


  function goForward(){
    // Set pin outputs 
    p16.high();
    p18.low();
    p22.high();

    p23.high();
    p21.low();
    p19.high();

  };

  function goBackwards(){
    // Set pin outputs 
    p16.low();
    p18.high();
    p22.high();

    p23.low();
    p21.high();
    p19.high();
  };


  function turnRight(){
    // Set pin outputs 
    p16.high();
    p18.low();
    p22.high();
  }

  function turnLeft(){
    p23.high();
    p21.low();
    p19.high();
  }  

  function stopMoving(){
      p22.low();
      p19.low();
  }

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var http = require('http').Server(app);
var fs = require('fs');
var path = require('path');

var spawn = require('child_process').spawn;
var proc;

var lastUpdate;

var sockets = {};

app.use('/', express.static(path.join(__dirname, 'stream')));

server.listen(3000);

var interv =  setInterval(function(){
  if(new Date() - lastUpdate > 40){
     stopMoving(); 
   }
}, 20);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});  

app.get('/virtualjoystick.js', function (req, res) {
  res.sendfile(__dirname + '/virtualjoystick.js');
});  

io.on('connection', function (socket) {
 
 sockets[socket.id] = socket;
 console.log("Total clients connected : ", Object.keys(sockets).length);

// Camera logic
  socket.on('disconnect', function() {
    delete sockets[socket.id];
 
    // no more sockets, kill the stream
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile('./stream/image_stream.jpg');
    }
  });

  socket.on('start-stream', function() {
    startStreaming(io);
  });

  function stopStreaming() {
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile('./stream/image_stream.jpg');
    }
  }
   
  function startStreaming(io) {

    console.log('startStreaming called');
   
    if (app.get('watchingFile')) {
      io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
      return;
    }
   
    var args = ["-w", "640", "-h", "480", "-o", "'./stream/image_stream.jpg'", "-t", "999999999", "-tl", "100"];
    proc = spawn('raspistill', args);

    console.log('proc', proc);
   
    console.log('Watching for changes...');
   
    app.set('watchingFile', true);
   
    fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
      io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
    })
   
  }    




  socket.on('direction', function (data) {

  switch(data) {
      case 'front':
          goForward();
          lastUpdate = new Date();
          break;
      case 'back':
          goBackwards();
          lastUpdate = new Date();          
          break;
      case 'right':
          turnRight();
          lastUpdate = new Date();          
          break;
      case 'left':
          turnLeft();
          lastUpdate = new Date();          
          break;                
      default:
          stopMoving(); 
  }

  });
});  


});