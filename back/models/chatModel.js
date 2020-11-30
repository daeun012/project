var pool = require('../config/database');
module.exports = {
  saveMessage: async (data) => {
    console.log(data);
    try {
      var result = await pool.query({
        sql: 'INSERT INTO messages (msg, msgFrom, room_id) VALUES (?,?,?)',
        values: [data.msg, data.msgFrom, data.room_id],
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },

  getMessages: async (room_id) => {
    try {
      var result = await pool.query({
        sql: 'SELECT * FROM messages WHERE room_id = ?',
        values: room_id,
      });
      //console.log(result);
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
};
