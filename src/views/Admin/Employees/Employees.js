import React, {Component} from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  InputGroup,
  Row,
  Table,
  Badge,
  ModalHeader,
  ModalBody, Form, FormGroup, Label, Input, ModalFooter, Modal
} from "reactstrap";
import {AppSwitch} from "@coreui/react";
import '../../AddTask/AddTask.scss'
import {DesignationTypes, ProjectsList} from "../../../constance/Constance";
import * as Validations from "../../../validation/Validation";
import * as CommonFunc from "../../../utils/CommonFunc";
import * as EmployeeService from "../../../services/employee";
import Loader from "../../../components/Loader/loading";
import * as ProjectService from "../../../services/projects";
import * as DesignationService from "../../../services/designation";

class Employees extends Component {
  state = {
    list: [],
    password: '',
    rePassword: '',
    employeeName: '',
    employeeEmail: '',
    status: true,
    selectedDesignation: 0,
    selectedInvolveProject: 0,
    designationTypes: [],
    projectList: [],
    isEdit: false,
    loading: false,
    modelVisible: false,
    readOnly: false
  }

  componentDidMount() {
    this.getAllEmployees();
    this.getAllDesignations();
    this.getAllProjects();
  }

  getAllEmployees = () => {
    this.setState({loading: true})
    const data = {"all": 1}
    EmployeeService.getAllEmployee(data)
      .then(res => {
        if (res.success) {
          const list = [];
          res.data.employer_list.map(item => {
            list.push({
              id: item.id,
              employeeName: item.user.name,
              employeeEmail: item.user.email,
              password: '123456',
              involveProject: {id: item.projects[0].id, project: item.projects[0].name},
              designation: {id: item.designation.id, role: item.designation.designation_name},
              status: item.status === 1
            })
          })
          this.setState({loading: false, list})
        } else {
          CommonFunc.notifyMessage(res.message);
          this.setState({loading: false})
        }
      })
  }

  getAllDesignations = () => {
    const data = {"all": 1}
    DesignationService.getAllDesignations(data)
      .then(res => {
        if (res.success) {
          const list = [];
          res.data.designation_list.map(item => {
            list.push({
              label: item.designation_name,
              value: item.id
            })
          })
          this.setState({designationTypes: list})
        }
      })
  }

  getAllProjects = () => {
    const data = {"all": 1}
    ProjectService.getAllProjects(data)
      .then(res => {
        if (res.success) {
          const list = [];
          res.data.project_list.map(item => {
            list.push({
              label: item.name,
              value: item.id
            })
          })
          this.setState({projectList: list})
        }
      })
  }

  onTogglePopup = (item, isEdit) => {
    this.setState({modelVisible: !this.state.modelVisible})
    this.setState({
      password: item.password,
      rePassword: item.password,
      employeeName: item.employeeName,
      employeeEmail: item.employeeEmail,
      status: item.status,
      selectedDesignation: item.designation.id,
      selectedInvolveProject: item.involveProject.id,
    })
    if (isEdit) {
      this.setState({isEdit})
    }

  }

  onPopupVisibility = () => {
    this.setState({
      modelVisible: !this.state.modelVisible,
      password: "",
      rePassword: "",
      employeeName: "",
      employeeEmail: "",
      status: false,
      selectedDesignation: 0,
      selectedInvolveProject: 0,
      isEdit: false,
      readOnly:false
    })
  }


  onTextChange = (event) => {
    let name = event.target.name;
    console.log(name)
    this.setState({
      [name]: event.target.value,
    });
  }

  onSave = () => {
    if (!Validations.textFieldValidator(this.state.employeeName, 1)) {
      CommonFunc.notifyMessage('Please enter employee name', 0);
    } else if (!Validations.emailValidator(this.state.employeeEmail)) {
      CommonFunc.notifyMessage('Please enter valid employee email', 0);
    } else if (this.state.selectedInvolveProject === 0) {
      CommonFunc.notifyMessage('Please select project', 0);
    } else if (this.state.selectedDesignation === 0) {
      CommonFunc.notifyMessage('Please select designation', 0);
    } else if (!Validations.textFieldValidator(this.state.password, 1)) {
      CommonFunc.notifyMessage('Please enter password', 0);
    } else if (!Validations.textFieldValidator(this.state.rePassword, 1)) {
      CommonFunc.notifyMessage('Please enter confirm password', 0);
    } else if (this.state.rePassword !== this.state.password) {
      CommonFunc.notifyMessage('password not match', 0);
    } else {
      this.setState({loading: true});
      const data = {
        "name": this.state.employeeName,//required
        "email": this.state.employeeEmail,//required
        "password": this.state.password,//required
        "password_confirmation": this.state.rePassword,//required
        "state": this.state.status,//required
        "project_id": this.state.selectedInvolveProject,//required
        "designation_id": this.state.selectedDesignation //required
      }

      if (!this.state.isEdit) {
        EmployeeService.createEmployee(data)
          .then(res => {
            if (res.success) {
              CommonFunc.notifyMessage('Employee has been added', 1);
              this.onPopupVisibility();
              this.getAllEmployees();
            } else {
              CommonFunc.notifyMessage('Employee added fail', 0);
              this.setState({loading: false});
            }
          })
      } else {
        // edit endpoint
      }

    }
  }

  render() {
    const listData = this.state.list.map((items, i) => (
      <tr key={i}>
        <td className={"DescriptionTD"}>{items.employeeName}</td>
        <td className={"DescriptionTD"}>
          {items.involveProject.project}
        </td>
        <td className={"DescriptionTD"}>
          {items.designation.role}
        </td>
        <td className={"DescriptionTD"}>
          <AppSwitch variant={'pill'} label color={'success'} size={'sm'} checked={items.status} disabled/>
        </td>
        <td className={'btn-align'}>
          <Button color="dark" className="btn-pill shadow" onClick={() => {
            this.setState({readOnly: true})
            this.onTogglePopup(items, false)
          }}>View</Button>
          <Button color="primary" className="btn-pill shadow"
                  onClick={() => this.onTogglePopup(items, true)}>Edit</Button>
        </td>
      </tr>
    ));

    return (
      <div>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <div style={{display: "flex"}}>
                  <Col md="10"/>
                  <Col md="2" className="p-0">
                    <InputGroup className="d-inline-block text-right">
                      <Button color="success" className="btn-pill shadow" onClick={() => this.onPopupVisibility()}>Create
                        User</Button>
                    </InputGroup>
                  </Col>

                </div>

              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm" className={"Table"}>
                  <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Involve Projects</th>
                    <th>Designation</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>{listData}</tbody>
                </Table>

              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal isOpen={this.state.modelVisible} toggle={this.onPopupVisibility}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader
            toggle={this.onPopupVisibility}>{this.state.isEdit ? 'Edit employee' : this.state.readOnly ? 'View Employee' : 'Create new employee'}</ModalHeader>
          <ModalBody className="pl-5 pr-5">
            <Form>
              <FormGroup row>
                <Label sm={3}>Employee Name</Label>
                <Col sm={6}>
                  <Input type="text" name="employeeName" placeHolder={"Employee Name"} onChange={this.onTextChange} disabled={this.state.readOnly}
                         value={this.state.employeeName}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Employee Email</Label>
                <Col sm={6}>
                  <Input type="email" name="employeeEmail" placeHolder={"Employee Email"} onChange={this.onTextChange} disabled={this.state.readOnly}
                         value={this.state.employeeEmail}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Status</Label>
                <Col sm={4}>
                  <AppSwitch variant={'pill'} label color={'success'} size={'lg'}
                             checked={this.state.status}
                             onChange={() => {
                               this.setState({status: !this.state.status})
                             }}
                             disabled={this.state.readOnly}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Involve Project</Label>
                <Col sm={5}>
                  <Input type="select" name="selectedInvolveProject" onChange={this.onTextChange} disabled={this.state.readOnly}>
                    <option value="" disabled={this.state.selectedInvolveProject !== 0}>Select Project</option>
                    {this.state.projectList.map(item => (
                      <option value={item.value}
                              selected={item.value === this.state.selectedInvolveProject}>{item.label}</option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Designation type</Label>
                <Col sm={5}>
                  <Input type="select" name="selectedDesignation" onChange={this.onTextChange} disabled={this.state.readOnly}>
                    <option value="" disabled={this.state.selectedDesignation !== 0}>Select Designation</option>
                    {this.state.designationTypes.map(item => (
                      <option value={item.value}
                              selected={item.value === this.state.selectedDesignation}>{item.label}</option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Password</Label>
                <Col sm={6}>
                  <Input type={`${this.state.readOnly || this.state.isEdit ? 'text' : 'password'}`} name="password" placeHolder={"Password"} onChange={this.onTextChange} disabled={this.state.readOnly}
                         value={this.state.password}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Confirm Password</Label>
                <Col sm={6}>
                  <Input type={`${this.state.readOnly || this.state.isEdit ? 'text' : 'password'}`} name="rePassword" placeHolder={"Confirm Password"} onChange={this.onTextChange} disabled={this.state.readOnly}
                         value={this.state.rePassword}/>
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.onPopupVisibility}>Cancel</Button>
            <Button color="primary"
                    onClick={this.onSave}>{!this.state.isEdit ? 'Submit' : 'Edit'}</Button>
          </ModalFooter>
        </Modal>
        {this.state.loading && (
          <Loader
            asLoading={this.state.loading}
          />
        )}
      </div>
    );
  }
}

export default Employees;
