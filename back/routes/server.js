let app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
let bodyParser = require('body-parser');
let userRoute = require('./userRoute');
var moment = require('moment');

const PORT = 5000;

http.listen(PORT, () => {
  console.log('Listening on port: ', PORT);
});

app.use(bodyParser.json({ limit: '10mb', extended: true })); // body 크기 설정
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // url 크기 설정
app.use('/users/', userRoute.router);

const matchModel = require('../models/matchModel');
const chatModel = require('../models/chatModel');
const matchController = require('../controllers/matchController');
const chatController = require('../controllers/chatController');
const client = require('./client.js');
// custom variable
var client_list = {};
var room_list = {};

// socket connection state;
io.on('connection', (socket) => {
  // 처음 시작
  socket.on('start', async (msg) => {
    // client_list 에 추가
    if (client_list[msg.id] == null) {
      client_list[msg.id] = new client(socket.id, msg.id, msg.userID);
      console.log(client_list);
    } else {
      reRegistration(socket.id, msg.id, msg.userID);
      console.log('[err] This id is a duplicate.');
    }

    var room_id = await matchModel.getRoomIdFromId(msg.id);
    if (room_id) {
      socket.join(room_id);
      if (room_list[room_id]) {
        // 맴버 업데이트
        socket.emit('updateMember', room_list[room_id]);

        // 그 전 메세지 가져오기
        var data = await chatModel.getMessages(msg.id, room_id);

        let tab = [];
        for (var i = 0; i < data.length; i++) {
          tab.push({
            id: i + 1,
            msg: data[i]['msg'],
            msgFrom_id: data[i]['msgFrom_id'],
            msgFrom_name: data[i]['msgFrom_name'],
            date: moment(data[i]['date']).format('h:mm'),
          });
        }

        socket.emit('updateChat', tab);
      } else {
        // 맴버 업데이트
        var members = await matchController.getMembers(room_id);
        room_list[room_id] = members;
        socket.emit('updateMember', room_list[room_id]);

        // 그 전 메세지 가져오기
        var data = await chatModel.getMessages(msg.id, room_id);

        let tab = [];
        for (var i = 0; i < data.length; i++) {
          tab.push({
            id: i + 1,
            msg: data[i]['msg'],
            msgFrom_id: data[i]['msgFrom_id'],
            msgFrom_name: data[i]['msgFrom_name'],
            date: moment(data[i]['date']).format('h:mm'),
          });
        }
        socket.emit('updateChat', tab);
      }
    }
  });

  // 랜덤 채팅 시작 메시지 발신
  socket.on('RMStart', async (msg) => {
    // 매칭 실행
    var room_id = await matchController.matchingRandom(msg.id, msg.grade, msg.dept);

    var members = await matchController.getMembers(room_id);
    room_list[room_id] = members;

    console.log(room_list[room_id]);

    socket.join(room_id);
    socket.emit('setRoomId', room_id);

    io.to(room_id).emit('updateMember', room_list[room_id]);

    socket.emit('newMessage', { msg: '매칭이 완료 되었습니다!', msgFrom_id: 999, msgFrom_name: '관리자', date: Date.now() });

    chatController.saveMessage({ room_id: room_id, msg: `'${msg.name}' 님이 입장하셨습니다.`, msgFrom_id: 999, msgFrom_name: `관리자_${msg.id}` });
    socket.broadcast.to(room_id).emit('newMessage', { msg: `'${msg.name}' 님이 입장하셨습니다.`, msgFrom_id: 999, msgFrom_name: '관리자', date: Date.now() });
  });

  socket.on('saveMessage', (data, callback) => {
    chatController.saveMessage(data);

    io.to(data.room_id).emit('newMessage', { msg: data.msg, msgFrom_id: data.msgFrom_id, msgFrom_name: data.msgFrom_name, date: Date.now() });
    callback({
      data: { msg: data.msg, msgFrom_id: data.msgFrom_id, msgFrom_name: data.msgFrom_name, date: Date.now() },
    });
    callback();
  });

  // 소켓 연결해제
  socket.on('disconnect', (msg) => {
    for (var cur_index in client_list) {
      if (client_list[cur_index].getSocketId() == socket.id) {
        delete client_list[cur_index];
        console.log(client_list);
      }
    }
  });
});

// 사용자 정보 재등록
function reRegistration(socket_id, id, userID) {
  if (id != null && client_list[id] != null) {
    delete client_list[id];
    client_list[id] = new client(socket_id, id, userID);
  }
}
