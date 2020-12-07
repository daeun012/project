import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter, NavLink } from 'react-router-dom';
import Axios from 'axios';
import AuthService from '../services/AuthService';
import Badge from '@material-ui/core/Badge';

import Menu from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';

import Divider from '@material-ui/core/Divider';

const Auth = new AuthService();
const CancelToken = Axios.CancelToken;

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',

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

    const MobileLoggedInLinks = () => {
      const toggleMenu = (menu, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }

        this._isMounted && this.setState({ [menu]: open });
      };

      const classes = useStyles();

      const MobileMenuLogged = (menu) => (
        <div className={classes.list} role="presentation" onClick={toggleMenu(menu, false)} onKeyDown={toggleMenu(menu, false)}>
          <h5 style={{ textAlign: 'center', color: '#ffb6d3' }}>Menu</h5>
          <List>
            <ListItem>
              <NavLink className="mobile-menu-links" to={'/users/profile/' + this.Auth.getConfirm()['username']}>
                <i className="material-icons link-icon mobile-menu-icons">person</i>
                <span className="mobile-menu-notif-text">My profile</span>
              </NavLink>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem>
              <NavLink className="mobile-menu-links" onClick={logout} to="/users/login">
                <span className="mobile-menu-notif-text">Log out</span>
              </NavLink>
            </ListItem>
          </List>
        </div>
      );

      return (
        <div>
          <Button className="mobile-menu-btn" onClick={toggleMenu('left', true)}>
            {/*  <i className="material-icons">menu</i> */}
            <Badge className={classes.margin}>
              <Menu />
            </Badge>
          </Button>

          <SwipeableDrawer anchor="left" open={this.state.left} onClose={toggleMenu('left', false)} onOpen={toggleMenu('left', true)}>
            {MobileMenuLogged('left')}
          </SwipeableDrawer>
        </div>
      );
    };

    const MobileLoggedOutLinks = () => {
      const toggleMenu = (menu, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }

        this._isMounted && this.setState({ [menu]: open });
      };

      const classes = useStyles();

      const MobileMenuLoggedOut = (menu) => (
        <div className={classes.list} role="presentation" onClick={toggleMenu(menu, false)} onKeyDown={toggleMenu(menu, false)}>
          <h5 style={{ textAlign: 'center', color: '#ffb6d3' }}>Menu</h5>
          <List>
            <ListItem>
              <NavLink className="mobile-menu-links" to="/users/login">
                <i className="material-icons link-icon mobile-menu-icons">account_box</i>
                <span className="mobile-menu-notif-text">Log in</span>
              </NavLink>
            </ListItem>
            <ListItem>
              <NavLink className="mobile-menu-links" to="/users/register">
                <i className="material-icons link-icon mobile-menu-icons">person_add</i>
                <span className="mobile-menu-notif-text">Register</span>
              </NavLink>
            </ListItem>
          </List>
        </div>
      );

      return (
        <div>
          <Button className="mobile-menu-btn" onClick={toggleMenu('left', true)}>
            <i className="material-icons">menu</i>
          </Button>
          <SwipeableDrawer anchor="left" open={this.state.left} onClose={toggleMenu('left', false)} onOpen={toggleMenu('left', true)}>
            {MobileMenuLoggedOut('left')}
          </SwipeableDrawer>
        </div>
      );
    };

    // Generates the links in the navbar for a logged in user
    function NavLinks() {
      if (Auth.loggedIn())
        return (
          <div>
            <LoggedInLinks />
            <MobileLoggedInLinks />
          </div>
        );
      else
        return (
          <div>
            <LoggedOutLinks />
            <MobileLoggedOutLinks />
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
