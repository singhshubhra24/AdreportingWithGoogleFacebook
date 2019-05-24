declare var require: any;
import { Component, OnInit } from '@angular/core';
import { GoogleAdsService } from '../service/reporting_ads.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { dashboardDataModel} from "./dataModel"
var CanvasJS = require('../../app/canvasjs.min.js');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  dashboardData  = dashboardDataModel;
    public TOTAL_IMPR:any;
  public TOTAL_CLICKS : any;
  //public FBCPC : any;
  //public GCPC : any;
  constructor(private GoogleDataService : GoogleAdsService,private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
     this.spinnerService.show();
     this.GoogleDataService.dashboardAPI('common').subscribe(result =>{
     let newData=result.result.impressions.map(function(item) { 
    delete item.x; 
    return item; 
});
//console.log("DashboardComponent graph...",JSON.stringify(newData))
    //  let chart1 = new CanvasJS.Chart("chartContainer1", {
    //   animationEnabled: true,
    //    backgroundColor: "transparent",
    //   theme: "light2",
    //   title:{
    //     text: ""
    //   },
    //   axisX:{
    //         interval: 1,
    //         intervalType: "month"
    //       },
    //   axisY:{
    //     includeZero: false
    //   },
    //   data: [{        
    //     type: "line",   
    //     color: "#009192",    
    //     dataPoints: newData
    //   }]
    // });
    // chart1.render();
     })
    
    
       this.GoogleDataService.dashboardAPI('common').subscribe(result =>{
       //console.log("dashboardAPI CHUNKS......................")
    var totalIMP= result.result.impressions.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
          var totalCLICKS= result.result.clicks.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
         // console.log("dashboardAPI CHUNKS......................",totalIMP)
          this.TOTAL_IMPR=totalIMP;
          this.TOTAL_CLICKS=totalCLICKS;
    //        let chart2 = new CanvasJS.Chart("chartContainer2", {
    //   animationEnabled: true,
    //    backgroundColor: "transparent",
    //   theme: "light2",
    //   title:{
    //     text: ""
    //   },
    //   axisX:{
    //     valueFormatString: "DD MMM",
    //     crosshair: {
    //       enabled: true,
    //       snapToDataPoint: true
    //     }
    //   },
    //   axisY: {
    //     title: "",
    //     crosshair: {
    //       enabled: true
    //     }
    //   },
    //   toolTip:{
    //     shared:true
    //   },  
    //   legend:{
    //     cursor:"pointer",
    //     verticalAlign: "bottom",
    //     horizontalAlign: "left",
    //     dockInsidePlotArea: true,
    //     // itemclick: toogleDataSeries
    //   },
    //   data: [{
    //     type: "line",
    //     showInLegend: true,
    //     name: "Total Impressions",
    //     markerType: "square",
    //     xValueFormatString: "DD MMM, YYYY",
    //     color: "#6394e6",
    //     dataPoints: this.TOTAL_IMPR
    //   },
    //   {
    //     type: "line",
    //     showInLegend: true,
    //     name: "Total Clicks",
    //     lineDashType: "line",
    //     color: "#6394e6",
    //     dataPoints: this.TOTAL_CLICKS
    //   }]
    // });
    //  chart2.render();
  })
    this.GoogleDataService.commonFilter('last_30_days','DASBOARDCHUNKS_CPC').subscribe(result =>{
       let FBCPC=[];
       let GCPC=[];
      result.CHUNKS.result.forEach(function(ele){
        
        if(ele.platform=='facebook'){
          FBCPC.push({
            label:'',
            y:ele.cpc
          })
        }else{
         GCPC.push({
            label:'',
            y:ele.cpc
          })
        }

        })
    // let chart3 = new CanvasJS.Chart("chartContainer3", {
    //    backgroundColor: "transparent",
    //   animationEnabled: true,
    //   title:{
    //     text: ""
    //   },  
    //   axisY: {
    //     title: "",
    //     titleFontColor: "#4F81BC",
    //     lineColor: "#4a84e3",
    //     labelFontColor: "#4F81BC",
    //     tickColor: "#4F81BC"
    //   },
    //   axisY2: {
    //     title: "",
    //     titleFontColor: "#C0504E",
    //     lineColor: "#415d9b",
    //     labelFontColor: "#C0504E",
    //     tickColor: "#C0504E"
    //   },  
    //   toolTip: {
    //     shared: true
    //   },
    //   legend: {
    //     cursor:"pointer",
    //     // itemclick: toggleDataSeries
    //   },
    //   data: [{
    //     type: "column",
    //     name: "Google",
    //     color: "#4c86e3",
    //     showInLegend: true, 
    //     dataPoints:GCPC
    //   },
    //   {
    //     type: "column", 
    //     name: "Facebook",
    //     color: "#415d9b",
    //     axisYType: "secondary",
    //     showInLegend: true,
    //     dataPoints:FBCPC
    //   }]
    // });
    // chart3.render();
    })
    // this.GoogleDataService.commonFilter('last_30_days','DASBOARDCHUNKS').subscribe(result =>{
    //           //console.log("========================????",JSON.stringify(result.CHUNKS.totalSUM))
    //    let chart6 = new CanvasJS.Chart("chartContainer6", {
    //   animationEnabled: true,
    //   title:{
    //     text: "",
    //     horizontalAlign: "left"
    //   },
      
    //   data: [{
    //     type: "doughnut",
    //     startAngle: 60,
    //     //innerRadius: 60,
    //     indexLabelFontSize: 17,
    //     indexLabel: "",
    //     toolTipContent: "",
    //     dataPoints: [
    //       { y: result.CHUNKS.totalSUM[0].impressions, label: "", color: "#8fa2d3" },
          
    //       { y: result.CHUNKS.totalSUM[1].impressions, label: "", color: "#37b5d5"}
    //     ]
    //   }]
    // })
    // chart6.render();
    //   })
   

    
    // let chartCTR = new CanvasJS.Chart("chartContainerCTR", {
    //   animationEnabled: true,
    //    backgroundColor: "transparent",
    //   theme: "light2",
    //   title:{
    //     text: ""
    //   },
    //   axisX:{
    //         interval: 1,
    //         intervalType: "month"
    //       },
    //   axisY:{
    //     includeZero: false
    //   },
    //   data: [{        
    //     type: "line",   
    //     color: "#009192",    
    //     dataPoints: [
    //       { y: 450, label: "" },
    //       { y: 414 , label: ""},
    //       { y: 520 , label: "" },
    //       { y: 460, label: "" },
    //       { y: 450, label: "" },
    //       { y: 500, label: "" },
    //       { y: 480 , label: "" },
          
    //     ]
    //   }]
    // });
    
    
    // let chartConversion = new CanvasJS.Chart("chartContainerConversion", {
    //    backgroundColor: "transparent",
    //   animationEnabled: true,
    //   title:{
    //     text: ""
    //   },  
    //   axisY: {
    //     title: "",
    //     titleFontColor: "#4F81BC",
    //     lineColor: "#4a84e3",
    //     labelFontColor: "#4F81BC",
    //     tickColor: "#4F81BC"
    //   },
    //   axisY2: {
    //     title: "",
    //     titleFontColor: "#C0504E",
    //     lineColor: "#415d9b",
    //     labelFontColor: "#C0504E",
    //     tickColor: "#C0504E"
    //   },  
    //   toolTip: {
    //     shared: true
    //   },
    //   legend: {
    //     cursor:"pointer",
    //     // itemclick: toggleDataSeries
    //   },
    //   data: [{
    //     type: "column",
    //     name: "Google",
    //     color: "#4c86e3",
    //     showInLegend: true, 
    //     dataPoints:[
    //       { label: "Sun", y: 266.21 },
    //       { label: "Mon", y: 302.25 },
    //       { label: "Tue", y: 157.20 },
    //       { label: "Wed", y: 148.77 },
    //       { label: "Thu", y: 101.50 },
    //       { label: "Fri", y: 95.8 },
    //       { label: "Sat", y: 97.8 }
    //     ]
    //   },
    //   {
    //     type: "column", 
    //     name: "Facebook",
    //     color: "#415d9b",
    //     axisYType: "secondary",
    //     showInLegend: true,
    //     dataPoints:[
    //       { label: "Sun", y: 10.46 },
    //       { label: "Mon", y: 2.27 },
    //       { label: "Tue", y: 3.99 },
    //       { label: "Wed", y: 4.45 },
    //       { label: "Thu", y: 2.92 },
    //       { label: "Fri", y: 2.96 },
    //       { label: "Sat", y: 3.1 }
    //     ]
    //   }]
    // });
    
    setTimeout(()=>this.spinnerService.hide(),57000)
  }

}
