var pool = require('../config/database');
module.exports = {
  saveMessage: async (data) => {
    console.log(data);
    try {
      var result = await pool.query({
        sql: 'INSERT INTO messages (msg, msgFrom_id, msgFrom_name, room_id) VALUES (?,?,?,?)',
        values: [data.msg, data.msgFrom_id, data.msgFrom_name, data.room_id],
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },

  getMessages: async (user_id, room_id) => {
    try {
      var result = await pool.query({
        sql: 'SELECT * FROM messages WHERE room_id = ? and date > (SELECT date FROM messages WHERE msgFrom_name = ?) ORDER BY date',
        values: [room_id, '관리자_' + user_id],
      });

      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
};
