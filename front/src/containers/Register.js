import React, { Component } from 'react';
import '../styles/App.css';
import NavBar from '../components/NavBar';
import { NavLink } from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import Axios from 'axios';
import ValidateInput from '../validation/ValidateInput';
import ErrorToast from '../services/ErrorToastService';
import InfoToast from '../services/InfoToastService';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      pwd1: '',
      pwd2: '',
      name: '',
      email: '',
      studentid: '',
      grade: '',
      dept: '',
      IDError: '',
      pwd1Error: '',
      pwd2Error: '',
      nameError: '',
      emailError: '',
      studentidError: '',
      gradeError: '',
      deptError: '',
      IDValid: false,
      pwd1Valid: false,
      nameValid: false,
      emailValid: false,
      studentidValid: false,
      responseToPost: '',
    };
    this._isMounted = false;
  }

  render() {
    return (
      <div className="App">
        <NavBar />
        <div className="row login-register-page">
          <div className="col a12 m6" id="login-box">
            <div className="card-panel center">
              <i className="medium material-icons">person_add</i>
              <div className="card-panel">
                <form onSubmit={this.handleSubmit}>
                  <div className="input-field col s12">
                    <i className="material-icons prefix input-icons">person_outline</i>
                    <input
                      type="text"
                      name="userID"
                      autoComplete="userID"
                      id="id-register"
                      value={this.state.userID}
                      onChange={(e) => this.setState({ userID: e.target.value })}
                      onKeyUp={this.handleIdKeyUp}
                      required
                    />
                    <div className="register-error">{this.state.IDError}</div>
                    <label htmlFor="id-register">아이디</label>
                  </div>
                  <div className="input-field col s12">
                    <i className="material-icons prefix input-icons">lock_outline</i>
                    <input
                      type="password"
                      name="pwd"
                      id="pwd-login"
                      autoComplete="new-password"
                      value={this.state.pwd1}
                      onChange={(e) => this.setState({ pwd1: e.target.value })}
                      onKeyUp={this.handlePwdKeyUp}
                      required
                    />
                    <div className="register-error">{this.state.pwd1Error}</div>
                    <label htmlFor="pwd-login">비밀번호</label>
                  </div>
                  <div className="input-field col s12">
                    <i className="material-icons prefix input-icons">lock</i>
                    <input
                      type="password"
                      name="rep-pwd"
                      id="rep-pwd-login"
                      autoComplete="new-password"
                      value={this.state.pwd2}
                      onChange={(e) => this.setState({ pwd2: e.target.value })}
                      onKeyUp={this.handleRepeatPwdKeyUp}
                      required
                    />
                    <div className="register-error">{this.state.pwd2Error}</div>
                    <label htmlFor="rep-pwd-login">비밀번호 재확인</label>
                  </div>
                  <div className="input-field col s12">
                    <i className="material-icons prefix input-icons">face</i>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      id="name-register"
                      value={this.state.name}
                      onChange={(e) => this.setState({ name: e.target.value })}
                      onKeyUp={this.handleNameKeyUp}
                      required
                    />
                    <div className="register-error">{this.state.nameError}</div>
                    <label htmlFor="name-register">이름</label>
                  </div>
                  <div className="input-field col s12">
                    <i className="material-icons prefix input-icons">mail_outline</i>
                    <input type="email" name="email" id="email-register" value={this.state.mail} onChange={(e) => this.setState({ email: e.target.value })} onKeyUp={this.handleEmailKeyUp} required />
                    <div className="register-error">{this.state.emailError}</div>
                    <label htmlFor="email-register">이메일</label>
                  </div>
                  <div className="input-field col s12">
                    <i className="material-icons prefix input-icons">picture_in_picture_alt</i>
                    <input
                      type="text"
                      name="studentid"
                      autoComplete="studentid"
                      id="studentid-register"
                      value={this.state.studentid}
                      onChange={(e) => this.setState({ studentid: e.target.value })}
                      onKeyUp={this.handlestudentIdKeyUp}
                      required
                    />
                    <div className="register-error">{this.state.studentidError}</div>
                    <label htmlFor="studentid-register">학번</label>
                  </div>
                  <div className="input-field col s6 name-size">
                    <select defaultValue={'DEFAULT'} onChange={(e) => this.setState({ grade: e.target.value })}>
                      <option value="DEFAULT" disabled>
                        학년
                      </option>
                      <option value="1">1학년</option>
                      <option value="2">2학년</option>
                      <option value="3">3학년</option>
                      <option value="4">4학년</option>
                    </select>
                  </div>
                  <div className="input-field col s6 name-size">
                    <select defaultValue={'DEFAULT'} onChange={(e) => this.setState({ dept: e.target.value })}>
                      <option value="DEFAULT" disabled>
                        학과
                      </option>
                      <option value="1">전자정보통신공학과</option>
                      <option value="2">정보보안학과</option>
                      <option value="3">컴퓨터공학과</option>
                      <option value="4">환경공학과</option>
                    </select>
                  </div>
                  <div id="error-back" />
                  <input
                    type="submit"
                    name="submit"
                    value="회원가입"
                    className="btn"
                    disabled={
                      !this.state.IDValid ||
                      !this.state.pwd1Valid ||
                      !this.state.nameValid ||
                      !this.state.emailValid ||
                      !this.state.studentidValid ||
                      this.state.grade === '' ||
                      this.state.dept === '' ||
                      this.state.pwd2 !== this.state.pwd1
                    }
                  />
                </form>
                <p className="register-login-link">
                  <NavLink className="pink-link" to="/users/login">
                    로그인하기
                  </NavLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this._isMounted = true;
    M.AutoInit();
  }

  handleIdKeyUp = (e) => {
    let result = ValidateInput.user.userID(e.target.value);

    this._isMounted &&
      this.setState({
        IDError: result.IDError,
        IDValid: result.IDValid,
      });
  };

  handlePwdKeyUp = (e) => {
    let result = ValidateInput.user.pwd(e.target.value);

    this._isMounted &&
      this.setState({
        pwd1Error: result.pwd1Error,
        pwd1Valid: result.pwd1Valid,
      });
  };

  handleRepeatPwdKeyUp = () => {
    if (this.state.pwd1 === this.state.pwd2) {
      this._isMounted && this.setState({ pwd2Error: '' });
    } else if (this.state.pwd2 !== '') {
      this._isMounted && this.setState({ pwd2Error: '비밀번호가 일치하지 않습니다.' });
    }
  };

  handleNameKeyUp = (e) => {
    let result = ValidateInput.user.name(e.target.value);

    this._isMounted &&
      this.setState({
        nameError: result.nameError,
        nameValid: result.nameValid,
      });
  };

  handleEmailKeyUp = (e) => {
    let result = ValidateInput.user.email(e.target.value);

    this._isMounted &&
      this.setState({
        emailError: result.emailError,
        emailValid: result.emailValid,
      });
  };

  handlestudentIdKeyUp = (e) => {
    let result = ValidateInput.user.studentid(e.target.value);

    this._isMounted &&
      this.setState({
        studentidError: result.studentidError,
        studentidValid: result.studentidValid,
      });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log('hi');
    await Axios.post('/users/register', {
      userID: this.state.userID,
      pwd1: this.state.pwd1,
      pwd2: this.state.pwd2,
      name: this.state.name,
      email: this.state.email,
      studentid: this.state.studentid,
      grade: this.state.grade,
      dept: this.state.dept,
    })
      .then((res) => {
        console.log(res);
        this._isMounted && this.props.history.push('/users/login');
      })
      .catch((err) => {
        console.log(err);
        let message = err.response.data['error'];
        ErrorToast.custom.error(message, 1400);
      });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }
}

export default Register;
