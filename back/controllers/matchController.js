var matchModel = require('../models/matchModel');
const userModel = require('../models/userModel');

module.exports = {
  matchingRandom: async (id, grade, dept) => {
    var unMatchList = await matchModel.getUnMatchList(grade, dept);

    console.log(unMatchList);
    if (unMatchList) {
      const list1 = []; // 1명
      const list2 = []; // 2명
      const list3 = []; // 3명
      for (var value of unMatchList) {
        var cnt = 0;
        for (var i = 1; i < 5; i++) {
          if (value['grade' + i]) {
            cnt += 1;
          }
        }
        switch (cnt) {
          case 1:
            list1.push(value);
            break;
          case 2:
            list2.push(value);
            break;
          case 3:
            list3.push(value);
            break;
        }
      }

      console.log('list1', list1, 'list2', list2, 'list3', list3);

      if (list1.length) {
        console.log('업데이트');
        var room_id = list1[Math.floor(Math.random() * list1.length)].room_id;
        await matchModel.updateMatch(id, room_id, grade);
        return room_id;
      } else if (list2.length) {
        console.log('업데이트');
        var room_id = list2[Math.floor(Math.random() * list2.length)].room_id;
        await matchModel.updateMatch(id, room_id, grade);
        return room_id;
      } else if (list3.length) {
        console.log('업데이트');
        var room_id = list3[Math.floor(Math.random() * list3.length)].room_id;
        await matchModel.updateMatch(id, room_id, grade);
        return room_id;
      }
    } else {
      console.log('방생성');
      await matchModel.createMatch(id, grade, dept);
      var result = await matchModel.getRoomIdFromId(id);
      var room_id = result;

      console.log(room_id);
      return room_id;
    }
  },

  getMembers: async (room_id) => {
    var match = await matchModel.getMatch(room_id);

    var result = await userModel.getMemberInfo(match['grade1'], match['grade2'], match['grade3'], match['grade4']);

    let members = [{ grade: 1 }, { grade: 2 }, { grade: 3 }, { grade: 4 }];

    for (var i = 0; i < members.length; i++) {
      for (var j = 0; j < result.length; j++) {
        if (result[j].grade === i + 1) {
          members[i] = result[j];
        }
      }
    }

    return members;
  },
};
