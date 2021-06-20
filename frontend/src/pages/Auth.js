import React, { Component } from "react";
import "./css/Auth.css";
class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  submitHandler = () => {};

  render() {
    return (
      <form className="auth-form">
        <div className="form-control">
          <label for="email">Email</label>
          <input
            className="auth_inputField"
            type="email"
            id="email"
            ref={this.emailEl}
          />
        </div>

        <div className="form-control">
          <label for="password">Password</label>
          <input
            className="auth_inputField"
            type="password"
            id="password"
            ref={this.passwordEl}
          />
        </div>

        <div className="form-actions">
          <button type="button">Switch to Signup</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
