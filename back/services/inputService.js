var userModel = require('../models/userModel');

module.exports = {
  userID: async (data) => {
    const regex = /^[a-zA-Z0-9]{5,20}$/;

    if (data == null || data == '') return { error: 'missing parameter' };
    if (/\s/.test(data)) return { error: 'cannot contain spaces' };
    if (!data.match(regex)) return { error: 'is invalid' };
    if (data.length < 5 || data.length > 20) return { error: 'incorrect size' };

    //Check db for already existing id
    var result = await userModel.findOne('userID', data);
    if (result != '') return { error: 'already exists' };
    else return { status: 'valid' };
  },

  password: (data) => {
    if (data == null || data == '') return { error: 'missing parameter' };
    if (/\s/.test(data)) return { error: 'spaces are forbidden' };

    //Check pattern
    var pwdPattern = /^.*(?=.{8,16})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
    if (!pwdPattern.test(data)) return { error: "doesn't match pattern" };
    else return { status: 'valid' };
  },

  name: (data) => {
    const regex = /^[가-힣]{2,4}$/;

    if (data == null || data == '') return { error: 'missing parameter' };
    if (/\s/.test(data)) return { error: 'cannot contain spaces' };
    if (!data.match(regex)) return { error: 'is invalid' };
    if (data.length < 2 || data.length > 4) return { error: 'incorrect size' };
    else return { status: 'valid' };
  },

  email: async (data) => {
    if (data == null || data == '') return { error: 'missing parameter' };
    if (/\s/.test(data)) return { error: 'cannot contain spaces' };

    //Check pattern
    var mailPattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (!mailPattern.test(data)) return { error: "doesn't match pattern" };

    //Check db for already existing email
    var result = await userModel.findOne('email', data);
    if (result != '') return { error: 'already exists' };
    else return { status: 'valid' };
  },

  studentid: async (data) => {
    const regex = /^[0-9]{8}$/;

    if (data == null || data == '') return { error: 'missing parameter' };
    if (/\s/.test(data)) return { error: 'cannot contain spaces' };
    if (!data.match(regex)) return { error: 'is invalid' };
    if (!(data.length === 8)) return { error: 'incorrect size' };

    //Check db for already existing studentid
    var result = await userModel.findOne('student_id', data);
    if (result != '') return { error: 'already exists' };
    else return { status: 'valid' };
  },

  date: (data) => {
    if (data) return { status: 'valid' };
    else return { error: 'is invalid' };
  },
};
