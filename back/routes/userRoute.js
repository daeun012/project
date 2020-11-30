var express = require('express');
var userController = require('../controllers/userController');

exports.router = (() => {
  var userRouter = express.Router();

  userRouter.route('/register').post(userController.register); // 회원가입
  userRouter.route('/login').post(userController.login); // 로그인

  userRouter.route('/profile/:userID').get(userController.getUserProfile); // 사용자 프로필(정보) 가져오기
  userRouter.route('/update/:id/custom/:field').post(userController.updateUserField); // 사용자 프로필(정보) 업데이트하기

  return userRouter;
})();
