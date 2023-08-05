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
  Table
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
    list: [],
    selectedPage: 1,
    totalElements: 0,
    searchTxt: {
      value: '',
      valid: true
    },
    modelVisible: false,
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
    await this.getAllCategories();
    await this.getAllProducts();
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
    }else if (!Validations.textFieldValidator(this.state.description, 1)){
      CommonFunc.notifyMessage('Please enter product description', 0);
    }else if (!Validations.numberValidator(this.state.unitPrice)){
      CommonFunc.notifyMessage('Please enter valid price', 0);
    }else if (!Validations.textFieldValidator(this.state.description, 1)){
      CommonFunc.notifyMessage('Please enter product description', 0);
    }else if (!Validations.textFieldValidator(this.state.description, 1)){
      CommonFunc.notifyMessage('Please enter product description', 0);
    }else if (this.state.selectedCategory.length === 0){
      CommonFunc.notifyMessage('Please select category', 0);
    }else {
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
    }else if (!Validations.textFieldValidator(this.state.description.trim(), 1)){
      CommonFunc.notifyMessage('Please enter product description', 0);
    }else if (!Validations.numberValidator(this.state.unitPrice.toString())){
      CommonFunc.notifyMessage('Please enter valid price', 0);
    }else if (!Validations.textFieldValidator(this.state.description.trim(), 1)){
      CommonFunc.notifyMessage('Please enter product description', 0);
    }else if (!Validations.textFieldValidator(this.state.description.trim(), 1)){
      CommonFunc.notifyMessage('Please enter product description', 0);
    }else if (this.state.selectedCategory.length === 0){
      CommonFunc.notifyMessage('Please select category', 0);
    }else {
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
    const {totalElements, list, searchTxt, modelVisible, loading, editEnabled, asImageEdit, asSearch, drop, dropdownOpen, imgBase64, selectedPage, src, selectedCategory, category, description, productName, unitPrice} = this.state;

    const listData = list.map((items, i) => (
      <tr key={i}>
        <td className={"DescriptionTD"}>{items.productName}</td>
        <td className={"DescriptionTD"}>{items.description}</td>
        <td className={'btn-align'}>{items.unitPrice}</td>
        <td className={'btn-align'}><a href={items.image} target="_blank"><i className="icon-picture"></i></a></td>
        <td className={'btn-align'}>
          <AppSwitch variant={'pill'} label color={'success'} size={'sm'} checked={items.status}
                     onChange={() => this.onUpdateProduct(items, 'STATUS')}/>
        </td>
        <td className={'btn-align'}>
          <Button color="dark" className="btn-pill shadow" onClick={() => this.onTogglePopup(items, true)}>Edit</Button>
          <Button color="danger" className="btn-pill shadow"
                  onClick={() => this.deleteHandler(items.productId)}>Delete</Button>
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
                    <Button color="primary mr-2" className="btn-pill shadow" onClick={this.onTogglePopup}>Add
                      New</Button>
                    <Button color="primary" className="btn-pill shadow">Export CSV</Button>
                  </div>

                </div>

              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm" className={"Table"}>
                  <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Unit Price (LKR)</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>{listData}</tbody>
                </Table>

              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={modelVisible} toggle={this.onTogglePopup}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.onTogglePopup}>{editEnabled ? 'Edit Product' : 'Add Product'}</ModalHeader>

          <ModalBody>
            <Col xs="12" sm="12">
              <Card>
                <CardHeader>
                  <strong>{!editEnabled ? 'Add Product' : 'Edit Product'}</strong>
                </CardHeader>
                <CardBody>

                  <FormGroup row className="my-0">
                    <Col xs="6" className="mt-2">

                      {asImageEdit ?
                        <div className={"EditableStyle"} onClick={() => this.setState({asImageEdit: false, src: null})}>
                          <img src={src} alt="" width={'100%'} height={'100%'}/>
                          <i className="cui-cloud-upload icons font-2xl"></i>
                        </div>
                        :
                        src ?
                          <div className={"EditableStyle"}
                               onClick={() => this.setState({asImageEdit: false, src: null})}>
                            <img src={src} alt="img" width={'100%'} height={'100%'}/>
                          </div>
                          :
                          <div className={"App"}>
                            <Dropzone
                              onDrop={this.handleDrop}
                              accept="image/*"
                              minSize={1024}
                              maxSize={3072000}
                            >
                              {({
                                  getRootProps,
                                  getInputProps,
                                  isDragActive,
                                  isDragAccept,
                                  isDragReject
                                }) => {
                                const additionalClass = isDragAccept
                                  ? "accept"
                                  : isDragReject
                                    ? "reject"
                                    : "";

                                return (
                                  <div
                                    {...getRootProps({
                                      className: `dropzone ${additionalClass}`
                                    })}
                                  >
                                    <input {...getInputProps()} onChange={this.onSelectFile}/>
                                    <span>{isDragActive ? "📂" : "📁"}</span>
                                    <p>Drag'n'drop images</p>
                                  </div>
                                );
                              }}
                            </Dropzone>
                          </div>
                      }

                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label htmlFor="vat">Product Name</Label>
                        <Input type="text" name="productName" placeholder="Product Name" value={productName}
                               onChange={this.onTextChange}/>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="vat">Description</Label>
                        <Input type="textarea" name="description" placeholder="Description" value={description}
                               onChange={this.onTextChange}/>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="vat">Unit Price</Label>
                        <Input type="number" name="unitPrice" placeholder="Unit Price" value={unitPrice}
                               onChange={this.onTextChange}/>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="vat">Category</Label>
                        <Input type="select" name="selectedCategory" onChange={this.onTextChange}>
                          <option value="" disabled={selectedCategory !== ""}>Please select category</option>
                          {category.map(item => (
                            <option value={item.value} selected={item.value === selectedCategory}>{item.label}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </FormGroup>

                </CardBody>
              </Card>
            </Col>
          </ModalBody>

          <ModalFooter>
            <Button color="secondary" onClick={this.onTogglePopup}>Cancel</Button>
            <Button color="primary"
                    onClick={!editEnabled ? this.onSaveProduct : this.onUpdateProduct}>{editEnabled ? 'Edit' : 'Add'}</Button>
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
