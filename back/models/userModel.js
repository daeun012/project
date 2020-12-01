var pool = require('../config/database');
var passwordHash = require('password-hash');

module.exports = {
  findOne: async (field, data) => {
    try {
      var result = await pool.query({
        sql: 'SELECT * FROM ?? WHERE ?? = ?',
        values: ['users', field, data],
      });
      if (result) return result;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },

  createOne: async (data) => {
    console.log(data);
    data[1] = passwordHash.generate(data[1], {
      algorithm: 'sha512',
      saltLength: 10,
      iterations: 5,
    });
    try {
      var result = await pool.query({
        sql: 'INSERT INTO users (userID, password, name, email, student_id, grade, dept) VALUES (?)',
        values: [data],
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },

  updateOne: async (id, field, data) => {
    try {
      var result = await pool.query({
        sql: 'UPDATE users SET ?? = ? WHERE `id` = ?',
        values: [field, data, id],
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },

  getMemberInfo: async (grade1, grade2, grade3, grade4) => {
    try {
      var result = await pool.query({
        sql: 'SELECT grade,id,name FROM users WHERE id IN(?,?,?,?)',
        values: [grade1, grade2, grade3, grade4],
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
};
