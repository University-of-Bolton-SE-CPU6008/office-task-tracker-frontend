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

class ForgotPW extends Component {
  state = {
    email: '',
    password: '',
    token:'',
    loading: false,
    verifyBtnVisible: true
  }

  loginUser = async () => {
    const obj = {
      email: this.state.email,
      password: this.state.password
    }
    await authService.loginUser(obj)
      .then(res => {
        console.log('login response::::::::::::::', res)
        if (res.success) {
          localStorage.setItem(StorageStrings.ACCESS_TOKEN, res.data.access_token);
          Cookies.set(StorageStrings.ACCESS_TOKEN, res.data.access_token);
          localStorage.setItem(StorageStrings.REFRESH_TOKEN, res.data.refresh_token);
          Cookies.set(StorageStrings.REFRESH_TOKEN, res.data.refresh_token);
          localStorage.setItem(StorageStrings.LOGGED, 'true');
          localStorage.setItem(StorageStrings.USER_TYPE, res.data.role);
          if (res.data.role !== 'ROLE_USER') {
            this.props.history.push(BASE_URL + '/manage-products');
          } else {
            window.location = BASE_URL + '/product-catalogue'
            // this.props.history.push(BASE_URL + '/product-catalogue');
          }
        } else {
          CommonFunc.notifyMessage(res.message, res.status);
        }
        this.setState({loading: false})
      })
      .catch(err => {
        this.setState({loading: false})
        console.log(err)
      })
  }

  onTextChange = (event) => {
    let name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  forgotPassword = async () => {

    if (!Validations.emailValidator(this.state.email, 1)) {
      CommonFunc.notifyMessage('Please enter valid email address', 0);
    }else {
      this.setState({loading: true})

      const data = {
        email: this.state.email
      }
      await authService.forgotPassword(data)
        .then(res => {
          if (res.success) {
            this.setState({verifyBtnVisible: false, loading: false});
            CommonFunc.notifyMessage('Email sent successfully!', 1);
          }else {
            this.setState({loading: false})
            CommonFunc.notifyMessage(res.message, res.status);
          }
        })
        .catch(err => {
          this.setState({loading: false})
          console.log(err)
        })
    }

  }

  updatePassword = async () => {

    if (!Validations.textFieldValidator(this.state.password, 1)) {
      CommonFunc.notifyMessage('Please enter password', 0);
    }else if (!Validations.textFieldValidator(this.state.token, 1)) {
      CommonFunc.notifyMessage('Please enter valid token', 0);
    }else {
      this.setState({loading: true})

      const data = {
        token:this.state.token,
        password:this.state.password
      }
      await authService.updatePassword(data)
        .then(res => {
          if (res.success) {
            this.setState({loading: false});
            CommonFunc.notifyMessage('Password update successfully!', 1);
            this.loginUser();
          }else {
            this.setState({loading: false})
            CommonFunc.notifyMessage(res.message, res.status);
          }
        })
        .catch(err => {
          this.setState({loading: false})
          console.log(err)
        })
    }


  }

  render() {
    let {email, password, token} = this.state;
    return (
      <div className="app flex-row align-items-center auth-bg">
        <Container>
          <Row className="justify-content-center">
            <Col md="5" className="auth-container">
              <h2>Forgot Password</h2>
              <form className="login-form">
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => {
                  this.onTextChange(e)
                }} type="email" placeholder="youremail@gmail.com" id="email" name="email"/>

                {this.state.verifyBtnVisible && (
                  <button type="button" className="button-auth mt-1" onClick={async () => {
                    await this.forgotPassword()
                  }}>Send Verification
                  </button>
                )}


                {!this.state.verifyBtnVisible && (
                  <>
                    <label htmlFor="token">token</label>
                    <input value={token} onChange={(e) => {
                      this.onTextChange(e)
                    }} type="token" placeholder="********" id="token" name="token"/>

                    <label htmlFor="password">password</label>
                    <input value={password} onChange={(e) => {
                      this.onTextChange(e)
                    }} type="password" placeholder="********" id="password" name="password"/>
                    <button type="button" className="button-auth mt-1" onClick={async () => {
                      await this.updatePassword()
                    }}>Update Password
                    </button>
                  </>
                )}
              </form>
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

export default ForgotPW;
