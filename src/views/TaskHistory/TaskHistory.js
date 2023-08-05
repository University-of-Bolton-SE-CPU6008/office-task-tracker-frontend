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
  Table
} from "reactstrap";
import './TaskHistory.scss';
import * as ProductService from '../../services/product';
import * as CommonFunc from "../../utils/CommonFunc";
import Loader from "../../components/Loader/loading";
import {DateRangePickerComponent} from '@syncfusion/ej2-react-calendars';

class TaskHistory extends Component {
  state = {
    list: [],
    loading: true,
  }

  async componentDidMount() {
    await this.getAllProductRequest()
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

  render() {
    const {list, loading} = this.state;
    const listData = list.map((items, i) => (
      <tr key={i}>
        {/*<td>{items.date}</td>*/}
        <td>{items.orderNo}</td>
        <td>{items.itemName}</td>
        <td>{items.qty}</td>
        <td>{items.price}</td>
        <td>{items.expectedDate}</td>
        <td className={'btn-align'}>
          {items.address}
        </td>
        <td className={'btn-align'}>
          {items.country}
        </td>
        <td className={'btn-align'}>
          <Button color="success" className="btn-pill shadow"
            // onClick={() => this.onTogglePopup(items)}
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
                    <InputGroup>
                      <Input type="text" name="searchTxt" placeholder="Search Order Number"/>
                      <InputGroupAddon addonType="append">
                        <Button type="button" color="primary" className={"shadow"}
                                onClick={() => {
                                }}>Search</Button>
                      </InputGroupAddon>
                    </InputGroup>

                  </Col>


                  <div style={{position: 'absolute', right: 20}}>
                    <DateRangePickerComponent
                      placeholder={'Select Date Range'}
                      enablePersistence={false}
                      format="dd-MMM-yy"
                      width={'100%'}
                      allowEdit={false}
                    />
                  </div>
                </div>

              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm" className={"Table"}>
                  <thead>
                  <tr>
                    {/*<th>Date</th>*/}
                    <th>Order No</th>
                    <th>Product Name</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Expected Date</th>
                    <th>Delivery Address</th>
                    <th>Country</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>{listData}</tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Loader
          asLoading={loading}
        />
      </div>
    );
  }
}

export default TaskHistory;
