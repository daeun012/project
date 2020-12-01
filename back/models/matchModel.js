var pool = require('../config/database');

module.exports = {
  getMatch: async (room_id) => {
    try {
      var result = await pool.query({
        sql: 'SELECT * FROM matches WHERE room_id= ?',
        values: [room_id],
      });
      if (result.length) return result[0];
      else {
        return false;
      }
    } catch (err) {
      throw new Error(err);
    }
  },

  getRoomIdFromId: async (id) => {
    try {
      var result = await pool.query({
        sql: 'SELECT * FROM matches WHERE grade1 = ? or grade2 = ? or grade3 = ? or grade4 = ?',
        values: [id, id, id, id],
      });
      if (result.length) return result[0].room_id;
      else {
        return false;
      }
    } catch (err) {
      throw new Error(err);
    }
  },

  getUnMatchList: async (ugrade, udept) => {
    try {
      var result = await pool.query({
        sql: 'SELECT * FROM matches WHERE ' + `grade${ugrade}` + ' is null AND dept = ?',
        values: [udept],
      });
      if (result.length) return result;
      else return false;
    } catch (err) {
      throw new Error(err);
    }
  },

  createMatch: async (id, grade, dept) => {
    try {
      await pool.query({
        sql: 'INSERT INTO matches (?? ,dept) VALUES (?,?)',
        values: [`grade${grade}`, id, dept],
      });
    } catch (err) {
      throw new Error(err);
    }
  },

  updateMatch: async (id, room_id, grade) => {
    try {
      await pool.query({
        sql: 'UPDATE matches SET ?? = ? WHERE `room_id` = ?',
        values: [`grade${grade}`, id, room_id],
      });
    } catch (err) {
      throw new Error(err);
    }
  },

  updateNbMsg: async (room_id) => {
    try {
      var result = await pool.query({
        sql: 'UPDATE matches SET last_message = NOW() WHERE room_id = ?',
        values: [room_id],
      });
      //console.log(result);
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
};
