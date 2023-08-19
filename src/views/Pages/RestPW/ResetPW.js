import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Row, FormGroup, Label, Input, Badge, CardFooter, Button} from "reactstrap";
import {BASE_URL} from "../../../constance/Constance";
import * as  UserService from '../../../services/auth'
import * as Validation from "../../../validation/Validation";
import * as CommonFunc from "../../../utils/CommonFunc";
import {StorageStrings} from "../../../constance/StorageStrings";
import Loader from "../../../components/Loader/loading";
import * as authService from "../../../services/auth";

class ResetPw extends Component {
  state = {
    oldPassword: {
      value: '',
      valid: true
    },
    newPassword: {
      value: '',
      valid: true
    },
    confirmPassword: {
      value: '',
      valid: true
    },
    loading: false
  }

  changePasswordHandler = () => {
    const oldPassword = this.state.oldPassword;
    const newPassword = this.state.newPassword;
    const confirmPassword = this.state.confirmPassword;
    const checkEmpty =Validation.textFieldValidator(newPassword.value, 1);
    oldPassword.valid = Validation.textFieldValidator(oldPassword.value, 1);
    newPassword.valid = Validation.textFieldValidator(newPassword.value, 6);
    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.valid = false
    }
    this.setState({oldPassword: oldPassword, newPassword: newPassword, confirmPassword: confirmPassword});
    if (!oldPassword.valid) {
      CommonFunc.notifyMessage('Please enter old password', 0);
    } else if (!checkEmpty){
      CommonFunc.notifyMessage('Please enter new password', 0);
    } else if (!newPassword.valid) {
      CommonFunc.notifyMessage('Password should be at least 6 characters..!', 0);
    } else if (!confirmPassword.valid) {
      CommonFunc.notifyMessage('Passwords do not match,try again..!', 0);
    } else {
      this.setState({loading: true});
      authService.updatePassword({
        user_id: Number(localStorage.getItem(StorageStrings.USERID)),
        old_password: this.state.oldPassword.value,
        password: this.state.newPassword.value,
        password_confirmation:this.state.confirmPassword.value
      })
        .then(response => {
          if (response.success) {
            CommonFunc.notifyMessage('Password has been changed successfully', 1);
            this.setState({loading: false});
            this.props.history.push(BASE_URL + '/add-task');
          } else {
            this.setState({loading: false});
            CommonFunc.notifyMessage(response.message)
          }
        })
    }
  }

  /**
   * input text change method
   * */
  onTextChange = (event) => {
    let name = event.target.name;
    let item = this.state[name];
    item.value = event.target.value;
    item.valid = true;
    this.setState({
      [name]: item,
    });
  }

  cancelHandler() {
    this.setState({
      oldPassword: {
        value: '',
        valid: true
      },
      newPassword: {
        value: '',
        valid: true
      },
      confirmPassword: {
        value: '',
        valid: true
      },
    })
  }

  render() {
    const {oldPassword, newPassword, confirmPassword, loading} = this.state;
    return (
      <div>
        <Row>
          <Col xs="12" sm="1"/>
          <Col xs="12" sm="10">
            <Card>
              <CardHeader>
                <strong>Change Password</strong>
              </CardHeader>
              <CardBody>
                <FormGroup row className="my-4">
                  <Col md="3">
                    <Label htmlFor="date-input">Old Password</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="password"
                      id="oldPassword"
                      name="oldPassword"
                      placeholder="Old Password"
                      onChange={this.onTextChange}
                      value={oldPassword.value}/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="date-input">New Password <Badge color={'success'}>NEW</Badge></Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      placeholder="New Password"
                      onChange={this.onTextChange}
                      value={newPassword.value}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row className="my-4">
                  <Col md="3">
                    <Label htmlFor="date-input">Retype New Password</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      onChange={this.onTextChange}
                      value={confirmPassword.value}
                    />
                  </Col>
                </FormGroup>
                <div className="card-header-actions my-3">
                  <Button color="primary" className="btn-pill shadow"
                          onClick={() => this.changePasswordHandler()}>Update</Button>
                </div>
                <div className="card-header-actions my-3" style={{marginRight: 10}}>
                  <Button color="danger" className="btn-pill shadow"
                          onClick={() => this.cancelHandler()}>Clear</Button>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="1"/>
        </Row>

        {loading ? (
          <Loader
            asLoading={loading}
          />
        ) : null}

      </div>
    );
  }
}

export default ResetPw;
