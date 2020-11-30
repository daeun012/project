var userModel = require('../models/userModel');
var passwordHash = require('password-hash');

module.exports = {
  getUser: async (data) => {
    var userID = data.userID;
    var pwd = data.pwd;

    var result = await userModel.findOne('userID', userID);

    if (result != '') {
      var hashed = result[0]['password'];
      if (result[0]['auth'] == 1) return { error: 'Inactive account' };
      if (passwordHash.verify(pwd, hashed)) return { message: 'Succesfully User Retrieved', userData: result };
      else return { error: 'Incorrect login/password' };
    } else return { error: 'Incorrect login/password' };
  },

  getUserData: async (id) => {
    try {
      var result = await userModel.findOne('id', id);
      return result[0];
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  getUseridFromID: async (userID) => {
    try {
      var result = await userModel.findOne('userID', userID);
      if (result != '') return result[0].id;
      else return { error: 'User not found' };
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },
};
