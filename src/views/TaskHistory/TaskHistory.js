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
import * as ProductService from '../../services/product';
import * as CommonFunc from "../../utils/CommonFunc";
import Loader from "../../components/Loader/loading";
import {DateRangePickerComponent} from '@syncfusion/ej2-react-calendars';
import {DesignationTypes, ProjectsList, TaskType} from "../../constance/Constance";

class TaskHistory extends Component {
  state = {
    list: [
      {
        id:1,
        date:'2023/06/06',
        projectName:'Project 01',
        designation:'Mobile Developer',
        mainFeatures:'Bug Fixes',
        taskType:'Development',
        hours:'2.30'
      },
      {
        id:2,
        date:'2023/06/07',
        projectName:'Project 02',
        designation:'Backend Developer',
        mainFeatures:'Bug Fixes',
        taskType:'Development',
        hours:'5.30'
      }
    ],
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
    mainFeatures: [],
    selectedTaskType: '',
    selectedProject: '',
    selectedDesignation: '',
    selectedMainFeature: '',
  }

  async componentDidMount() {
    // await this.getAllProductRequest()
  }

  getAllProductRequest = async () => {
    await ProductService.getAllProductRequest()
      .then(res => {
        const list = [];
        if (res.success) {
          res.datas.map(item => {
            list.push({
              orderNo: item.orderId,
              itemName: item.productName,
              qty: item.qty,
              price: item.price,
              expectedDate: item.expectedDate.split('T')[0],
              country: item.country.toUpperCase(),
              address:item.deliveryAddress
            })
          })
          this.setState({loading: false, list: list})
        } else {
          CommonFunc.notifyMessage(res.message);
          this.setState({loading: false})
        }
      })
      .catch(err => {
        this.setState({loading: false})
      })
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
      comment:'',
    })
    if (item){
      this.setState({selectedProject:item})
    }

  }

  render() {
    const {list, loading, comment, date, description, designationTypes, hours, mainFeatures, minutes, modelVisible, projects, selectedDesignation, selectedMainFeature, selectedProject, selectedTaskType, taskId, taskType } = this.state;
    const listData = list.map((items, i) => (
      <tr key={i}>
        <td>{items.date}</td>
        <td>{items.projectName}</td>
        <td>{items.designation}</td>
        <td>{items.mainFeatures}</td>
        <td>{items.taskType}</td>
        <td>{items.hours}</td>
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
                    <th>Main Feature</th>
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
                <Label className="font-weight-bold font-2xl text-danger">5.30</Label>
                <Label className="font-weight-bold font-2xl ml-1">Hours</Label>
              </Row>
            </Alert>
          </Col>
        </Row>

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

        <Loader
          asLoading={loading}
        />
      </div>
    );
  }
}

export default TaskHistory;
