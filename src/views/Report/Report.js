import React, {Component} from 'react';
import {Card, Col, Row} from "reactstrap";
import CanvasJSReact from "../../components/Chart/canvasjs.react";
import * as TasksService from '../../services/tasks'
import * as CommonFunc from "../../utils/CommonFunc";
import Loader from "../../components/Loader/loading";

// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Report extends Component {

  state = {
    loading: false,
    list:[]
  }

  componentDidMount() {
    this.getTaskReports()
  }

  getTaskReports = () => {
    this.setState({loading: true})
    TasksService.getTaskReport()
      .then(res => {
        console.log(res)
        if (res.success) {
          const list=[];
          res.data.map(item=>{
            list.push({
              label: item.date, y: Number(item.num_of_hours)
            })
          })
          this.setState({loading: false,list})
        } else {
          CommonFunc.notifyMessage(res.message);
          this.setState({loading: false})
        }
      })
  }

  render() {
    const options = {
      title: {
        // text: "Basic Column Chart"
      },
      data: [
        {
          // Change type to "doughnut", "line", "splineArea", etc.
          type: "column",
          dataPoints: this.state.list
        }
      ],
      axisY: {
        title: "Working Hours",
      },
      axisX: {
        title: "Date",
      },
    }
    return (
      <div>
        <Row>
          <Col>
            <Card className="container pt-5">
              <CanvasJSChart options={options}/>
            </Card>
          </Col>
        </Row>
        {this.state.loading && (
          <Loader
            asLoading={this.state.loading}
          />
        )}
      </div>
    );
  }
}

export default Report;
