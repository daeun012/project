// client.js
// writer : peten486@gmail.com
// date : 2017.09.24

var client = function (socket_id, id, userID) {
  this.socket_id = socket_id;
  this.id = id;
  this.userID = userID;
};

client.prototype = {
  getSocketId: function () {
    return this.socket_id;
  },
  getId: function () {
    return this.id;
  },
  getUserID: function () {
    return this.userID;
  },
};

module.exports = client;
