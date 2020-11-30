import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthService from '../services/AuthService';
import io from 'socket.io-client';
import Members from '../components/Members';
import Messages from '../components/Messages';
import moment from 'moment';
import * as actionCreators from '../actions/user-actions';

const socket = io.connect('http://localhost:5000');

class HomeLogged extends Component {
  constructor(props) {
    super(props);
    this.Auth = new AuthService();
    this.state = {
      id: this.Auth.getConfirm()['id'],
      userID: this.Auth.getConfirm()['userID'],
      room_id: '',
      newMsg: '',
      member: [],
      messages: [],
    };
    this._isMounted = false;
  }

  render() {
    console.log('render');
    console.log(this.state.messages);
    return (
      <div className="App">
        {this.state.id !== undefined && this.state.room_id === '' ? (
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
    console.log('componentdidmount');
    this._isMounted = true;
    this._isMounted && socket.emit('STA', { id: this.state.id, userID: this.state.userID });

    socket.on('setRoomId', (room_id) => {
      this.setState({
        room_id: room_id,
      });
    });

    socket.on('updateMember', (member) => {
      console.log(member);
      this.setState({
        member: member,
      });
    });

    socket.on('newMessage', (message) => {
      console.log('neMessages');
      var formattedTime = moment(message.date).format('h:mm');

      let newMsg = {
        id: this.state.messages.length + 1,
        msg: message.msg,
        msgFrom: message.msgFrom,
        date: formattedTime,
      };
      console.log(newMsg);
      let tab = this.state.messages;
      console.log(tab);
      tab.push(newMsg);
      this.setState({
        messages: tab,
      });

      this.goToElement(tab.length);
    });

    socket.on('updateMessage', (tab) => {
      console.log(tab);
      this.setState({
        messages: tab,
      });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    socket.close();
  }

  /*   static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps.userConnectedData.room_id, prevState.room_id);
    if (nextProps.userConnectedData.room_id !== prevState.room_id) {
      return { room_id: nextProps.userConnectedData.room_id };
    }
  }
 */
  componentDidUpdate(prevProps, prevState) {
    console.log('componentdidupdate');
    this._isMounted = true;
  }

  handleMatch = () => {
    socket.emit('RMStart', { id: this.state.id, grade: this.props.userConnectedData.grade, dept: this.props.userConnectedData.dept, name: this.props.userConnectedData.name });
  };

  handleChange = (e) => {
    this.setState({ newMsg: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.newMsg !== '') {
      socket.emit('saveMessage', { room_id: this.state.room_id, msg: this.state.newMsg, msgFrom: this.state.id }, function (data) {});
    }
    this._isMounted && this.setState({ newMsg: '' });
  };

  goToElement = (nb) => {
    //console.log(nb);
    document.getElementById('id-msg' + nb).scrollIntoView({ block: 'start' });
  };
}
const mapStateToProps = (state) => {
  return {
    userConnectedData: state.user.data,
    userConnectedStatus: state.user.status,
  };
};

export default connect(mapStateToProps, actionCreators)(HomeLogged);
