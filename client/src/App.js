import React from 'react';
import moment from 'moment';

import './App.css';


class App extends React.Component {
  state = {
    ws: null,
    messages: []
  }

  componentDidMount() {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = response => {
      this.setState(prevState => ({ messages: [...prevState.messages, { ...JSON.parse(response.data), private: false, date: new Date() }] }));
    };
    this.setState({ ws: ws });
  }

  changeText = event => {
    this.setState({ text: event.target.value });
  }

  sendMessage = () => {
    if (this.state.text && this.state.user) {
      this.state.ws.send(JSON.stringify({ message: this.state.text, user: this.state.user }));
      this.setState(prevState => ({ text: '', messages: [...prevState.messages, { message: prevState.text, private: true, date: new Date() }] }));
    }
  }

  changeUserName = event => this.setState({ user: event.target.value })


  render() {
    return (
      <div className="app">
        <nav className="nav">
          <input type="text" className="user-name" onChange={this.changeUserName} />
        </nav>
        <div className="messages-container">
          {this.state.messages.map((node, index) =>
            <div key={index} className={node.private ? "private-message" : "public-message"}>
              <span className="user-label">{node.private ? "You" : node.user}:</span>
              <span className="user-text">{node.message}</span>
              <span className="date">{moment(node.date).format('HH:mm')}</span>
            </div>)}
        </div>
        <div className="footer">
          <input type="text" className="input" onChange={this.changeText} value={this.state.text} />
          <button className="send-button" onClick={this.sendMessage} >Send</button>
        </div>
      </div>
    );
  }
}

export default App;
