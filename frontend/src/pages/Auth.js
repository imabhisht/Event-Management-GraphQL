import React, { Component } from "react";
import "./css/Auth.css";
class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const requestBody = {
      query: `
      mutation{
        createUser(userInput: {email: "${email}",password: "${password}"}){
          _id
          email
        }
      }
      `,
    };

    console.log(email, password);

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
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
          <button type="submit">Submit</button>
          <button type="button">Switch to Signup</button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
