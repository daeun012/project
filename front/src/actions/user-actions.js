// 무엇이 일어날지를 나타내는 액션
// store.dispatch()를 통해 보낼 수 있다.

import axios from 'axios';
import ApiCall from '../services/ApiCall';
import ErrorToast from '../services/ErrorToastService';
import InfoToast from '../services/InfoToastService';

// Action의 종류 선언
export const GET_USER = 'GET_USER';
export const USER_RECEIVED = 'USER_RECEIVED';
export const UPDATE_USER = 'UPDATE_USER';
export const USER_UPDATED = 'USER_UPDATED';
export const DELETE_USER = 'DELETE_USER';
export const USER_DELETED = 'USER_DELETED';
export const ERROR = 'ERROR';

const apiUrl = '/users';

export const getUserData = (userID) => {
  return (dispatch) => {
    dispatch({ type: 'GET_USER' });
    axios
      .get(`${apiUrl}/profile/${userID}`)
      .then((response) => {
        dispatch({ type: 'USER_RECEIVED', payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: 'ERROR', payload: error });
      });
    dispatch({ type: 'AFTER_ASYNC' });
  };
};

export const updateUserField = (id, userID, field, data) => {
  return (dispatch) => {
    dispatch({ type: 'UPDATE_USER' });
    ApiCall.user
      .updateUserField(id, field, data)
      .then((response) => {
        dispatch({ type: 'USER_UPDATED', payload: data });
        axios
          .get(`${apiUrl}/profile/${userID}`)
          .then((response) => {
            InfoToast.custom.info('Updated', 1400);
            dispatch({ type: 'USER_RECEIVED', payload: response.data });
          })
          .catch((error) => {
            dispatch({
              type: 'ERROR',
              payload: error,
            });
          });
      })
      .catch((error) => {
        ErrorToast.custom.error(error.response['data']['error'], 1400);
        dispatch({ type: 'ERROR', payload: error });
      });
    dispatch({ type: 'AFTER_ASYNC' });
  };
};
