var room_info = function (grade, user_id, name) {
  this.grade = grade; //
  this.user_id = user_id;
  this.name = name;
};

room_info.prototype = {
  getUser: function () {
    return this.user;
  },
  getPartner: function () {
    return this.partner;
  },
  getRoomName: function () {
    return this.roomName;
  },
  setPartner: function (partner) {
    this.partner = partner;
  },
  getMatching: function () {
    return this.match;
  },
  Matching: function () {
    if (this.match == true) {
      this.match = false;
    } else {
      this.match = true;
    }
  },
};

module.exports = room_info;
