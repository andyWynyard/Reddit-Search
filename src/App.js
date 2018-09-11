import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { get } from 'axios';

import debounce from 'lodash/debounce';

class App extends Component {
  state = {
    inputValue: '',
    placeholder: 'Login name (exact)',
    users: [],
    user: {},
    searchedUsers: []
  };

  // Update input field with state.

  updateInputValue(inputValue) {
    this.setState({
      inputValue
    });
    this.searchForUser(inputValue);
  }

  // Potential search function for searching API.
  // Debounce to limit hitting API too much

  searchForUser = debounce(inputValue => {
    get(`https://api.github.com/search/users?q=${inputValue}`).then(res => {
      res.data.items.map(item => {
        return get(`https://api.github.com/users/${item.login}`).then(res => {
          this.setState({
            searchedUsers: [...this.state.searchedUsers, res.data]
          });
        });
      });
    });
  }, 1000);

  // Get function to fetch user data on submit.

  getUserData(username) {
    get(`https://api.github.com/users/${username}`)
      .then(res => {
        const user = res.data;
        console.log(user);

        if (user.login) {
          this.setState({
            user,
            users: [...this.state.users, user]
          });
        } else {
          return;
        }
      })
      .catch(err => {
        console.log(err.response);
        if (err.response.status === 404) {
          this.setState({
            user: { login: `${username} doesn't exist bro.` }
          });
        }
      });
  }

  // axios.get(`https://jsonplaceholder.typicode.com/users`)
  //     .then(res => {
  //       const persons = res.data;
  //       this.setState({ persons });
  //     })

  handleSubmit(e) {
    e.preventDefault();
    this.getUserData(this.refs.username.value);
    this.setState({ inputValue: '' });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to a React App</h1>
          <h1 className="App-title">
            The more repos on github, the faster the spinner spins
          </h1>
        </header>
        <form onSubmit={e => this.handleSubmit(e)}>
          <label>
            Username:{' '}
            <input
              onChange={e => this.updateInputValue(e.target.value)}
              ref="username"
              value={this.state.inputValue}
              placeholder={this.state.placeholder}
              type="text"
            />
          </label>
        </form>
        <p>
          As you type, it will search for a user by name. This will create a
          list to the right. If you click on the user it will add to the content
          list. If you submit the searched for term, it will search for the
          exact username on GitHub
        </p>
        <p>
          Last found login:{' '}
          {this.state.user.login ? this.state.user.login : '---'}
        </p>
        <div className="app-content">
          <div className="list-wrapper">
            {this.state.users.map(user => {
              return (
                <div key={user.id} className="wrapper">
                  <p className="user-name">
                    {user.name ? `Name: ${user.name}` : 'No name val'}
                    <br />
                    {user.login ? `Login: ${user.login}` : "Doens't exist"}
                    <br />
                    {user.location
                      ? `Location: ${user.location}`
                      : 'Location: Mars?'}
                  </p>
                  <div className="content">
                    <img
                      className="user-avatar"
                      src={user.avatar_url}
                      alt="Missing Avatar"
                    />
                    <img
                      className="spinner"
                      style={{
                        animation: `App-logo-spin infinite ${
                          user.public_repos ? (1 / user.public_repos) * 100 : 0
                        }s linear`,
                        height: '80px'
                      }}
                      src={logo}
                      alt="Spinner"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="search-list">
            {this.state.searchedUsers.map(user => {
              return (
                <div
                  key={user.id}
                  className="wrapper"
                  onClick={() =>
                    this.setState({
                      users: [...this.state.users, user]
                    })
                  }>
                  <p className="user-name">
                    {user.name ? `Name: ${user.name}` : 'No name val'}
                    <br />
                    {user.login ? `Login: ${user.login}` : "Doens't exist"}
                    <br />
                    {user.location
                      ? `Location: ${user.location}`
                      : 'Location: Mars?'}
                  </p>
                  <div className="content">
                    <img
                      className="user-avatar"
                      src={user.avatar_url}
                      alt="Missing Avatar"
                    />
                    <img
                      className="spinner"
                      style={{
                        animation: `App-logo-spin infinite ${
                          user.public_repos ? (1 / user.public_repos) * 100 : 0
                        }s linear`,
                        height: '80px'
                      }}
                      src={logo}
                      alt="Spinner"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
