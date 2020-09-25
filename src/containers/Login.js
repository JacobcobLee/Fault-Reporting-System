import React, { Component } from 'react';
import SimpleBox from '../components/Login/SimpleBox';
import InputField from '../components/Login/InputField';
import FooterFormButtons from '../components/Login/FooterFormButtons';
import { login, getUser } from '../actions/UserActions';
import { connect } from 'react-redux';
import ErrorAlert from '../components/Login/ErrorAlert';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: ''
    };
  }

  componentWillMount() {
    if (this.props.user !== null) {
      this.props.history.push('/');
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== null) {
      nextProps.history.push('/');
    }
  }


  submitLogin(event) {
    event.preventDefault();
    localStorage.setItem('user', this.state.email);// set user obj in the local storage to be this.state.email
    this.props.login(this.state.email, this.state.password).catch(err => {
      this.setState({
        error: err
      });
    });
  }

  renderBody() {
    const errStyle = {
      borderColor: 'red'
    };

    return (
      <form onSubmit={event => { this.submitLogin(event);}}>
        <div>
          <InputField id="email" type="text" label="Email:"
                      inputAction={(event) => this.setState({ email: event.target.value })}
                      style={this.state.error ? errStyle : null}
          />
          <InputField id="password" type="password" label="Password:"
                      inputAction={(event) => this.setState({ password: event.target.value })}
                      style={this.state.error ? errStyle : null}
          />
          {this.state.error && <ErrorAlert>Your username/password is incorrect</ErrorAlert>}
          <br></br>
          <FooterFormButtons submitLabel="Sign in"/>
        </div>
      </form>
    );
  }

  render() {
    return (
      <div>
        <SimpleBox title="Sign in to Dashboard" body={this.renderBody()}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return { user: state.user };
}

export default connect(mapStateToProps, { login, getUser })(Login);
