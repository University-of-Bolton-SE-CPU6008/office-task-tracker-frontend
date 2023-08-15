import React, {Component} from 'react';
import '../../AddTask/AddTask.scss'
import {
  Button,
  Card,
  CardBody,
  Col,
  Row,
  Table,
  InputGroup,
  InputGroupAddon,
  CardHeader,
  Modal,
  ModalHeader, ModalBody, Form, Label, Input, FormGroup, ModalFooter
} from "reactstrap";
import {AppSwitch} from "@coreui/react";

class Projects extends Component {
  state = {
    list: [
      {
        id: 1,
        projectName: 'Synapse',
        status: true
      },
      {
        id: 2,
        projectName: 'Fitzky',
        status: false
      },
      {
        id: 1,
        projectName: 'Wedding Portal',
        status: true
      }
    ],
    selectedData: {},
    projectName: '',
    modelVisible: false,
    isEdit:false
  }

  onTextChange = (event) => {
    let name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  onTogglePopup = (item,isEdit) => {
    this.setState({modelVisible: !this.state.modelVisible, projectName: ''})
    if (item) {
      this.setState({selectedData: item})
    }
    if (isEdit){
      this.setState({isEdit})
    }

  }

  onSaveProduct = () => {

  }

  render() {
    const listData = this.state.list.map((items, i) => (
      <tr key={i}>
        <td className={"DescriptionTD"}>{items.projectName}</td>
        <td className={"DescriptionTD"}>
          <AppSwitch variant={'pill'} label color={'success'} size={'sm'} checked={items.status}/>
        </td>
        <td className={'btn-align'}>
          <Button color="primary" className="btn-pill shadow" onClick={() => this.onTogglePopup(items,true)}>Edit</Button>
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
                        Project</Button>
                    </InputGroup>
                  </Col>

                </div>

              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm" className={"Table"}>
                  <thead>
                  <tr>
                    <th>Project Name</th>
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
          <ModalHeader toggle={this.onTogglePopup}>{this.state.isEdit? 'Edit Project' : 'Create new project'}</ModalHeader>
          <ModalBody className="pl-5 pr-5">
            <Form>
              <FormGroup row>
                <Label sm={3}>Project Name</Label>
                <Col sm={6}>
                  <Input type="text" name="projectName" placeHolder={"Project Name"} onChange={this.onTextChange} value={this.state.selectedData.projectName}/>
                </Col>
              </FormGroup>
              <FormGroup row className="mt-4">
                <Label sm={3}>Status</Label>
                <Col sm={4}>
                  <AppSwitch variant={'pill'} label color={'success'} size={'lg'}  checked={this.state.selectedData.status}/>
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.onTogglePopup}>Cancel</Button>
            <Button color="primary"
                    onClick={this.onSaveProduct}>{'Submit'}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Projects;
