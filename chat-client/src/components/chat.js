import React, { Component } from 'react';
import PropTypes from  'prop-types';

class Chat extends Component {
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e){
    e.preventDefault();
    console.log("hello");
    let text = this.refs.messageText.value;
    console.log(this);
    this.props.actions.send(text);
  }
  render() {
    let i = 0;
    var messages = this.props.messages.map(message => {
      return <li className="list-group-item" key={i++}>{message}</li>
    });
    return (
      <div className="Container">
        <form id="chat" onSubmit={this.handleSubmit.bind(this)}>
          <input type="text" ref="messageText" />
          <button> Send </button>
        </form>
        <ul className="list-group">
          {messages}
        </ul>
      </div>
    );
  }
}

Chat.PropTypes = {
  actions: PropTypes.object,
  messages: PropTypes.array
};
export default Chat;
