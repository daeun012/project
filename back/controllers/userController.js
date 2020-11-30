var userService = require('../services/userService');
var input = require('../services/inputService');
var jwtUtils = require('../services/jwtService');
const userModel = require('../models/userModel');

module.exports = {
  register: async (req, res, next) => {
    //Params
    var userID = req.body.userID;
    var pwd1 = req.body.pwd1;
    var pwd2 = req.body.pwd2;
    var name = req.body.name;
    var email = req.body.email;
    var studentid = req.body.studentid;
    var grade = req.body.grade;
    var dept = req.body.dept;

    //Check inputs
    var err;
    if ((err = input.password(pwd1).error)) return res.status(400).json({ error: 'password ' + err });
    if ((err = input.password(pwd2).error)) return res.status(400).json({ error: 'password ' + err });
    if ((err = input.name(name).error)) return res.status(400).json({ error: 'name ' + err });

    err = await input.userID(userID);
    if (err.error) return res.status(400).json({ error: 'userID ' + err.error });
    err = await input.email(email);
    if (err.error) return res.status(400).json({ error: 'email ' + err.error });
    err = await input.studentid(studentid);
    if (err.error) return res.status(400).json({ error: 'studentid ' + err.error });

    var created = await userModel.createOne([userID, pwd1, name, email, studentid, grade, dept]);

    if (created) {
      return res.status(201).json({ status: 'User created with success' });
    }
    return res.status(400).json({ status: 'An error has occurred' });
  },

  login: async (req, res, next) => {
    var user = await userService.getUser({
      userID: req.body.userID,
      pwd: req.body.pwd,
    });

    if (user.error) return res.status(401).json({ message: user.error });
    else {
      var id = user.userData[0]['id'];
      var userID = user.userData[0]['userID'];
      return res.status(200).json({
        message: 'Succesfully User Retrieved',
        userID: userID,
        token: jwtUtils.tokenGenerator([id, userID]),
      });
    }
  },

  getUserProfile: async (req, res, next) => {
    // Get user id from userID
    var id = await userService.getUseridFromID(req.params.userID);
    if (id.error) return res.status(401).json({ message: id.error });

    // Get data from db based on user access rights
    var userData = await userService.getUserData(id);

    if (userData.error) return res.status(401).json({ message: userData.error });

    return res.status(200).json({
      data: userData,
    });
  },

  updateUserField: async (req, res, next) => {
    var result = await userModel.updateOne(req.params.id, req.params.field, req.body.data);

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `${req.params.field} updated`,
      });
    }
  },

  updateUserData: async (req, res, next) => {
    var result = await userModel.updateData(req.params.id, req.body.data);

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`,
      });
    }
  },
};
