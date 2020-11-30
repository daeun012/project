// 스토어 만드는 함수 만들기

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // 비동기 작업을 처리 할 때 사용하는 모듈, 객체 대신 함수를 생성하는 액션 생성함수를 작성할 수 있게 해줌
import rootReducer from './reducers/index';
import { composeWithDevTools } from 'redux-devtools-extension';

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(thunk)));
    return store;
}
