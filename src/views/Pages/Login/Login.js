import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
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

class Login extends Component {
  state = {
    email: '',
    password: '',
    loading: false
  }

  loginUser=async ()=>{
    if (!Validations.emailValidator(this.state.email)) {
      CommonFunc.notifyMessage('Please enter valid email address', 0);
    }else if (!Validations.textFieldValidator(this.state.password, 1)) {
      CommonFunc.notifyMessage('Please enter password', 0);
    }else {
      const obj = {
        email:this.state.email,
        password:this.state.password
      }
      await authService.loginUser(obj)
        .then(res=>{
          console.log('login response::::::::::::::',res)
          if (res.success){
            localStorage.setItem(StorageStrings.ACCESS_TOKEN, res.data.accessToken);
            Cookies.set(StorageStrings.ACCESS_TOKEN, res.data.accessToken);
            localStorage.setItem(StorageStrings.LOGGED, 'true');
            localStorage.setItem(StorageStrings.USER_TYPE,res.data.user.user_level);
            localStorage.setItem(StorageStrings.USERID,res.data.user.id);
            if (res.data.user.user_level!=='admin'){
              this.props.history.push(BASE_URL + '/add-task');
            }else {
              this.props.history.push(BASE_URL + '/admin/all-tasks');
            }

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

  }

  onTextChange = (event) => {
    let name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  render() {
    let {email, password} = this.state;
    return (
      <div className="app flex-row align-items-center auth-bg">
        <Container>
          <Row className="justify-content-center">
            <Col md="5" className="auth-container">
              <h2>Login</h2>
              <form className="login-form">
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => {
                  this.onTextChange(e)
                }} type="email" placeholder="youremail@gmail.com" id="email" name="email"/>
                <label htmlFor="password">password</label>
                <input value={password} onChange={(e) => {
                  this.onTextChange(e)
                }} type="password" placeholder="********" id="password" name="password"/>
                {/*<Link to={BASE_URL + "/forgot-password"}>*/}
                {/*  <button className="forgot-btn-link">Forgot your password?</button>*/}
                {/*</Link>*/}
                <button type="button" className="button-auth mt-5" onClick={async () => {
                  await this.loginUser()
                }}>Log In
                </button>
              </form>
              {/*<Link to={BASE_URL + "/register"}>*/}
              {/*  <button className="link-btn">Don't have an account? Register here.</button>*/}
              {/*</Link>*/}
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

export default Login;
