// 액션 객체를 받으면 전달받은 액션의 타입에 따라 어떻게 상태를 업데이트 해야 할지 정의
// 리듀서 : 업데이트 로직을 정의하는 함수
// 리듀서 함수는 두가지의 파라미터를 받는다. state(현재 상태), action(액션 객체)
// 이 두가지 파라미터를 참조해, 새로운 상태 객체를 만들어서 이를 반환한다.

import { combineReducers } from 'redux';
import userReducer from './user-reducer';

// 리듀서가 여러개 있어서 combineReducers를 사용해 하나의 리듀서로 합쳐준다.
const rootReducer = combineReducers({
    user: userReducer,
});

export default rootReducer;
