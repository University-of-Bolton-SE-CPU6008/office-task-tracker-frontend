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
import * as CommonFunc from '../../utils/CommonFunc';
import Loader from "../../components/Loader/loading";
import {StorageStrings} from "../../constance/StorageStrings";
import swal from "sweetalert";
import {AppSwitch} from "@coreui/react";
import * as Validations from "../../validation/Validation";

class AddTask extends Component {
  state = {
    list: [
      {
        projectId: 1,
        projectName: 'Project 01',
        designation: 'Frontend Developer'
      },
      {
        projectId: 2,
        projectName: 'Project 02',
        designation: 'Backend Developer'
      }
    ],
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

    taskType: TaskType,
    projects: ProjectsList,
    designationTypes: DesignationTypes,
    mainFeatures: [],
    selectedTaskType: '',
    selectedProject: '',
    selectedDesignation: '',
    selectedMainFeature: '',
  }

  async componentDidMount() {
    // this.getAllTasks()
  }

  getAllTasks = () => {
    this.setState({loading: true})
    const data = {"all": 1}
    TasksService.getAllTasks(data)
      .then(res => {
        if (res.success) {
          this.setState({loading: false})
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
          res.data.map(item => ({
            label:item.type_name,
            value:item.id
          }))
          this.setState({taskType:list})
        }
      })
  }


  onTextChange = (event) => {
    let name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
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
    } else if (!Validations.textFieldValidator(this.state.selectedTaskType, 1)) {
      CommonFunc.notifyMessage('Please select main feature', 0);
    } else if (!Validations.textFieldValidator(this.state.description, 1)) {
      CommonFunc.notifyMessage('Please enter task description', 0);
    } else if (!Validations.textFieldValidator(this.state.hours, 1)) {
      CommonFunc.notifyMessage('Please enter number of hours', 0);
    } else if (!Validations.textFieldValidator(this.state.selectedTaskType, 1)) {
      CommonFunc.notifyMessage('Please select task type', 0);
    } else {
      this.setState({loading: true})
      const data = {
        date: this.state.date,
        mainFeatures: this.state.selectedMainFeature,
        description: this.state.description,
        numberOfHours: this.state.hours + '.' + this.state.minutes.length > 0 ? this.state.minutes : 0,
        taskType: this.state.selectedTaskType,
        comment: this.state.comment
      }
      alert(JSON.stringify(data))
      // await TasksService.saveProduct(data)
      //   .then(res => {
      //     if (res.success) {
      //       this.onTogglePopup()
      //     } else {
      //       CommonFunc.notifyMessage(res.message);
      //       this.setState({loading: false})
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err)
      //     this.setState({loading: false})
      //   })
    }


  }

  // async deleteHandler(id) {
  //   swal({
  //     title: "Are you sure?",
  //     text: "Are you sure you want to delete this product?",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //     className: "swal-footer"
  //   })
  //     .then((willDelete) => {
  //       if (willDelete) {
  //         this.onDeleteProduct(id)
  //       }
  //     });
  // }

  // onDeleteProduct = async (id) => {
  //   this.setState({loading: true})
  //   await TasksService.deleteProduct(id)
  //     .then(res => {
  //       if (res.success) {
  //         CommonFunc.notifyMessage('Product has been deleted!', 1);
  //         this.getAllProducts()
  //       } else {
  //         CommonFunc.notifyMessage(res.message, 0);
  //         this.setState({loading: false})
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       this.setState({loading: false})
  //     })
  // }

  render() {
    const {totalElements, list, searchTxt, modelVisible, loading, asSearch, selectedPage, selectedMainFeature, mainFeatures, description, involveProjectVisible, taskType, projects, selectedProject, selectedTaskType, designationTypes, selectedDesignation, hours, minutes, comment} = this.state;

    const listData = list.map((items, i) => (
      <tr key={i}>
        <td className={"DescriptionTD"}>{items.projectName}</td>
        <td className={"DescriptionTD"}>{items.designation}</td>
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
          <ModalHeader toggle={() => this.setState({involveProjectVisible: !this.state.involveProjectVisible})}>Involved
            to new Project</ModalHeader>
          <ModalBody className="pl-5 pr-5">
            <FormGroup row className="pl-5 pr-5">
              <Label>Select the project</Label>
              <Input type="select" name="selectedProject" onChange={this.onTextChange}>
                <option value="" disabled={selectedProject !== ""}>Select Project</option>
                {projects.map(item => (
                  <option value={item.value} selected={item.value === selectedProject}>{item.label}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup row className="pl-5 pr-5">
              <Label>Select Designation</Label>
              <Input type="select" name="selectedDesignation" onChange={this.onTextChange}>
                <option value="" disabled={selectedDesignation !== ""}>Select designation</option>
                {designationTypes.map(item => (
                  <option value={item.value} selected={item.value === selectedDesignation}>{item.label}</option>
                ))}
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary"
                    onClick={() => this.setState({involveProjectVisible: false})}
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
                  <Input type="date" name="date" onChange={this.onTextChange}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>Main Features</Label>
                <Col sm={9}>
                  <Input type="select" name="selectedMainFeature" onChange={this.onTextChange}>
                    <option value="" disabled={selectedMainFeature !== ""}>Please select main feature</option>
                    {mainFeatures.map(item => (
                      <option value={item.value} selected={item.value === selectedMainFeature}>{item.label}</option>
                    ))}
                  </Input>
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
                    <Input type="number" name="hours" placeholder="Hours"
                           value={hours}
                           onChange={this.onTextChange}/>
                  </Col>
                  <Col sm={3} className="pl-0 ml-0">
                    <Input type="number" name="minutes" placeholder="Minutes"
                           value={minutes}
                           onChange={this.onTextChange}/>
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
