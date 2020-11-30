function matchingRandom(socket, user_id, grade, dept) {
  // 실행되면 RMI 명령 전송
  socket.emit('RMI', JSON.stringify(json.getJsonData(2)));

  // 방이 있는지 확인
  // 방이 존재 하면 매칭
  // 없으면 새로 방을 생성
  // 매칭 되면 RSM 명령 전송
  var result = getUnMatchingRoom(dept, grade); // room_id 값 받아옴
  if (Array.isArray(result) == true) {
    console.log('매칭 완료');
    room_u_list[result[0]]['grade' + grade] = user_id;

    socket.join(result[0]);
    console.log(room_u_list);

    // 매칭 완료된 그룹 DB에 저장
    chatController.createChatRoom(room_u_list[result[0]]);

    delete room_u_list[result[0]];
    console.log('삭제', room_u_list);
    socket.emit('RMG', JSON.stringify(json.getJsonData(3)));
  } else if (result) {
    console.log('1명 또는 2명 있음');
    room_u_list[result]['grade' + grade] = user_id;
    console.log(room_u_list);
    socket.join(result);
    socket.emit('RMG', JSON.stringify(json.getJsonData(3)));
  } else {
    console.log('방 생성');
    var uniqid = (new Date().getTime() + Math.floor(Math.random() * 10000 + 1)).toString(16);
    room_u_list[uniqid] = new room_info();

    room_u_list[uniqid].room_id = uniqid;
    room_u_list[uniqid]['grade' + grade] = user_id;
    room_u_list[uniqid].dept = dept;

    socket.join(uniqid);
    userModel.updateOne(user_id, 'room_id', uniqid);

    socket.emit('RSM', { room_id: uniqid });
    // io.to(uniqid).emit('update',);
  }
}

// 랜덤 매칭 방 확인
function getUnMatchingRoom(ugrade, udept) {
  const list1 = []; // 1명
  const list2 = []; // 2명
  const list3 = []; // 3명

  for (var cur_index in room_u_list) {
    if (room_u_list[cur_index].dept == udept) {
      if (!room_u_list[cur_index]['grade' + ugrade]) {
        var cnt = 0;
        for (var i = 1; i < 5; i++) {
          if (room_u_list[cur_index]['grade' + i]) {
            cnt += 1;
          }
        }
        switch (cnt) {
          case 1:
            list1.push(cur_index);
            break;
          case 2:
            list2.push(cur_index);
            break;
          case 3:
            list3.push(cur_index);
            break;
        }
      }
    }
  }

  console.log(list1, list2, list3);

  if (list1.length) {
    return list1[Math.floor(Math.random() * list1.length)];
  } else if (list2.length) {
    return list2[Math.floor(Math.random() * list2.length)];
  } else if (list3.length) {
    return [list3[Math.floor(Math.random() * list3.length)], 3];
  }
}
