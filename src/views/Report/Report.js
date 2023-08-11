import React, {Component} from 'react';
import {Card, Col, Row} from "reactstrap";
import CanvasJSReact from "../../components/Chart/canvasjs.react";

// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Report extends Component {
  render() {
    const options = {
      title: {
        // text: "Basic Column Chart"
      },
      data: [
        {
          // Change type to "doughnut", "line", "splineArea", etc.
          type: "column",
          dataPoints: [
            {label: "2023/06/07", y: 10},
            {label: "2023/06/08", y: 6},
            {label: "2023/06/09", y: 8},
            {label: "2023/06/10", y: 3},
            {label: "2023/06/11", y: 12}
          ]
        }
      ],
      axisY:{
        title:"Working Hours",
      },
      axisX:{
        title:"Date",
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
      </div>
    );
  }
}

export default Report;
