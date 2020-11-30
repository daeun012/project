let app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
let bodyParser = require('body-parser');
let userRoute = require('./userRoute');
let chatRoute = require('./chatRoute');
var chatController = require('../controllers/chatController');
const userController = require('../controllers/userController');

const PORT = 5000;

http.listen(PORT, () => {
  console.log('Listening on port: ', PORT);
});

app.use(bodyParser.json({ limit: '10mb', extended: true })); // body 크기 설정
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // url 크기 설정
app.use('/users/', userRoute.router);
app.use('/chat/', chatRoute.router);

var connections = [];
var clients = [];
var onlineTab = [];

var mainSocket = io.on('connection', async (socket) => {
  await onlineTab.push({
    user_id: socket.handshake.query['user_id'],
    socketID: socket.id,
  });

  console.log({ onlineTab });

  chatController.onlineStatus(socket.handshake.query['user_id']);

  socket.broadcast.emit('online', {
    user_id: socket.handshake.query['user_id'],
    status: 'Online',
  });

  socket.on('startMatch', async (user_id) => {
    var startMatch = await userController.startMatch(user_id);
    console.log(startMatch);

    socket.emit('room_id', startMatch);
  });

  socket.on('disconnect', (reason) => {
    //console.log(reason);
    for (var i = 0; i < onlineTab.length; i++) {
      if (onlineTab[i]['socketID'] == socket.id) onlineTab.splice(i, 1);
    }
    var result = onlineTab.find((elem) => elem.user_id === socket.handshake.query['user_id']);
    if (result === undefined) {
      socket.broadcast.emit('offline', {
        user_id: socket.handshake.query['user_id'],
        status: 'Offline',
      });
      chatController.offlineStatus(socket.handshake.query['user_id']);
      console.log('%d socket(s) online', onlineTab.length);
      console.log({ onlineTab });
    }
  });
});

var nsp = io.of('/chat');

nsp.on('connection', (socket) => {
  // Get variables
  var user_id = socket.handshake.query['user_id'];
  var userToken = socket.handshake.query['token'];
  var userID = socket.handshake.query['userID'];
  var room_id = socket.handshake.query['room_id'];

  socket.join(room_id);

  socket.on(room_id, async (data) => {
    chatController.saveMessage([data, user_id, room_id]);

    socket.broadcast.emit(room_id, { data, user_id, userID });
  });

  socket.on('disconnect', () => {
    connections.splice(-1, 1);
    for (var i = 0, len = clients.length; i < len; ++i) {
      var c = clients[i];

      if (c.socketID == socket.id) {
        clients.splice(i, 1);
        break;
      }
    }
  });
});
