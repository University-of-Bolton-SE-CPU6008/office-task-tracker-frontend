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

class Employees extends Component {
  state = {
    list: [
      {
        id: 0,
        employeeName: 'Kavinda Dilshan',
        password: '123456',
        involveProjectId: [{id: 1, projectName: 'Synapse'}, {id: 2, projectName: 'APIT'}, {
          id: 3,
          projectName: 'TaskLab'
        }, {id: 4, projectName: 'karuna.lk'}],
        involveProject:{id:1,project:"Edulab"},
        designation: {id:1,role:"Mobile Developer"},
        status: true,
        modelVisible: false,
        isEdit: false
      }
    ],
    password: '',
    rePassword: '',
    employeeName: '',
    status: true,
    selectedData: {},
    selectedDesignation:0,
    selectedInvolveProject:0,
    designationTypes:DesignationTypes,
    projectList:ProjectsList
  }

  onTogglePopup = (item, isEdit) => {
    this.setState({modelVisible: !this.state.modelVisible, projectName: ''})
    if (item) {
      this.setState({selectedData: item})
    }
    if (isEdit) {
      this.setState({isEdit,selectedDesignation:item.designation.id,selectedInvolveProject:item.involveProject.id})
    }

  }

  onTextChange = (event) => {
    let name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  onSave=()=>{

  }

  render() {
    const listData = this.state.list.map((items, i) => (
      <tr key={i}>
        <td className={"DescriptionTD"}>{items.employeeName}</td>
        {/*<td className={"DescriptionTD"}>*/}
        {/*  {items.involveProjectId.map(obj =>*/}
        {/*    <Badge color="secondary" className="mr-1">{obj.projectName}</Badge>*/}
        {/*  )}*/}
        {/*</td>*/}
        <td className={"DescriptionTD"}>
          {items.involveProject.project}
        </td>
        <td className={"DescriptionTD"}>
          {items.designation.role}
        </td>
        <td className={"DescriptionTD"}>
          <AppSwitch variant={'pill'} label color={'success'} size={'sm'} checked={items.status}/>
        </td>
        <td className={'btn-align'}>
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
                      <Button color="success" className="btn-pill shadow" onClick={() => this.onTogglePopup()}>Create
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

        <Modal isOpen={this.state.modelVisible} toggle={this.onTogglePopup}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader
            toggle={this.onTogglePopup}>{this.state.isEdit ? 'Edit Project' : 'Create new project'}</ModalHeader>
          <ModalBody className="pl-5 pr-5">
            <Form>
              <FormGroup row>
                <Label sm={3}>Employee Name</Label>
                <Col sm={6}>
                  <Input type="text" name="employeeName" placeHolder={"Employee Name"} onChange={this.onTextChange}
                         value={this.state.selectedData.employeeName}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Status</Label>
                <Col sm={4}>
                  <AppSwitch variant={'pill'} label color={'success'} size={'lg'}
                             checked={this.state.selectedData.status}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Involve Project</Label>
                <Col sm={5}>
                  <Input type="select" name="selectedInvolveProject" onChange={this.onTextChange}>
                    <option value="" disabled={this.state.selectedInvolveProject !== 0}>Select Project</option>
                    {this.state.projectList.map(item => (
                      <option value={item.value} selected={item.value === this.state.selectedInvolveProject}>{item.label}</option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>

                <FormGroup row>
                  <Label sm={3}>Designation type</Label>
                  <Col sm={5}>
                    <Input type="select" name="selectedDesignation" onChange={this.onTextChange}>
                      <option value="" disabled={this.state.selectedDesignation !== 0}>Select Designation</option>
                      {this.state.designationTypes.map(item => (
                        <option value={item.value} selected={item.value === this.state.selectedDesignation}>{item.label}</option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup>

              <FormGroup row>
                <Label sm={3}>Password</Label>
                <Col sm={6}>
                  <Input type="password" name="password" placeHolder={"Password"} onChange={this.onTextChange}
                         value={this.state.selectedData.password}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Re - Password</Label>
                <Col sm={6}>
                  <Input type="password" name="rePassword" placeHolder={"Password"} onChange={this.onTextChange}
                         value={this.state.selectedData.password}/>
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.onTogglePopup}>Cancel</Button>
            <Button color="primary"
                    onClick={this.onSave}>{'Submit'}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Employees;
