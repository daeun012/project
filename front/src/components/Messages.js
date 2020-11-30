import React, { Component } from 'react';
import '../styles/App.css';
import 'materialize-css/dist/css/materialize.min.css';
import AuthService from '../services/AuthService';

class Messages extends Component {
  constructor(props) {
    super(props);
    this.Auth = new AuthService();
    this.state = {
      id: this.Auth.getConfirm()['id'],
    };
  }

  render() {
    return (
      <div className="row main-chat-box">
        <div id="chatbox-message" className="col s12 chatbox-message" style={{ height: this.state.winSize }}>
          <br />
          <span className="valign-wrapper center-align">Say hi to your new match.</span>
          <br />
          <div>{this.props.messages.length > 0 && <this.msgList value={this.props.messages} />}</div>
        </div>
      </div>
    );
  }

  msgList = (props) => {
    // console.log(this.state.userID);
    const value = props.value;
    const listItems = value.map((e) => (
      // eslint-disable-next-line
      <div
        className={
          // eslint-disable-next-line
          this.state.id == e.msgFrom ? 'row right-align' : 'row left-align'
        }
        key={e.id}
      >
        <div
          className={
            // eslint-disable-next-line
            this.state.id == e.msgFrom ? 'col s12 m8 l6 right' : 'col s12 m8 l6 left'
          }
        >
          <div className="row valign-wrapper">
            <div
              className={
                // eslint-disable-next-line
                this.state.id == e.msgFrom ? 'chat-field2 grey' : 'chat-field red'
              }
            >
              <span id={'id-msg' + e.id} className="chat-message white-text">
                {e.msg}
              </span>
              <div
                id={'id-msg' + e.id}
                className={
                  // eslint-disable-next-line
                  this.state.id == e.msgFrom ? 'example2' : 'example'
                }
              />
            </div>
          </div>
        </div>
      </div>
    ));
    return <div className="col s12 m12 l9">{listItems}</div>;
  };
}

export default Messages;
