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
import {BASE_URL} from "../../constance/Constance";
import './AddTask.scss';
import * as ProductService from '../../services/product';
import * as CommonFunc from '../../utils/CommonFunc';
import Loader from "../../components/Loader/loading";
import {StorageStrings} from "../../constance/StorageStrings";
import swal from "sweetalert";
import {AppSwitch} from "@coreui/react";
import Dropzone from "react-dropzone";
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
    editEnabled: false,

    drop: true,
    src: null,
    imgBase64: '',
    asImageEdit: false,
    dropdownOpen: false,
    productId: '',
    productName: '',
    description: '',
    unitPrice: '',
    selectedCategory: '',
    qty: 0,
    status: false,
    category: [],
  }

  async componentDidMount() {
    // await this.getAllCategories();
    // await this.getAllProducts();
  }

  getAllCategories = async () => {
    await ProductService.getAllCategory()
      .then(response => {
        let list = [];
        if (response.success) {
          response.data.map((items) => {
            list.push({
              label: items.name,
              value: items.id
            })
          })
          this.setState({category: list})
        } else {
          CommonFunc.notifyMessage(response.message);
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  getAllProducts = async () => {

    this.setState({loading: true})
    await ProductService.getAllProduct()
      .then(response => {
        let list = [];

        if (response.success) {

          response.data.map((items) => {
            list.push({
              productId: items.id,
              productName: items.name,
              description: items.description,
              status: items.status,
              unitPrice: items.price,
              image: items.imageUrl,
              category: items.categoryId,
              qty: items.qty
            })
          });
          this.setState({list: list, loading: false});
        } else {
          CommonFunc.notifyMessage(response.message);
          this.setState({loading: false});
        }
      })
      .catch(error => {
        CommonFunc.notifyMessage(error.message, error.status);
        this.setState({loading: false});
      })
  }

  onTextChange = (event) => {
    let name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  onTogglePopup = (data, isEdit) => {
    this.setState({modelVisible: !this.state.modelVisible})
    if (isEdit) {
      this.setState({
        productId: data.productId,
        productName: data.productName,
        description: data.description,
        unitPrice: data.unitPrice,
        image: data.image,
        selectedCategory: data.category,
        editEnabled: true,
        src: data.image,
        qty: data.qty,
        status: data.status
      })
    } else {
      this.setState({
        productId: '',
        productName: '',
        description: '',
        unitPrice: '',
        image: '',
        selectedCategory: '',
        src: null,
        editEnabled: false,
        qty: 0,
        status: false
      })
      this.setState({editEnabled: false})
    }

  }

  onSaveProduct = async () => {

    if (!Validations.textFieldValidator(this.state.productName, 1)) {
      CommonFunc.notifyMessage('Please enter product name', 0);
    } else if (!Validations.textFieldValidator(this.state.description, 1)) {
      CommonFunc.notifyMessage('Please enter product description', 0);
    } else if (!Validations.numberValidator(this.state.unitPrice)) {
      CommonFunc.notifyMessage('Please enter valid price', 0);
    } else if (!Validations.textFieldValidator(this.state.description, 1)) {
      CommonFunc.notifyMessage('Please enter product description', 0);
    } else if (!Validations.textFieldValidator(this.state.description, 1)) {
      CommonFunc.notifyMessage('Please enter product description', 0);
    } else if (this.state.selectedCategory.length === 0) {
      CommonFunc.notifyMessage('Please select category', 0);
    } else {
      this.setState({loading: true})
      const data = {
        name: this.state.productName,
        description: this.state.description,
        imageUrl: this.state.src,
        price: this.state.unitPrice,
        qty: 15,
        status: true,
        categoryId: this.state.selectedCategory
      }
      await ProductService.saveProduct(data)
        .then(res => {
          if (res.success) {
            this.onTogglePopup()
            this.getAllProducts()
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

  async deleteHandler(id) {
    swal({
      title: "Are you sure?",
      text: "Are you sure you want to delete this product?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      className: "swal-footer"
    })
      .then((willDelete) => {
        if (willDelete) {
          this.onDeleteProduct(id)
        }
      });
  }

  onUpdateProduct = async (item, type) => {

    if (!Validations.textFieldValidator(this.state.productName.trim(), 1)) {
      CommonFunc.notifyMessage('Please enter product name', 0);
    } else if (!Validations.textFieldValidator(this.state.description.trim(), 1)) {
      CommonFunc.notifyMessage('Please enter product description', 0);
    } else if (!Validations.numberValidator(this.state.unitPrice.toString())) {
      CommonFunc.notifyMessage('Please enter valid price', 0);
    } else if (!Validations.textFieldValidator(this.state.description.trim(), 1)) {
      CommonFunc.notifyMessage('Please enter product description', 0);
    } else if (!Validations.textFieldValidator(this.state.description.trim(), 1)) {
      CommonFunc.notifyMessage('Please enter product description', 0);
    } else if (this.state.selectedCategory.length === 0) {
      CommonFunc.notifyMessage('Please select category', 0);
    } else {
      let data = {}

      if (type === 'STATUS') {
        data = {
          id: item.productId,
          name: item.productName,
          description: item.description,
          imageUrl: item.image,
          price: item.unitPrice,
          qty: item.qty,
          status: !item.status,
          categoryId: item.categoryId
        }
      } else {
        data = {
          id: this.state.productId,
          name: this.state.productName,
          description: this.state.description,
          imageUrl: this.state.src,
          price: this.state.unitPrice,
          qty: this.state.qty,
          status: this.state.status ? 1 : 0,
          categoryId: this.state.selectedCategory
        }
      }
      this.setState({loading: true})
      await ProductService.updateProduct(data)
        .then(res => {
          if (res.success) {
            if (type === undefined) {
              this.onTogglePopup()
            }
            CommonFunc.notifyMessage('Product record has been updated!', 1);
            this.getAllProducts()
          } else {
            CommonFunc.notifyMessage(res.message, 0);
            this.setState({loading: false})
          }
        })
        .catch(err => {
          console.log(err)
          this.setState({loading: false})
        })
    }


  }

  onDeleteProduct = async (id) => {
    this.setState({loading: true})
    await ProductService.deleteProduct(id)
      .then(res => {
        if (res.success) {
          CommonFunc.notifyMessage('Product has been deleted!', 1);
          this.getAllProducts()
        } else {
          CommonFunc.notifyMessage(res.message, 0);
          this.setState({loading: false})
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({loading: false})
      })
  }

  handleDrop = acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({src: reader.result, drop: false, asImageEdit: true})
      );
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({src: reader.result, drop: false, asImageEdit: true})
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  render() {
    const {totalElements, list, searchTxt, modelVisible, loading, editEnabled, asImageEdit, asSearch, drop, dropdownOpen, imgBase64, selectedPage, src, selectedCategory, category, description, productName, unitPrice, involveProjectVisible} = this.state;

    const listData = list.map((items, i) => (
      <tr key={i}>
        <td className={"DescriptionTD"}>{items.projectName}</td>
        <td className={"DescriptionTD"}>{items.designation}</td>
        <td className={'btn-align'}>
          <Button color="dark" className="btn-pill shadow" onClick={() => this.onTogglePopup(items, true)}>Add
            Task</Button>
          <Button color="danger" className="btn-pill shadow"
                  onClick={() => this.deleteHandler(items.productId)}>Edit</Button>
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

        <Modal size={'sm'} isOpen={involveProjectVisible} toggle={()=>this.setState({involveProjectVisible:!this.state.involveProjectVisible})}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.onTogglePopup}>Involved to new Project</ModalHeader>
          <ModalBody className="pl-5 pr-5">
            <FormGroup row className="pl-5 pr-5">
              <Label>Select the project</Label>
              <Input type="select" name="selectedCategory" onChange={this.onTextChange}>
                <option value="" disabled={selectedCategory !== ""}>Please select category</option>
                {category.map(item => (
                  <option value={item.value} selected={item.value === selectedCategory}>{item.label}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup row className="pl-5 pr-5">
              <Label>Select Designation</Label>
              <Input type="select" name="selectedCategory" onChange={this.onTextChange}>
                <option value="" disabled={selectedCategory !== ""}>Please select category</option>
                {category.map(item => (
                  <option value={item.value} selected={item.value === selectedCategory}>{item.label}</option>
                ))}
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary"
              onClick={()=>this.setState({involveProjectVisible:false})}
            >
              Done
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modelVisible} toggle={this.onTogglePopup}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.onTogglePopup}>{'Project Name : Project 01'}</ModalHeader>

          <ModalBody className="pl-5 pr-5">
            <Form>
              <FormGroup row>
                <Label sm={3}>Select the date</Label>
                <Col sm={4}>
                  <Input type="date" name="selectedCategory" onChange={this.onTextChange}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>Main Features</Label>
                <Col sm={9}>
                  <Input type="select" name="selectedCategory" onChange={this.onTextChange}>
                    <option value="" disabled={selectedCategory !== ""}>Please select category</option>
                    {category.map(item => (
                      <option value={item.value} selected={item.value === selectedCategory}>{item.label}</option>
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
                    <Input type="text" name="hours" placeholder="Hours" value={productName}
                           onChange={this.onTextChange}/>
                  </Col>
                  <Col sm={3} className="pl-0 ml-0">
                    <Input type="text" name="minutes" placeholder="Minutes" value={productName}
                           onChange={this.onTextChange}/>
                  </Col>
                </Row>

              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Task type</Label>
                <Col sm={5}>
                  <Input type="select" name="selectedCategory" onChange={this.onTextChange}>
                    <option value="" disabled={selectedCategory !== ""}>Please select category</option>
                    {category.map(item => (
                      <option value={item.value} selected={item.value === selectedCategory}>{item.label}</option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>Comment</Label>
                <Col sm={9}>
                  <Input type="textarea" name="comment" placeholder="Description" value={description}
                         onChange={this.onTextChange}/>
                </Col>
              </FormGroup>
            </Form>


          </ModalBody>

          <ModalFooter>
            <Button color="secondary" onClick={this.onTogglePopup}>Cancel</Button>
            <Button color="primary"
                    onClick={!editEnabled ? this.onSaveProduct : this.onUpdateProduct}>{!editEnabled ? 'Edit' : 'Submit'}</Button>
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
