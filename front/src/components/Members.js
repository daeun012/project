import React, { Component } from 'react';
import '../styles/App.css';
import 'materialize-css/dist/css/materialize.min.css';
import Avatar from '@material-ui/core/Avatar';

class Members extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
        <ul style={{ height: this.state.winSize, overflow: 'auto' }}>
          {this.props.members
            ? this.props.members.map((e) => (
                <li className="collection-item avatar clickable">
                  <Avatar className="chat-user-letters">{e.grade}</Avatar>
                  <span className="title truncate chat-user-title">{e.grade}학년</span>
                  <span className="title truncate chat-user-title">{e.name}</span>
                  <p className="chat-user-status">Online</p>
                  <a href="#!" className="secondary-content">
                    <span id={e.status === 'Online' ? 'green-circle' : 'grey-circle'} aria-label="Active Now" />
                  </a>
                </li>
              ))
            : 'nomember'}
        </ul>
      </ul>
    );
  }
}

export default Members;
