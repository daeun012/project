const chatModel = require('../models/chatModel');
const userModel = require('../models/userModel');
const matchModel = require('../models/matchModel');

module.exports = {
  saveMessage: async (data) => {
    //console.log(data);
    await chatModel.saveMessage(data);
    await matchModel.updateNbMsg(data.room_id);
  },

  getMessages: async (req, res, next) => {
    console.log('hi');
    var room_id = req.params.room_id;
    // console.log('room id = ' + room_id);
    var result = await chatModel.getMessages(room_id);
    //console.log(result);
    return res.status(200).json({ result });
  },

  getMatchList: async (req, res, next) => {
    console.log(req.params.room_id);
    var room_id = req.params.room_id;
    var result = await matchModel.getMatchList(room_id);

    console.log(result);
    var status = [];
    for (var i = 0; i < 4; i++) {
      status[i] = result[0][`grade${i + 1}`];
    }
    if (status.length > 0) status = await userModel.getStatus(status);

    return res.status(200).json({ result, status });
  },

  onlineStatus: async (user_id) => {
    await userModel.saveStatus(1, user_id);
  },

  offlineStatus: async (user_id) => {
    await userModel.saveStatus(0, user_id);
  },

  readMessage: async (data, user_id) => {
    await chatModel.readNotification(2, data, userID);
  },

  saveNotification: async (user_id, sender_id, type, data, reference) => {
    await chatModel.saveNotification([user_id, sender_id, type, data, reference]);
  },

  getCountMsgNotification: async (req, res, next) => {
    var userID = req.params.userID;
    var blocked = await userModel.getBlockedUsersFromMyId(userID);
    var tab = [];
    for (var i = 0; i < blocked.length; i++) tab.push(blocked[i]['user_id']);
    var result = await chatModel.getCountNotification(userID, blocked.length > 0 ? tab : '');

    return res.status(200).json({ notification: result });
  },

  getListNotification: async (req, res, next) => {
    var userID = req.params.userID;
    var blocked = await userModel.getBlockedUsersFromMyId(userID);
    var tab = [];
    for (var i = 0; i < blocked.length; i++) tab.push(blocked[i]['user_id']);
    var result = await chatModel.getListNotification(userID, blocked.length > 0 ? tab : '');
    return res.status(200).json({ notification: result });
  },

  createChatRoom: async (user_id, user_grade, user_dept) => {
    var uniqid = (new Date().getTime() + Math.floor(Math.random() * 10000 + 1)).toString(16);
    await chatModel.createChatRoom2(uniqid, user_id, user_grade, user_dept);
    return uniqid;
  },

  createChatRoom: async (data) => {
    console.log(data);
  },
};
