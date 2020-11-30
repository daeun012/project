import React, { Component } from 'react';
import '../styles/App.css';
import 'materialize-css/dist/css/materialize.min.css';
import Axios from 'axios';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import NavBar from '../components/NavBar';
import AuthService from '../services/AuthService';
import ErrorToast from '../services/ErrorToastService';
import * as actionCreators from '../actions/user-actions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      pwd: '',
    };
    this.Auth = new AuthService();
    this._isMounted = false;
  }

  render() {
    return (
      <div className="App">
        <NavBar />
        <div className="row login-register-page">
          <div className="col a12 m6" id="login-box">
            <div className="card-panel center">
              <i className="medium material-icons">account_box</i>
              <div className="card-panel">
                <form onSubmit={this.handleSubmit}>
                  <div className="input-field">
                    <i className="material-icons prefix input-icons">person_outline</i>
                    <label htmlFor="id-login">아이디</label>
                    <input type="text" name="userID" id="id-login" autoComplete="userID" value={this.state.userID} onChange={this.handleChange} required />
                  </div>
                  <div className="input-field">
                    <i className="material-icons prefix input-icons">lock_outline</i>
                    <label htmlFor="pwd-login">비밀번호</label>
                    <input type="password" name="pwd" id="pwd-login" autoComplete="current-password" value={this.state.pwd} onChange={this.handleChange} required />
                  </div>
                  <input type="submit" name="submit" value="로그인" className="btn" />
                </form>
                <p className="register-login-link link-left">
                  <NavLink className="pink-link" to="/users/forgot-password">
                    비밀번호를 잊으셨나요?
                  </NavLink>
                </p>
                <p className="register-login-link link-right">
                  <NavLink className="pink-link" to="/users/register">
                    회원가입하기
                  </NavLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect user if already logged in
  componentDidMount() {
    this._isMounted = true;
    if (this.Auth.loggedIn()) {
      ErrorToast.auth.userAlreadyLogged();
      this.props.history.replace('/');
    }
  }

  // On user input change, update states
  handleChange = (e) => {
    const isID = e.target.name === 'userID';
    const isPwd = e.target.name === 'pwd';

    if (isID) {
      this._isMounted && this.setState({ userID: e.target.value });
    }

    if (isPwd) {
      this._isMounted && this.setState({ pwd: e.target.value });
    }
  };

  // On user button submit, execute this
  handleSubmit = async (e) => {
    e.preventDefault();
    Axios.post('/users/login', {
      userID: this.state.userID,
      pwd: this.state.pwd,
    })
      .then((res) => {
        localStorage.setItem('Token', res.data['token']);
        this.props.getUserData(res.data['userID']);
        this.props.history.push('/');
      })
      .catch((err) => {
        ErrorToast.custom.error(err.response['data']['message'], 1400);
      });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }
}

// mapStateToProps : connect함수에 첫번째 인수로 들어가는 함수 혹은 객체, state가 업데이트 될때 마다 자동적으로 호출
const mapStateToProps = (state) => {
  return {
    userConnectedData: state.user.data,
    userConnectedStatus: state.user.status,
  };
};

// connect() : Provider 컴포넌트 하위에 존재하는 컴포넌트들이 Store에 접근하게 만드는 역할
export default connect(mapStateToProps, actionCreators)(Login);
