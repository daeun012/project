import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../styles/App.css';
import 'materialize-css/dist/css/materialize.min.css';
import io from 'socket.io-client';
import AuthService from '../services/AuthService';
import Axios from 'axios';

const CancelToken = Axios.CancelToken;
// eslint-disable-next-line
let cancel;

class ChatConv extends Component {
  constructor(props) {
    super(props);
    this.Auth = new AuthService();
    this.state = {
      winSize: '',
      user_id: this.Auth.getConfirm()['id'],
      status: 0,
      socket: '',
      matches: [],
      displayChatbox: this.displayChatbox.bind(this),
    };
    this._isMounted = false;
  }

  render() {
    return (
      <ul className="collection with-header chatBox">
        <li className="collection-header">
          <h5 style={{ textAlign: 'center' }} className="chat-conv-title-text">
            멤버
          </h5>
          <i className="material-icons prefix pink-icon chat-conv-title-icon">mail</i>
        </li>
        <this.contactList value={this.state.matches} />
      </ul>
    );
  }

  async componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.setState({ winSize: window.innerHeight - 160 });
    await Axios.get('/chat/matches/' + this.props.room_id, {
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
    })
      .then((res) => {
        const tab = [];
        for (var i = 0; i < 4; i++)
          if (res.data['result'][0][`grade${i + 1}`] !== this.state.user_id) {
            tab.push({
              id: i,
              user_id: res.data['result'][0][`grade${i + 1}`],
              user_grade: i + 1,
              room_id: res.data['result'][0]['room_id'],
              status: '',
            });
          }

        i = 0;

        while (i < res.data['status'].length) {
          var k = 0;
          while (k < tab.length) {
            if (tab[k]['user_id'] === res.data['status'][i]['id']) {
              tab[k]['status'] = res.data['status'][i]['online'] === 1 ? '온라인' : '오프라인';
            }
            k++;
          }
          i++;
        }

        i = 0;

        this._isMounted && this.setState({ matches: tab });
      })
      .catch((err) => {
        //console.log(err);
      });

    (await this._isMounted) &&
      this.setState({
        socket: io({
          transports: ['polling'],
          requestTimeout: 50000,
          upgrade: false,
          'sync disconnect on unload': true,
          query: {
            user_id: this.state.user_id,
            matches: this.state.matches,
          },
        }),
      });

    if (this.state.socket) {
      this.state.socket.on('online', (data) => {
        var tab = this.state.matches;
        for (var i = 0; i < tab.length; i++) {
          //eslint-disable-next-line
          if (tab[i]['user_id'] == data['user_id']) tab[i]['status'] = 'Online';
        }
        this._isMounted && this.setState({ matches: tab });
      });

      this.state.socket.on('offline', (data) => {
        var tab = this.state.matches;
        for (var i = 0; i < tab.length; i++) {
          // eslint-disable-next-line
          if (tab[i]['user_id'] == data['user_id']) tab[i]['status'] = 'Offline';
        }
        this._isMounted && this.setState({ matches: tab });
      });
    }
  }

  contactList = (props) => {
    const value = props.value;
    const contacts = value.map((e) => (
      <li className="collection-item avatar clickable" key={e.id} id={'contactList-' + e.room_id} onClick={() => this.displayChatbox(e.room_id, e.username, e.userID)}>
        <span className="title truncate chat-user-title">{e.user_grade}학년</span>
        <p className="chat-user-status">{e.status}</p>
        <a href="#!" className="secondary-content">
          <span id={e.status === 'Online' ? 'green-circle' : 'grey-circle'} aria-label="Active Now" />
        </a>
      </li>
    ));
    return <ul style={{ height: this.state.winSize, overflow: 'auto' }}>{contacts}</ul>;
  };

  componentWillUnmount() {
    if (this.state.socket !== '') this.state.socket.close();
    this._isMounted = false;
  }

  displayChatbox = (roomId, username, userID) => {
    this.props.roomToParent(roomId, username, userID);
    document.getElementById('contactList-' + roomId).removeAttribute('style');
  };
}

const mapStateToProps = (state) => {
  return {
    userConnectedData: state.user.data,
    userConnectedStatus: state.user.status,
  };
};

export default connect(mapStateToProps)(ChatConv);
