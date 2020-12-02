import React, { Component } from 'react';
import '../styles/App.css';
import 'materialize-css/dist/css/materialize.min.css';
import AuthService from '../services/AuthService';

class Messages extends Component {
  constructor(props) {
    super(props);
    this.Auth = new AuthService();
    this.state = {
      winSize: '',
      id: this.Auth.getConfirm()['id'],
    };
  }

  render() {
    return (
      <div className="row main-chat-box">
        <h5 id="chat-title">{this.dept(this.props.dept)}</h5>
        <div id="chatbox-message" className="col s12 chatbox-message" style={{ height: this.state.winSize }}>
          <br />

          <br />
          <div>{this.props.messages.length > 0 && <this.msgList value={this.props.messages} />}</div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.setState({ winSize: window.innerHeight - 200 });
  }

  handleResizeWindow = () => {
    this.setState({ winSize: window.innerHeight - 200 });
  };

  dept = (props) => {
    switch (props) {
      case 1:
        return '전자정보통신공학과';
      case 2:
        return '정보보안학과';
      case 3:
        return '컴퓨터공학과';
      case 4:
        return '환경공학과';
    }
  };

  msgList = (props) => {
    // console.log(this.state.userID);
    const value = props.value;
    console.log(value);
    const listItems = value.map((e) =>
      // eslint-disable-next-line

      e.msgFrom_id === 999 ? (
        <div key={e.id}>
          <span id={'id-msg' + e.id} className="valign-wrapper center-align">
            {e.msg}
          </span>{' '}
          <br />
        </div>
      ) : (
        <div
          className={
            // eslint-disable-next-line
            this.state.id == e.msgFrom_id ? 'row right-align' : 'row left-align'
          }
          key={e.id}
        >
          <div
            className={
              // eslint-disable-next-line
              this.state.id == e.msgFrom_id ? 'col s12 m8 l6 right' : 'col s12 m8 l6 left'
            }
          >
            <div className="row valign-wrapper">
              <div>{e.msgFrom_name}</div>
              <div
                className={
                  // eslint-disable-next-line
                  this.state.id == e.msgFrom_id ? 'chat-field2 grey' : 'chat-field red'
                }
              >
                <span id={'id-msg' + e.id} className="chat-message white-text">
                  {e.msg}
                </span>
                <div
                  id={'id-msg' + e.id}
                  className={
                    // eslint-disable-next-line
                    this.state.id == e.msgFrom_id ? 'example2' : 'example'
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )
    );
    return <div className="col s12 m12 l9">{listItems}</div>;
  };
}

export default Messages;
