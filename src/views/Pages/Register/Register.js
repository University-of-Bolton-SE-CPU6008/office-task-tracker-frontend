import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
  Col,
  Container,
  Row
} from 'reactstrap';
import {BASE_URL} from "../../../constance/Constance";
import * as authService from '../../../services/auth';
import qs from 'qs';
import Cookies from "js-cookie";
import {StorageStrings} from '../../../constance/StorageStrings';
import * as CommonFunc from '../../../utils/CommonFunc';
import Loader from "../../../components/Loader/loading";
import * as Validations from "../../../validation/Validation";

class Register extends Component {
  state = {
    email: '',
    password: '',
    loading: false
  }

  signUpHandler = async () => {

  }

  onTextChange = (event) => {
    let name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  handleSubmit = async(e) => {
    if (!Validations.textFieldValidator(this.state.email, 1)) {
      CommonFunc.notifyMessage('Please enter valid email address', 0);
    }else if (!Validations.textFieldValidator(this.state.password, 1)) {
      CommonFunc.notifyMessage('Please enter password', 0);
    }else {
      this.setState({loading: true})
      const obj = {
        email:this.state.email,
        password: this.state.password
      }
      await authService.registerUser(obj)
        .then(res=>{
          console.log('register response ::::::::::',res)
          if (res.success){
            this.loginUser(obj)
          }else {
            this.setState({loading: false})
            CommonFunc.notifyMessage(res.message,res.status);
          }
        })
        .catch(err=>{
          this.setState({loading: false})
          console.log(err)
        })
    }
  }

  loginUser=async (obj)=>{
    await authService.loginUser(obj)
      .then(res=>{
        console.log('login response::::::::::::::',res)
        if (res.success){
          localStorage.setItem(StorageStrings.ACCESS_TOKEN, res.data.access_token);
          Cookies.set(StorageStrings.ACCESS_TOKEN, res.data.access_token);
          localStorage.setItem(StorageStrings.REFRESH_TOKEN, res.data.refresh_token);
          Cookies.set(StorageStrings.REFRESH_TOKEN, res.data.refresh_token);
          localStorage.setItem(StorageStrings.LOGGED, 'true');
          localStorage.setItem(StorageStrings.USER_TYPE,res.data.role);
          this.props.history.push(BASE_URL + '/add-task');
        }else {
          CommonFunc.notifyMessage(res.message,res.status);
        }
        this.setState({loading: false})
      })
      .catch(err=>{
        this.setState({loading: false})
        console.log(err)
      })
  }

  render() {
    let {fullName, email, password} = this.state;
    return (
      <div className="app flex-row align-items-center auth-bg">
        <Container>
          <Row className="justify-content-center">
            <Col md="5" className="auth-container">
              <h2>Register</h2>
              <form className="register-form" onSubmit={this.handleSubmit}>
                <label htmlFor="email">email</label>
                <input value={email.value} onChange={(e) => this.onTextChange(e)} type="email"
                       placeholder="youremail@gmail.com" id="email" name="email"/>
                <label htmlFor="password">password</label>
                <input value={password.value} onChange={(e) => this.onTextChange(e)} type="password"
                       placeholder="********" id="password" name="password"/>
                <button type="button" className="button-auth" onClick={this.handleSubmit}>Sign Up</button>
              </form>
              <Link to={BASE_URL + "/login"}>
                <button className="link-btn">Already have an account? Login here.</button>
              </Link>
            </Col>
          </Row>
        </Container>
        {this.state.loading ? (
          <Loader
            asLoading={this.state.loading}
          />
        ) : null}
      </div>
  );
  }
  }

  export default Register;
