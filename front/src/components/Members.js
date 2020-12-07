import React, { Component } from 'react';
import '../styles/App.css';
import 'materialize-css/dist/css/materialize.min.css';
import Avatar from '@material-ui/core/Avatar';
import AuthService from '../services/AuthService';

class Members extends Component {
  constructor(props) {
    super(props);
    this.Auth = new AuthService();
    this.state = {
      id: this.Auth.getConfirm()['id'],
      winSize: '',
    };
  }

  render() {
    return (
      <ul className="collection with-header chatBox">
        <li className="collection-header">
          <h5 style={{ textAlign: 'center' }} className="chat-conv-title-text">
            멤버
          </h5>
          <i className="material-icons prefix pink-icon chat-conv-title-icon">people</i>
        </li>
        <ul style={{ height: this.state.winSize, overflow: 'auto' }}>
          {this.props.members
            ? this.props.members.map((e) => (
                <li className="collection-item avatar clickable" key={e.grade}>
                  <Avatar className="chat-user-letters">{this.state.id === e.id ? '나' : e.grade}</Avatar>
                  <span className="title truncate chat-user-title">{e.grade}학년</span>
                  <span className="chat-user-name">{e.name}</span>
                  <a href="#!" className="secondary-content">
                    <span id={e.name ? 'green-circle' : 'grey-circle'} aria-label="Active Now" />
                  </a>
                </li>
              ))
            : 'member n exist'}
        </ul>
      </ul>
    );
  }
  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.setState({ winSize: window.innerHeight - 160 });
  }
}

export default Members;
