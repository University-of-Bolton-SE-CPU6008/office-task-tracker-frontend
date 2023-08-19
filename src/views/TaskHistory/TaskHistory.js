import React, {Component} from 'react';
import {
  Badge,
  Button, ButtonDropdown,
  Card,
  CardBody,
  CardHeader,
  Col, DropdownItem, DropdownMenu, DropdownToggle,
  Input,
  InputGroup,
  InputGroupAddon, Modal, ModalFooter, ModalHeader,
  Row,
  Table, Label, Alert, ModalBody, Form, FormGroup
} from "reactstrap";
import './TaskHistory.scss';
import * as TasksService from '../../services/tasks';
import * as CommonFunc from "../../utils/CommonFunc";
import Loader from "../../components/Loader/loading";
import {DateRangePickerComponent} from '@syncfusion/ej2-react-calendars';
import {DesignationTypes, ProjectsList, TaskType} from "../../constance/Constance";
import * as ProjectService from "../../services/projects";

class TaskHistory extends Component {
  state = {
    list: [],
    loading: false,
    modelVisible: false,
    taskId: '',
    date: '',
    description: '',
    hours: '',
    minutes: '',
    comment: '',
    taskType: TaskType,
    projects: ProjectsList,
    designationTypes: DesignationTypes,
    selectedTaskType: '',
    selectedDesignation: '',
    selectedMainFeature: '',
    selectedProject: {},
    totalHours:0
  }

  async componentDidMount() {
    this.getAllTasks()
    this.getAllProjects()
    this.getAllTaskTypes()
  }

  getAllTasks = () => {
    this.setState({loading: true})
    const data = {"all": 1}
    TasksService.getAllTasks(data)
      .then(res => {
        const list = [];
        if (res.success) {
          res.data.task_list && res.data.task_list.map(item => {
            list.push({
              id: item.id,
              date: item.date,
              username: 'dilshan',
              projectName: item.project.name,
              numOfHours: Math.floor(item.number_of_hour) !== Number(item.number_of_hour) ? item.number_of_hour : Number(item.number_of_hour).toFixed(2),
              taskType: item.task_type.type_name,
              description: item.task_detail,
              comment: item.comment,
              designation: 'UI Developer'
            })
          })

          let val = 0;
          for (let i = 0; i < list.length; i++) {
            val = Number(val) + Number(list[i].numOfHours)
          }
          this.setState({loading: false, list: list,totalHours:val})
        } else {
          CommonFunc.notifyMessage(res.message);
          this.setState({loading: false})
        }
      })
  }


  getAllTaskTypes = () => {
    const data = {"all": 1}
    TasksService.getAllTasksType(data)
      .then(res => {
        if (res.success) {
          const list = [];
          res.data.task_type_list.map(item => {
            list.push({
              label: item.type_name,
              value: item.id
            })
          })
          this.setState({taskType: list})
        }
      })
  }

  getAllProjects = () => {
    const data = {"all": 1}
    ProjectService.getAllProjects(data)
      .then(res => {
        if (res.success) {
          const list = [];
          res.data.project_list.map((item) => {
            list.push({
              value: item.id,
              label: item.name,
            })
          })
          this.setState({projects: list})
        }
      })
  }

  onTogglePopup = (item) => {
    this.setState({modelVisible: !this.state.modelVisible})
    if (item) {
      this.setState({selectedProject: item})
    }

  }

  render() {
    const {list, loading, comment, date, description, designationTypes, hours, minutes, modelVisible, projects, selectedDesignation, selectedMainFeature, selectedProject, selectedTaskType, taskId, taskType} = this.state;
    const listData = list.map((items, i) => (
      <tr key={i}>
        <td>{items.date}</td>
        <td>{items.projectName}</td>
        <td>{items.designation}</td>
        <td>{items.taskType}</td>
        <td>{items.numOfHours}</td>
        <td className={'btn-align'}>
          <Button color="success" className="btn-pill shadow"
                  onClick={() => this.onTogglePopup(items)}
          >View More</Button>
        </td>
      </tr>
    ));

    return (
      <div>

        <br/>

        <Row>
          <Col>
            <Card>
              <CardHeader>
                <div style={{display: "flex", alignItems: 'center'}}>
                  <Col md="4" xs={8}>
                    <DateRangePickerComponent
                      placeholder={'Select Date Range'}
                      enablePersistence={false}
                      format="dd-MMM-yy"
                      width={'100%'}
                      allowEdit={false}
                    />
                  </Col>
                  <Col md="3" xs={8}>
                    <InputGroup>
                      <Input type="select" name="selectedCategory">
                        <option value="" disabled={false}>Select Project</option>
                        <option value={1} selected={false}>sample</option>
                      </Input>
                    </InputGroup>
                  </Col>
                  <Col md="4" xs={8}>
                    <InputGroup>
                      <Input type="select" name="selectedCategory">
                        <option value="" disabled={false}>Select Task Type</option>
                        <option value={1} selected={false}>sample</option>
                      </Input>
                    </InputGroup>

                  </Col>


                  {/*<div style={{position: 'absolute', right: 20}}>*/}
                  {/*  <DateRangePickerComponent*/}
                  {/*    placeholder={'Select Date Range'}*/}
                  {/*    enablePersistence={false}*/}
                  {/*    format="dd-MMM-yy"*/}
                  {/*    width={'100%'}*/}
                  {/*    allowEdit={false}*/}
                  {/*  />*/}
                  {/*</div>*/}
                </div>

              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm" className={"Table"}>
                  <thead>
                  <tr>
                    <th>Date</th>
                    <th>Project Name</th>
                    <th>Designation</th>
                    <th>Task Type</th>
                    <th>Hours</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>{listData}</tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={8}/>
          <Col lg={4}>
            <Alert color="dark">
              <Row className="align-items-center justify-content-center">
                <Label className="font-weight-bold mr-1 font-2xl">Total:</Label>
                <Label className="font-weight-bold font-2xl text-danger">{this.state.totalHours}</Label>
                <Label className="font-weight-bold font-2xl ml-1">Hours</Label>
              </Row>
            </Alert>
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

        {this.state.loading && (
          <Loader
            asLoading={this.state.loading}
          />
        )}
      </div>
    );
  }
}

export default TaskHistory;
