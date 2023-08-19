import React, {Component} from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Dropdown, DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Modal, ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
  Form
} from "reactstrap";
import {Link} from "react-router-dom";
import {BASE_URL, DesignationTypes, ProjectsList, TaskType} from "../../constance/Constance";
import './AddTask.scss';
import * as TasksService from '../../services/tasks';
import * as ProjectService from '../../services/projects';
import * as DesignationService from '../../services/designation';
import * as EmployeeService from '../../services/employee';
import * as CommonFunc from '../../utils/CommonFunc';
import Loader from "../../components/Loader/loading";
import {StorageStrings} from "../../constance/StorageStrings";
import swal from "sweetalert";
import {AppSwitch} from "@coreui/react";
import * as Validations from "../../validation/Validation";

class AddTask extends Component {
  state = {
    list: [],
    selectedPage: 1,
    totalElements: 0,
    searchTxt: {
      value: '',
      valid: true
    },
    modelVisible: false,
    involveProjectVisible: false,
    loading: false,
    asSearch: false,

    taskId: '',
    date: '',
    description: '',
    hours: '',
    minutes: '',
    comment: '',

    taskType: [],
    projects: [],
    designationTypes: [],
    mainFeatures: [],
    needToInvolveProj: [],
    selectedTaskType: '',
    selectedProject: {},
    selectedInvolveProject: '',
    selectedDesignation: {},
    selectedMainFeature: '',
    employeeId: '',
    today: ""
  }

  async componentDidMount() {

    const date = new Date();

    let currentDay = String(date.getDate()).padStart(2, '0');

    let currentMonth = String(date.getMonth() + 1).padStart(2, "0");

    let currentYear = date.getFullYear();


    let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;


    this.setState({today: currentDate.toString()})

    this.getAllProjects()
    this.getAllInvolveProjects()
    // this.getAllTasks()

    this.getAllTaskTypes()
    await this.getEmployeeDetails()
  }

  getEmployeeDetails = async () => {
    const userId = await localStorage.getItem(StorageStrings.USERID);
    EmployeeService.getEmployeeFindById(userId)
      .then(res => {
        if (res.success) {
          this.setState({employeeId: res.data.user.employee.id})
          this.getAllDesignations(res.data.user.employee.designation_id)
        }
      })
  }

  getAllInvolveProjects = () => {
    ProjectService.getAllProjectWithoutInvolve()
      .then(res => {
        if (res.success) {
          const list = [];
          res.data.project_list.map((item) => {
            list.push({
              value: item.id,
              label: item.name
            })
          })
          this.setState({needToInvolveProj: list})
        }
      })
  }

  // getAllTasks = () => {
  //   this.setState({loading: true})
  //   const data = {"all": 1}
  //   TasksService.getAllTasks(data)
  //     .then(res => {
  //       if (res.success) {
  //         this.setState({loading: false})
  //       } else {
  //         CommonFunc.notifyMessage(res.message);
  //         this.setState({loading: false})
  //       }
  //     })
  // }

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

  getAllDesignations = (id) => {
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

            if (id === item.id) {
              this.setState({
                selectedDesignation: {
                  label: item.designation_name,
                  value: item.id
                }
              })
            }
          })
          this.setState({designationTypes: list})
        }
      })
  }

  getAllProjects = () => {
    const data = {"all": 1}
    this.setState({loading: true})
    ProjectService.getAllProjects(data)
      .then(res => {
        if (res.success) {
          const list = [];
          res.data.project_list.map((item) => {
            list.push({
              projectId: item.id,
              projectName: item.name
            })
          })
          this.setState({loading: false, list})
        } else {
          CommonFunc.notifyMessage(res.message);
          this.setState({loading: false})
        }
      })
  }

  onTextChange = (event) => {
    let name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  onTextChange2 = (event) => {
    let name = event.target.name;

    const regex = /^-?\d+\.?\d*$/;
    if ((event.target.value).match(regex) || (event.target.value).length === 0) {
      this.setState({
        [name]: event.target.value,
      });
    }

  }

  onTogglePopup = (item) => {
    this.setState({modelVisible: !this.state.modelVisible})
    this.setState({
      date: '',
      selectedMainFeature: '',
      description: '',
      hours: '',
      minutes: '',
      selectedTaskType: '',
      comment: '',
    })
    if (item) {
      this.setState({selectedProject: item})
    }

  }

  onSaveProduct = async () => {

    if (!Validations.textFieldValidator(this.state.date, 1)) {
      CommonFunc.notifyMessage('Please enter date', 0);
    } else if (!Validations.textFieldValidator(this.state.description, 1)) {
      CommonFunc.notifyMessage('Please enter task description', 0);
    } else if (!Validations.textFieldValidator(this.state.hours, 1)) {
      CommonFunc.notifyMessage('Please enter number of hours', 0);
    } else if (!Validations.textFieldValidator(this.state.selectedTaskType, 1)) {
      CommonFunc.notifyMessage('Please select task type', 0);
    } else {
      this.setState({loading: true})
      const data = {
        employee_id: Number(this.state.employeeId),
        project_id: this.state.selectedProject.projectId,
        task_type_id: Number(this.state.selectedTaskType),
        task_detail: this.state.description,
        date: this.state.date,
        number_of_hour: Number(`${this.state.hours}.${this.state.minutes.length > 0 ? this.state.minutes : '0'}`),
        comment: this.state.comment
      }

      await TasksService.createTask(data)
        .then(res => {
          if (res.success) {
            this.onTogglePopup()
            this.setState({loading: false})
            CommonFunc.notifyMessage("Task added successful!", 1);
          } else {
            CommonFunc.notifyMessage(res.message);
            this.setState({loading: false})
          }
        })
        .catch(err => {
          console.log(err)
          this.setState({loading: false})
        })
    }


  }


  onInvolveProject = async () => {

    if (!Validations.textFieldValidator(this.state.selectedInvolveProject, 1)) {
      CommonFunc.notifyMessage('Please select involve project you wish', 0);
    } else {
      this.setState({loading: true})
      const data = {
        project_id: Number(this.state.selectedInvolveProject),
        employer_id: this.state.employeeId
      }
      await EmployeeService.involveByEmployee(data)
        .then(res => {
          if (res.success) {
            this.setState({involveProjectVisible: false,selectedInvolveProject:''})
            CommonFunc.notifyMessage('Project has been involved!', 1);
            this.getAllProjects()
          } else {
            CommonFunc.notifyMessage("Project involve failed!", 0);
            this.setState({loading: false})
          }
        })
    }
  }

  render() {
    const {totalElements, list, searchTxt, modelVisible, loading, asSearch, selectedPage, selectedMainFeature, mainFeatures, description, involveProjectVisible, taskType, projects, selectedProject, selectedTaskType, designationTypes, needToInvolveProj, selectedDesignation, hours, minutes, comment, selectedInvolveProject} = this.state;

    const listData = list.map((items, i) => (
      <tr key={i}>
        <td className={"DescriptionTD"}>{items.projectName}</td>
        <td className={"DescriptionTD"}>{selectedDesignation.label}</td>
        <td className={'btn-align'}>
          <Button color="dark" className="btn-pill shadow" onClick={() => this.onTogglePopup(items, true)}>Add
            Task</Button>
          {/*<Button color="danger" className="btn-pill shadow"*/}
          {/*        onClick={() => this.deleteHandler(items.taskId)}>Edit</Button>*/}
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
                  <Col md="4" xs={8}>
                    <InputGroup>
                      <Input type="text" name="searchTxt" placeholder="Search..." value={searchTxt.value}/>
                      <InputGroupAddon addonType="append">
                        <Button type="button" color="primary" className={"shadow"}
                                onClick={() => {
                                }}>Search</Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>

                  <div style={{position: 'absolute', right: 30}}>
                    <Button color="primary mr-2" className="btn-pill shadow"
                            onClick={() => this.setState({involveProjectVisible: !this.state.involveProjectVisible})}>
                      Involve Project
                    </Button>
                  </div>

                </div>

              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm" className={"Table"}>
                  <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Designation</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>{listData}</tbody>
                </Table>

              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal size={'sm'} isOpen={involveProjectVisible}
               toggle={() => this.setState({involveProjectVisible: !this.state.involveProjectVisible})}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={() => this.setState({
            involveProjectVisible: !this.state.involveProjectVisible,
            selectedInvolveProject: ""
          })}>Involved
            to new Project</ModalHeader>
          <ModalBody className="pl-5 pr-5">
            <FormGroup row className="pl-5 pr-5">
              <Label>Select the project</Label>
              <Input type="select" name="selectedInvolveProject" onChange={this.onTextChange}>
                <option value="" disabled={selectedInvolveProject !== ""}>Select Project</option>
                {needToInvolveProj.map(item => (
                  <option value={item.value} selected={item.value === selectedInvolveProject}>{item.label}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup row className="pl-5 pr-5">
              <Label>Designation</Label>
              <Input type="text" name="selectedDesignation" disabled={true} value={selectedDesignation.label}/>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary"
                    onClick={() => {
                      this.setState({
                        involveProjectVisible: !this.state.involveProjectVisible,
                        selectedInvolveProject: ""
                      })
                    }}
            >
              Close
            </Button>
            <Button color="primary"
                    onClick={() => this.onInvolveProject()}
            >
              Done
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modelVisible} toggle={this.onTogglePopup}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.onTogglePopup}>{`Project Name : ${selectedProject.projectName}`}</ModalHeader>

          <ModalBody className="pl-5 pr-5">
            <Form>
              <FormGroup row>
                <Label sm={3}>Select the date</Label>
                <Col sm={4}>
                  <Input type="date" name="date" onChange={this.onTextChange} max={this.state.today}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Task description</Label>
                <Col sm={9}>
                  <Input type="textarea" name="description" placeholder="Description" value={description}
                         onChange={this.onTextChange}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Number of hours</Label>
                <Row className="pl-3">
                  <Col sm={3}>
                    <Input type="text" name="hours" placeholder="Hours" maxlength="2"
                           value={hours}
                           onChange={this.onTextChange2}/>
                  </Col>
                  <Col sm={3} className="pl-0 ml-0">
                    <Input type="text" name="minutes" placeholder="Minutes" maxlength="2"
                           value={minutes}
                           onChange={this.onTextChange2}/>
                  </Col>
                </Row>

              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Task type</Label>
                <Col sm={5}>
                  <Input type="select" name="selectedTaskType" onChange={this.onTextChange}>
                    <option value="" disabled={selectedTaskType !== ""}>Select Task</option>
                    {taskType.map(item => (
                      <option value={item.value} selected={item.value === selectedTaskType}>{item.label}</option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Comment</Label>
                <Col sm={9}>
                  <Input type="textarea" name="comment" placeholder="Comments" value={comment}
                         onChange={this.onTextChange}/>
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

        {loading && (
          <Loader
            asLoading={loading}
          />
        )}
      </div>
    );
  }
}

export default AddTask;
