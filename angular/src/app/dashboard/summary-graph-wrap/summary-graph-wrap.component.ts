declare var require: any;
import { Component, OnInit } from '@angular/core';
import { GoogleAdsService } from '../../service/reporting_ads.service';

import { dashboardDataModel} from "../dataModel"
var CanvasJS = require('../../../app/canvasjs.min.js');
@Component({
  selector: 'app-summary-graph-wrap',
  templateUrl: './summary-graph-wrap.component.html',
  styleUrls: ['./summary-graph-wrap.component.css']
})
export class SummaryGraphWrapComponent implements OnInit {
 dashboardData  = dashboardDataModel;
  public FIRST_GRAPH=[];
  public SECOND_GRAPH=[];
  public list: any;
  public selected : any;
  public count : any;
  public isClicked = [];
  public items=[];
  public isMaxed : any;
  public isCommon : any;
  public commonFilter =[];
  public isActive = false;
   //constructor(private GoogleDataService : GoogleAdsService) {};
  constructor(private GoogleDataService : GoogleAdsService) {
    this.list = [
       'Impressions',
       'Clicks',
       'CPC',
       'CTR%',
       'Spends',
       'Video Views',
       'CPV',
       'Installs',
       'eCPI',
       'ROI 14d'
    ]; 
    this.isMaxed=true;
  }
  activeButton(){
    this.isActive = true
  }
select(item) {
  console.log("IF==============isCommon: ",this.isCommon)
  if(this.isCommon){
    if(this.items.length<=1){ 
    this.isMaxed=true;
    if(this.items.includes(item)){
      this.items = this.items.filter(e => e !== item)
    }else{
      if(this.items.length>=1){
        this.isMaxed=false;
      }else{
       this.items.push(item)
      }  
    }
  }else{
    this.isMaxed=false; 
  }
    }else{
       console.log("ELSE==============isCommon: ",this.isCommon)
      if(this.items.length<=2){ 
    this.isMaxed=true;
    if(this.items.includes(item)){
      this.items = this.items.filter(e => e !== item)
    }else{
      if(this.items.length>=2){
        this.isMaxed=false;
      }else{
       this.items.push(item)
      }  
    }
  }else{
    this.isMaxed=false; 
  }
    }
 
  console.log("Selected value: ",this.items)
  this.generateGraph(this.items)
   console.log(this.commonFilter,"===============================SELECT Filter: ",this.items)
};
 


metricsFilter(data){
  console.log(this.commonFilter,"Clicks GF Filter: ",this.items)
  if(this.commonFilter.includes(data)){
      this.commonFilter = this.commonFilter.filter(e => e !== data)
    }else{
      this.commonFilter.push(data);
    }
    if(this.commonFilter.length>=2){
      this.isCommon=true;
      this.items=[];
this.generateGraph(this.commonFilter);
      this.isMaxed=false;
    }else{
      this.isCommon=false;
    }
  console.log("====================Calling",this.commonFilter)  
}

generateGraph(graphData){
let first_graph;
let second_graph;
let first_name='';
let second_name='';
    console.log("====================Calling generateGraph"+graphData)
   this.GoogleDataService.dashboardAPI('common').subscribe(result =>{
    if(graphData.length==2){
		if(graphData.includes('Impressions') && graphData.includes('Clicks')){
       		first_graph= result.result.impressions.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       second_graph= result.result.clicks.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       this.FIRST_GRAPH=first_graph;
        this.SECOND_GRAPH=second_graph;
         first_name='Impressions';
          second_name='Clicks';
      }

      if(graphData.includes('Impressions') && graphData.includes('CPC')){
       first_graph= result.result.impressions.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       second_graph= result.result.cpc.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       this.FIRST_GRAPH=first_graph;
        this.SECOND_GRAPH=second_graph;
         first_name='Impressions';
          second_name='CPC';
      }
      if(graphData.includes('Impressions') && graphData.includes('CTR%')){
       first_graph= result.result.impressions.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       second_graph= result.result.ctr.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       this.FIRST_GRAPH=first_graph;
        this.SECOND_GRAPH=second_graph;
         first_name='Impressions';
          second_name='CTR';
         
      }
       if(graphData.includes('Impressions') && graphData.includes('Spends')){
       first_graph= result.result.impressions.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       second_graph= result.result.ctr.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       this.FIRST_GRAPH=first_graph;
        this.SECOND_GRAPH=second_graph;
         first_name='Impressions';
          second_name='Spends';
      }

      if(graphData.includes('Clicks') && graphData.includes('CPC')){
       first_graph= result.result.clicks.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       second_graph= result.result.cpc.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       this.FIRST_GRAPH=first_graph;
       this.SECOND_GRAPH=second_graph;
       first_name='Clicks';
       second_name='CPC';
      }

      if(graphData.includes('Clicks') && graphData.includes('CTR%')){
       first_graph= result.result.clicks.map((data)=>{
            data.x = new Date(data.x)
            return data;
          });
       second_graph= result.result.ctr.map((data)=>{
            data.x = new Date(data.x)
            return data;
          });
       this.FIRST_GRAPH=first_graph;
       this.SECOND_GRAPH=second_graph;
       first_name='Clicks';
       second_name='CTR';

      }
if(graphData.includes('Clicks') && graphData.includes('Spends')){
       first_graph= result.result.clicks.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       second_graph= result.result.spend.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       this.FIRST_GRAPH=first_graph;
        this.SECOND_GRAPH=second_graph;
        first_name='Clicks';
          second_name='Spends';
      }
      if(graphData.includes('CPC') && graphData.includes('CTR%')){
       first_graph= result.result.cpc.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       second_graph= result.result.ctr.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       this.FIRST_GRAPH=first_graph;
        this.SECOND_GRAPH=second_graph;
        first_name='CPC';
          second_name='CTR';

      }

 if(graphData.includes('CPC') && graphData.includes('Spends')){
       first_graph= result.result.cpc.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       second_graph= result.result.spend.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       this.FIRST_GRAPH=first_graph;
        this.SECOND_GRAPH=second_graph;
        first_name='CPC';
          second_name='Spends';
      }
       if(graphData.includes('CTR%') && graphData.includes('Spends')){
       first_graph= result.result.ctr.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       second_graph= result.result.spend.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
       this.FIRST_GRAPH=first_graph;
        this.SECOND_GRAPH=second_graph;
        first_name='CTR';
          second_name='Spends';
      }
      
         
    }else{

     if(graphData.includes('Impressions')){
       first_graph= result.result.impressions.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
      }
     if(graphData.includes('Spends')){
       first_graph= result.result.spend.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
      }
     if(graphData.includes('Clicks')){
        first_graph= result.result.clicks.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
      }
     if(graphData.includes('CPC')){
           first_graph= result.result.cpc.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
      }
      if(graphData.includes('CTR%')){
           first_graph= result.result.ctr.map((data)=>{
              data.x = new Date(data.x)
              return data;
          });
        }
        this.FIRST_GRAPH=first_graph;
        this.SECOND_GRAPH=[]
        first_name=graphData[0];
      }
    console.log("======================",JSON.stringify(first_graph))
          //this.FIRST_GRAPH=first_graph;
         // this.SECOND_GRAPH=second_graph;
         /* this.TOTAL_SPEND=totalSpend;
          this.TOTAL_CTR=totalCTR;
          this.TOTAL_CPC=totalCPC;
          this.TOTAL_CLICKS=totalCLICKS*/
          let chart2 = new CanvasJS.Chart("chartContainer2", {
      animationEnabled: true,
       backgroundColor: "transparent",
      theme: "light2",
      title:{
        text: ""
      },
      axisX:{
        valueFormatString: "DD MMM",
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      axisY: {
        title: "",
        crosshair: {
          enabled: true
        }
      },
      toolTip:{
        shared:true
      },  
      legend:{
        cursor:"pointer",
        verticalAlign: "bottom",
        horizontalAlign: "left",
        dockInsidePlotArea: true,
        // itemclick: toogleDataSeries
      },
      data: [{
        type: "line",
        showInLegend: true,
        name: first_name,
        markerType: "square",
        xValueFormatString: "DD MMM, YYYY",
        color: "#6394e6",
        dataPoints: this.FIRST_GRAPH
      },
      {
        type: "line",
        showInLegend: true,
        name: second_name,
        lineDashType: "line",
        color: "#6394e6",
        dataPoints: this.SECOND_GRAPH
      }]
    });
     chart2.render();
  })
  }
  ngOnInit() {


  }

}