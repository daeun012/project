import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthService from '../services/AuthService';
import io from 'socket.io-client';
import Messages from '../components/messages';
import HeartLoading from '../assets/heart-loading.gif';
import HeartBroken from '../assets/heart-broken.gif';
import * as actionCreators from '../actions/user-actions';

class HomeLogged extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      socket: '',
      isLoading: true,
      page: 12,
      winSize: '',
      isRead: null,
      msg: '',
      toSend: '',
      listMessages: [],
      socket: '',
      userID: '',
      userName: '',

      room_id: '',
      usernameOther: '',
      userID_other: '',
    };
    this.Auth = new AuthService();
    this._isMounted = false;
    this.infiniteScroll = this.infiniteScroll.bind(this);
  }

  render() {
    return (
      <div className="App">
        {this.props.userConnectedData.id !== undefined && this.props.userConnectedData.room_id == null ? (
          <div className="row">
            <div className="matching-btn" onClick={this.handleMatch}>
              매칭하기
            </div>
          </div>
        ) : (
          <Messages />

          // <div className="home-suggestions-list" disabled={true}>
          //   {!this.state.isLoading ? (
          //     <Messages />
          //   ) : (
          //     <div className="userlist-loading">
          //       <img className="userlist-loading-img" src={HeartLoading} alt="Loading anim" />
          //       <div className="userlist-loading-text">Loading...</div>
          //     </div>
          //   )}
          // </div>
        )}
      </div>
    );
  }

  async componentDidMount() {
    this._isMounted = true;
    (await this._isMounted) &&
      this.setState({
        user_id: this.Auth.getConfirm()['id'],
      });

    this._isMounted &&
      this.setState({
        socket: io({
          transports: ['polling'],
          requestTimeout: 50000,
          upgrade: false,
          'sync disconnect on unload': true,
          query: {
            user_id: this.state.user_id,
          },
        }),
      });
    window.addEventListener('scroll', this.infiniteScroll);
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('scroll', this.infiniteScroll);
    if (this.state.socket !== '') this.state.socket.close();
  }

  infiniteScroll = () => {
    if (window.pageYOffset >= document.documentElement.offsetHeight - document.documentElement.clientHeight - 420)
      this._isMounted &&
        this.setState({
          page: this.state.page + 12,
        });
  };

  handleMatch = () => {
    if (this.state.socket !== '') {
      this.state.socket.emit('startMatch', this.state.user_id);
    }

    this.state.socket.on('room_id', (data) => this.props.updateUserField(this.props.userConnectedData.id, this.props.userConnectedData.userID, 'room_id', data));

    this.setState({
      isLoading: false,
    });
  };
}

const mapStateToProps = (state) => {
  return {
    userConnectedData: state.user.data,
    userConnectedStatus: state.user.status,
  };
};

export default connect(mapStateToProps, actionCreators)(HomeLogged);
