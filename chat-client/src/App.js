import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from  './components/chat';
import SockJS from 'sockjs-client';

class App extends Component {
  constructor(props){
    super(props);

     const sock = new SockJS('https://chat-server.azurewebsites.net/chat');
       sock.onopen = function() {
           console.log('open connections');
           //sock.send('test');
       };
       
       let self = this;

       sock.onmessage = function(e) {
           console.log('message received', e.data);
           self.setState({messages: [...self.state.messages, e.data] });
           //sock.close();
       };

       sock.onclose = function() {
           console.log('close');
       };
     this.state = {
      actions: sock,
      messages: []
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Chat {... this.state } />
      </div>
    );
  }
}

export default App;
