import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { get } from 'axios';

class App extends Component {
  state = {
    inputValue: '',
    placeholder: 'Search Reddit',
    reddit: []
  };

  // Update input field with state.

  getSwedenSubredditRedditData() {
    this.setState({
      reddit: []
    });
    get(`https://www.reddit.com/r/sweden.json`).then(res =>
      res.data.data.children.forEach(item => {
        this.setState({
          reddit: [...this.state.reddit, item.data]
        });
      })
    );
  }
  getSubredditData() {
    this.setState({
      reddit: []
    });
    get(`http://www.reddit.com/search.json?q=${this.state.inputValue}`).then(
      res =>
        res.data.data.children.forEach(item => {
          this.setState({
            reddit: [...this.state.reddit, item.data]
          });
        })
    );
  }

  updateInputValue(inputValue) {
    this.setState({
      inputValue
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.getSubredditData();
    this.setState({ inputValue: '' });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to a React App</h1>
          <h1 className="App-title">Reddit API</h1>
        </header>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input
            placeholder={this.state.placeholder}
            onChange={e => this.updateInputValue(e.target.value)}
            value={this.state.inputValue}
            type="text"
          />
        </form>
        <button onClick={() => this.getSwedenSubredditRedditData()}>
          Hit Sweden Subreddit
        </button>

        <p />

        <div className="app-content">
          <div className="list-wrapper">
            {this.state.reddit.map(post => {
              return (
                <div key={post.title} className="card">
                  <img
                    className="card-img-top"
                    src={
                      post.preview
                        ? post.preview.images[0].source.url
                        : 'https://applets.imgix.net/https%3A%2F%2Fassets.ifttt.com%2Fimages%2Fchannels%2F1352860597%2Ficons%2Fon_color_large.png%3Fversion%3D0?ixlib=rails-2.1.3&w=240&h=240&auto=compress&s=14be39acc55fbe4638b776011273dfd5'
                    }
                    alt="Card cap"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">
                      {post.selftext.length > 100
                        ? `${post.selftext.substring(0, 100)}...`
                        : post.selftext}
                    </p>
                    <a
                      href={post.url}
                      target="_blank"
                      className="btn btn-primary">
                      Read More
                    </a>
                    <hr />
                    <span className="badge badge-secondary">
                      Subreddit: {post.subreddit}
                    </span>
                    <span className="badge badge-dark">
                      Score: {post.score}
                    </span>
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
