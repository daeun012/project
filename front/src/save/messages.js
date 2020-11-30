import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../styles/App.css';
import 'materialize-css/dist/css/materialize.min.css';
import AuthService from '../services/AuthService';
import Axios from 'axios';
import withAuth from './withAuth';
import ChatConv from './ChatConv';
import ChatRoom from './ChatRoom';
import NavBar from './NavBar';

const CancelToken = Axios.CancelToken;
// eslint-disable-next-line
let cancel;

class Messages2 extends Component {
  constructor(props) {
    super(props);
    this.Auth = new AuthService();
    this.state = {
      room_id: this.Auth.getConfirm()['room_id'],
      listMessages: [],
    };
    this._isMounted = false;
  }
  render() {
    return (
      <div className="App">
        <div className="row left align" style={{ minWidth: 100 + '%' }}>
          <div className="col s3" style={{ height: this.state.winSize }}>
            <ChatConv room_id={this.state.room_id} />
          </div>
          <div className="col s9">
            <ChatRoom room_id={this.state.room_id} listMessages={this.state.listMessages} />
          </div>
        </div>
      </div>
    );
  }

  async componentDidMount() {
    this._isMounted = true;

    await Axios.get('/chat/room/' + this.state.room_id, {
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
    })
      .then((res) => {
        const tab = [];
        for (var i = 0; i < res.data.result.length; i++)
          tab.push({
            id: i,
            value: res.data.result[i]['content'],
            user_id: res.data.result[i]['user_id'],
            date: res.data.result[i]['date'],
          });
        this._isMounted && this.setState({ listMessages: tab });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
}

const mapStateToProps = (state) => {
  return {
    userConnectedData: state.user.data,
    userConnectedStatus: state.user.status,
  };
};

export default withAuth(connect(mapStateToProps)(Messages2));
