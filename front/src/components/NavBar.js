import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter, NavLink } from 'react-router-dom';
import Axios from 'axios';
import AuthService from '../services/AuthService';

const Auth = new AuthService();
const CancelToken = Axios.CancelToken;

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      socket: '',
      listNotif: [],
      nbMessages: null,
      nbNotifications: null,
      right: false,
      left: false,
    };
    this._isMounted = false;
    this.Auth = new AuthService();
    this.handleLogout = this.handleLogout.bind(this);
    this.Auth.getConfirm = this.Auth.getConfirm.bind(this);
    this.Auth.loggedIn = this.Auth.loggedIn.bind(this);
  }

  async componentDidMount() {
    this._isMounted = true;
    if (!localStorage.getItem('Token')) {
      return;
    }
    this._isMounted && (await this.setState({ user_id: this.Auth.getConfirm()['id'] }));
  }

  render() {
    const logout = this.handleLogout;
    const user_id = this.state.user_id;

    const useStyles = makeStyles((theme) => ({
      margin: {
        margin: theme.spacing(2),
        marginRight: theme.spacing(3),
      },
      list: {
        width: 320,
      },
    }));

    const LoggedInLinks = () => {
      const classes = useStyles();
      return (
        <ul className="right hide-on-med-and-down">
          <li>
            <NavLink to={'/users/profile/' + Auth.getConfirm().userID}>{<i className="material-icons">person</i>}</NavLink>
          </li>
          <li>
            <button className="nav-buttons" onClick={logout}>
              로그아웃
            </button>
          </li>
        </ul>
      );
    };

    // Generates the links in the navbar for a logged out user
    function LoggedOutLinks() {
      return (
        <ul className="right hide-on-med-and-down">
          <li>
            <NavLink to="/users/register">회원가입</NavLink>
          </li>
          <li>
            <NavLink to="/users/login">로그인</NavLink>
          </li>
        </ul>
      );
    }

    // Generates the links in the navbar for a logged in user
    function NavLinks() {
      if (Auth.loggedIn())
        return (
          <div>
            <LoggedInLinks />
          </div>
        );
      else
        return (
          <div>
            <LoggedOutLinks />
          </div>
        );
    }

    document.addEventListener('DOMContentLoaded', function () {
      var elems = document.querySelectorAll('.sidenav');
      M.Sidenav.init(elems);
    });
    return (
      <div>
        <nav>
          <div className="nav-wrapper">
            <NavLink to="/" className="brand-logo">
              FUN & BUN
            </NavLink>
            <NavLinks />
          </div>
        </nav>
      </div>
    );
  }

  // Log out the user clearing his Auth token
  handleLogout() {
    Auth.logout();
    this.props.history.replace('/users/login');
  }
}

export default withRouter(NavBar);
