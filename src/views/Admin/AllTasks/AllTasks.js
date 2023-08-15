import React, {Component} from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col, Form, FormGroup,
  Input,
  InputGroup,
  InputGroupAddon, Label, Modal, ModalBody, ModalFooter,
  ModalHeader,
  Row,
  Table
} from "reactstrap";
import '../../AddTask/AddTask.scss'

class AllTasks extends Component {
  state = {
    list: [
      {
        id: 1,
        date: '25/06/2023',
        username: 'kavinda',
        projectName: 'Synapse',
        numOfHours: '10.25',
        taskType: 'Bug Fixes',
        description: 'asd',
        comment: 'test',
        designation: 'Mobile Developer'
      },
      {
        id: 2,
        date: '30/06/2023',
        username: 'dilshan',
        projectName: 'Fitzky',
        numOfHours: '6.15',
        taskType: 'Developments',
        description: 'asd',
        comment: 'test',
        designation: 'UI Developer'
      }
    ],
    modelVisible: false,
    selectedProject: {}
  }

  onTogglePopup = (item) => {
    this.setState({modelVisible: !this.state.modelVisible})
    if (item) {
      this.setState({selectedProject: item})
    }

  }

  render() {
    const listData = this.state.list.map((items, i) => (
      <tr key={i}>
        <td className={"DescriptionTD"}>{items.date}</td>
        <td className={"DescriptionTD"}>{items.username}</td>
        <td className={"DescriptionTD"}>{items.projectName}</td>
        <td className={"DescriptionTD"}>{items.numOfHours}</td>
        <td className={"DescriptionTD"}>{items.taskType}</td>
        <td className={'btn-align'}>
          <Button color="primary" className="btn-pill shadow" onClick={() => this.onTogglePopup(items)}>View</Button>
        </td>
      </tr>
    ));
    return (
      <div>
        <Row>
          <Col>
            <Card>
              {/*<CardHeader>*/}
              {/*  <div style={{display: "flex"}}>*/}
              {/*    <Col md="4" xs={8}>*/}
              {/*      <InputGroup>*/}
              {/*        <Input type="text" name="searchTxt" placeholder="Search..." value={searchTxt.value}/>*/}
              {/*        <InputGroupAddon addonType="append">*/}
              {/*          <Button type="button" color="primary" className={"shadow"}*/}
              {/*                  onClick={() => {*/}
              {/*                  }}>Search</Button>*/}
              {/*        </InputGroupAddon>*/}
              {/*      </InputGroup>*/}
              {/*    </Col>*/}

              {/*  </div>*/}

              {/*</CardHeader>*/}
              <CardBody>
                <Table hover bordered striped responsive size="sm" className={"Table"}>
                  <thead>
                  <tr>
                    <th>Date</th>
                    <th>Employee Name</th>
                    <th>Project Name</th>
                    <th>Number Of Hours</th>
                    <th>Task Type</th>
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
          <ModalHeader toggle={this.onTogglePopup}>{`Project Name : ${this.state.selectedProject.projectName}`} <br/>
            <span className="font-sm">{this.state.selectedProject.designation}</span></ModalHeader>

          <ModalBody className="pl-5 pr-5">
            <Form>
              <FormGroup row>
                <Label sm={3}>Select the date</Label>
                <Col sm={4}>
                  <Input type="text" name="date" value={this.state.selectedProject.date} disabled={true}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Task description</Label>
                <Col sm={9}>
                  <Input type="textarea" name="description" placeholder="Description"
                         value={this.state.selectedProject.description} disabled={true}/>
                </Col>
              </FormGroup>

              {this.state.selectedProject.numOfHours && (
                <FormGroup row>
                  <Label sm={3}>Number of hours</Label>
                  <Row className="pl-3">
                    <Col sm={3}>
                      <Input type="text" name="hours" placeholder="Hours"
                             value={this.state.selectedProject.numOfHours.split('.')[0]} disabled={true}/>
                    </Col>
                    <Col sm={3} className="pl-0 ml-0">
                      <Input type="text" name="minutes" placeholder="Minutes"
                             value={this.state.selectedProject.numOfHours.split('.')[1]} disabled={true}/>
                    </Col>
                  </Row>

                </FormGroup>
              )}


              <FormGroup row>
                <Label sm={3}>Task type</Label>
                <Col sm={5}>
                  <Input type="text" name="date" value={this.state.selectedProject.taskType} disabled={true}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Comment</Label>
                <Col sm={9}>
                  <Input type="textarea" name="comment" placeholder="Comments"
                         value={this.state.selectedProject.comment} disabled={true}/>
                </Col>
              </FormGroup>
            </Form>


          </ModalBody>

          <ModalFooter>
            <Button color="danger" onClick={this.onTogglePopup}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
  );
  }
  }

  export default AllTasks;
