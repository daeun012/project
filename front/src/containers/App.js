import React, { Component } from 'react';
import '../styles/App.css';
import 'materialize-css/dist/css/materialize.min.css';
import NavBar from '../components/NavBar';
import HomeLogged from '../containers/HomeLogged';
import WithAuth from '../components/withAuth';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <div>
          <HomeLogged />
        </div>
      </div>
    );
  }
}

export default WithAuth(App);
