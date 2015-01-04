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

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});  

io.on('connection', function (socket) {
  socket.on('direction', function (data) {

    console.log(data);

  switch(data) {
      case 'front':
          goForward();
          break;
      case 'back':
          goBackwards();
          break;
      case 'right':
          turnRight();
          break;
      case 'left':
          turnLeft();
          break;                
      default:
          stopMoving(); 
  }

  });
});  


});