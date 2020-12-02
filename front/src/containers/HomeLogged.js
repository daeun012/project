import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthService from '../services/AuthService';
import io from 'socket.io-client';
import Members from '../components/Members';
import Messages from '../components/Messages';
import moment from 'moment';
import * as actionCreators from '../actions/user-actions';
var socket;
class HomeLogged extends Component {
  constructor(props) {
    super(props);
    this.Auth = new AuthService();
    this.state = {
      id: this.Auth.getConfirm()['id'],
      userID: this.Auth.getConfirm()['userID'],
      newMsg: '',
      member: [],
      messages: [],
    };
    this._isMounted = false;
  }

  render() {
    console.log(this._isMounted);
    return (
      <div className="App">
        {this.state.id !== undefined && this.props.userData.room_id === null ? (
          <div className="row">
            <div className="matching-btn" onClick={this.handleMatch}>
              매칭하기
            </div>
          </div>
        ) : (
          <div className="row left align" style={{ minWidth: 100 + '%' }}>
            <div className="col s3" style={{ height: this.state.winSize }}>
              <Members members={this.state.member} />
            </div>
            <div className="col s9">
              <Messages messages={this.state.messages} />
              <form className="fixed-bottom-imput" onSubmit={this.handleSubmit}>
                <div className="col s9 chat-message-box">
                  <label htmlFor="msgToSend">Write your message</label>
                  <input type="text" id="msgToSend" name="msgToSend" autoComplete="off" value={this.state.newMsg} onChange={this.handleChange} required autoFocus />
                </div>
                <div id="btn-chat-box" className="col s3 btn-chat-box">
                  <button type="submit" name="submit" value="Send" className="btn">
                    <i className="material-icons">send</i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    socket = io('http://localhost:5000');
    this._isMounted = true;
    console.log(this._isMounted);
    this._isMounted && socket.emit('STA', { id: this.state.id, userID: this.state.userID });

    socket.on('updateMember', (member) => {
      console.log(member);
      this.setState({
        member: member,
      });
    });

    socket.on('updateChat', (tab) => {
      console.log('updateChat');
      this.setState({
        messages: tab,
      });
      if (tab.length <= 1) return;
      this.goToElement(tab.length);
    });

    socket.on('newMessage', (message) => {
      var formattedTime = moment(message.date).format('h:mm');
      let newMsg = {
        id: this.state.messages.length + 1,
        msg: message.msg,
        msgFrom_id: message.msgFrom_id,
        msgFrom_name: message.msgFrom_name,
        date: formattedTime,
      };
      console.log(newMsg);
      let tab = this.state.messages;
      tab.push(newMsg);
      this.setState({
        messages: tab,
      });
      console.log(tab.length);
      if (tab.length <= 1) return;
      this.goToElement(tab.length);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    socket.close();
  }

  /* 
  componentDidUpdate(prevProps, prevState) {
    console.log('componentdidupdate');
    this._isMounted = true;
  }
 */

  handleMatch = () => {
    socket.emit('RMStart', { id: this.state.id, grade: this.props.userData.grade, dept: this.props.userData.dept, name: this.props.userData.name });

    socket.on('setRoomId', (room_id) => {
      this.props.updateUserField(this.props.userData.id, this.props.userData.userID, 'room_id', room_id);
    });
  };

  goToElement = (nb) => {
    console.log(nb);
    document.getElementById('id-msg' + nb).scrollIntoView({ block: 'start' });
  };

  handleChange = (e) => {
    this.setState({ newMsg: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.newMsg !== '') {
      socket.emit('saveMessage', { room_id: this.props.userData.room_id, msg: this.state.newMsg, msgFrom_id: this.state.id, msgFrom_name: this.props.userData.name }, function (data) {});
    }
    this._isMounted && this.setState({ newMsg: '' });
  };
}

const mapStateToProps = (state) => {
  return {
    userData: state.user.data,
    userConnectedStatus: state.user.status,
  };
};

export default connect(mapStateToProps, actionCreators)(HomeLogged);
