import React, { Component } from 'react';
import '../styles/App.css';
import 'materialize-css/dist/css/materialize.min.css';
import io from 'socket.io-client';
import AuthService from '../services/AuthService';

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.Auth = new AuthService();
    this.state = {
      winSize: '',
      msg: '',
      toSend: '',
      listMessages: [],
      socket: '',
      user_id: '',
      userName: '',
      userToken: this.Auth.getToken(),
      room_id: '',
    };
    this._isMounted = false;
  }

  render() {
    return (
      <div>
        <div className="row main-chat-box">
          <div id="chatbox-message" className="col s12 chatbox-message" style={{ height: this.state.winSize }}>
            <br />
            <span className="valign-wrapper center-align">Say hi to your new match.</span>
            <br />
            <div>{this.state.listMessages.length > 0 && <this.msgList value={this.state.listMessages} />}</div>
          </div>
        </div>
        <form className="fixed-bottom-imput" onSubmit={this.handleSubmit}>
          <div className="col s9 chat-message-box">
            <label htmlFor="msgToSend">Write your message</label>
            <input type="text" id="msgToSend" name="msgToSend" autoComplete="off" value={this.state.toSend} onChange={this.handleChange} required autoFocus />
          </div>
          <div id="btn-chat-box" className="col s3 btn-chat-box">
            <button type="submit" name="submit" value="Send" className="btn">
              <i className="material-icons">send</i>
            </button>
          </div>
        </form>
      </div>
    );
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.setState({ winSize: window.innerHeight - 200 });
  }

  componentDidUpdate() {
    this._isMounted = true;
    if (this.state.listMessages !== this.props.listMessages) this.initializeComponent();
  }

  initializeComponent = async () => {
    if (this.state.socket) this.state.socket.close();
    this._isMounted &&
      (await this.setState({
        listMessages: this.props.listMessages,
        room_id: this.props.room_id,
      }));

    this._isMounted &&
      (await this.setState({
        user_id: this.Auth.getIdViaToken(this.state.userToken),
        userID: this.Auth.getUserIDViaToken(this.state.userToken),
      }));

    this._isMounted &&
      (await this.setState({
        socket: io('/chat', {
          transports: ['polling'],
          requestTimeout: 50000,
          upgrade: false,
          'sync disconnect on unload': true,
          query: {
            token: this.state.userToken,
            user_id: this.state.user_id,
            userID: this.state.userID,
            room_id: this.state.room_id,
          },
        }),
      }));

    this.state.socket.on(this.state.room_id, (data) => {
      //console.log(data);
      var tab = this.state.listMessages;
      tab.push({
        id: this.state.listMessages.length + 1,
        value: data['data'],
        user_id: data['user_id'],
        date: '',
      });
      this._isMounted && this.setState({ listMessages: tab });
      //console.log(tab);

      this.goToElement(tab.length);
    });
    //console.log(this.state.listMessages);
    if (this.state.listMessages.length < 1) return;
    this.goToElement(this.state.listMessages.length - 1);
  };

  handleResizeWindow = () => {
    this.setState({ winSize: window.innerHeight - 200 });
  };

  goToElement = (nb) => {
    //console.log(nb);
    document.getElementById('id-msg' + nb).scrollIntoView({ block: 'start' });
  };

  msgList = (props) => {
    // console.log(this.state.userID);
    const value = props.value;
    const listItems = value.map((e) => (
      // eslint-disable-next-line
      <div
        className={
          // eslint-disable-next-line
          this.state.user_id == e.user_id ? 'row right-align' : 'row left-align'
        }
        key={e.id}
      >
        <div
          className={
            // eslint-disable-next-line
            this.state.user_id == e.user_id ? 'col s12 m8 l6 right' : 'col s12 m8 l6 left'
          }
        >
          <div className="row valign-wrapper">
            <div> {e.user_id}</div>
            <div
              className={
                // eslint-disable-next-line
                this.state.user_id == e.user_id ? 'chat-field2 grey' : 'chat-field red'
              }
            >
              <span id={'id-msg' + e.id} className="chat-message white-text">
                {e.value}
              </span>
              <div
                id={'id-msg' + e.id}
                className={
                  // eslint-disable-next-line
                  this.state.userID == e.userID ? 'example2' : 'example'
                }
              />
            </div>
          </div>
        </div>
      </div>
    ));
    return <div className="col s12 m12 l9">{listItems}</div>;
  };

  handleChange = (e) => {
    this.setState({ toSend: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this._isMounted && (await this.setState({ toSend: this.state.toSend.trim() }));
    if (this.state.toSend !== '') {
      var tab = this.state.listMessages;
      tab.push({
        id: this.state.listMessages.length + 1,
        value: this.state.toSend,
        user_id: this.state.user_id,
        date: '',
      });

      //console.log(this.state.room_id);
      this._isMounted && (await this.setState({ listMessages: tab }));
      this.goToElement(tab.length);
      this.state.socket.emit(this.state.room_id, this.state.toSend);
    }
    this._isMounted && this.setState({ toSend: '' });
  };

  componentWillUnmount() {
    this._isMounted = false;
    if (this.state.socket) this.state.socket.close();
  }
}

export default ChatRoom;
