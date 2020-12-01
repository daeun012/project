// client.js
// writer : peten486@gmail.com
// date : 2017.09.24

var client = function (socket_id, id, userID) {
  this.socket_id = socket_id;
  this.id = id;
  this.userID = userID;
};

client.prototype = {
  getNickName: function () {
    return this.userID;
  },
  getSocketId: function () {
    return this.socket_id;
  },
  getSerialNo: function () {
    return this.id;
  },
};

module.exports = client;
