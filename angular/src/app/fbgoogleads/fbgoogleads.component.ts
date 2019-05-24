declare var require: any;
import { Component, OnInit } from '@angular/core';
import { facebookPageData} from "./dataModel"
var CanvasJS = require('../../app/canvasjs.min.js');


@Component({
  selector: 'app-fbgoogleads',
  templateUrl: './fbgoogleads.component.html',
  styleUrls: ['./fbgoogleads.component.css']
})
export class FbgoogleadsComponent implements OnInit {
  facebookPageData = facebookPageData;

  constructor() { }

  ngOnInit() {

    let self = this;
    setTimeout(function () {

      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        backgroundColor: "transparent",
        color: "#7b7b7b",
        title: {
          text: ""
        },
        axisX: {
          minimum: new Date('2015, 01, 25'),
          maximum: new Date('2017, 02, 15'),
          labelFontColor: "#7b7b7b",
          lineColor: "#7b7b7b",
          valueFormatString: "MMM YY"

        },
        axisY: {
          title: "",
          titleFontColor: "#ff7d00",
          labelFontColor: "#7b7b7b",
          lineColor: "#7b7b7b",
          suffix: "mn"
        },
        data: [{
          indexLabelFontColor: "darkSlateGray",
          name: "views",
          type: "area",
          backgroundColor: "transparent",
          yValueFormatString: "#,##0.0mn",
          color: "#fb7c02",
          fillOpacity: .3,
          lineColor: "#f3a262",
          dataPoints: facebookPageData.graphModelData[0].graphData
        }]
      });


      let chart2 = new CanvasJS.Chart("chartContainer2", {
        animationEnabled: true,
        backgroundColor: "transparent",
        title: {
          text: ""
        },
        axisY: {
          labelFontColor: "#7b7b7b",
          valueFormatString: "#0,.",
          lineColor: "#7b7b7b",
          suffix: "M"
        },
        axisX: {
          labelFontColor: "#7b7b7b",
          lineColor: "#7b7b7b",
          title: ""
        },
        toolTip: {
          shared: true
        },
        data: [{
          type: "stackedArea",
          showInLegend: true,
          fillOpacity: .3,
          toolTipContent: "<span style=\"color:#4F81BC\"><strong>{name}: </strong></span> {y}",
          color: "#fb7c02",
          lineColor: "#f3a262",
          name: "",
          dataPoints: facebookPageData.graphModelData[1].graphData
        }]
      });
      chart.render();
      chart2.render();

    }, 10)

  }

}
