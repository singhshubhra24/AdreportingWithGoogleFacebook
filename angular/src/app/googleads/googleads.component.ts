declare var require: any;
import { Component, OnInit } from '@angular/core';
import { GoogleAdsService } from '../service/reporting_ads.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { facebookPageData} from "./dataModel"
var CanvasJS = require('../../app/canvasjs.min.js');
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-googleads',
  templateUrl: './googleads.component.html',
  styleUrls: ['./googleads.component.css']
})
export class GoogleadsComponent implements OnInit {
   CTRKEYBOARD :any;
   CAMPAIGNVIEW :any;
   CHUNKS :any; 
   IMP_GRAPH :any;
   ENG_GRAPH :any;
   isApps : boolean = true;
   isCards : boolean = true;
  facebookPageData = facebookPageData;
  highChartContainer = Highcharts;
  chartContainer0Options : any;
  highChartContainer1 = Highcharts;
  chartContainer1Options : any;
  isLoaded : boolean = false;
  constructor(private GoogleDataService : GoogleAdsService,private spinnerService: Ng4LoadingSpinnerService) {} 

  chunksFilter(event:any){
    var tags=event.target.value.split(',')
    this.GoogleDataService.chunksFilter(tags[0],tags[1]).subscribe(result =>{
    if(result.status_code == 200){
      if(tags[1]=='avgcpc'){
        this.CHUNKS[0].title=result.result[0].title;
        this.CHUNKS[0].rate = result.result[0].rate;
        this.CHUNKS[0].growthRate = result.result[0].growthRate;
        this.CHUNKS[0].prev = result.result[0].prev;
      }
      if(tags[1]=='conversions'){
        this.CHUNKS[1].title=result.result[0].title;
        this.CHUNKS[1].rate = result.result[0].rate;
        this.CHUNKS[1].growthRate = result.result[0].growthRate;
        this.CHUNKS[1].prev = result.result[0].prev;
      }
      if(tags[1]=='cost_conv'){
        this.CHUNKS[2].title=result.result[0].title;
        this.CHUNKS[2].rate = result.result[0].rate;
        this.CHUNKS[2].growthRate = result.result[0].growthRate;
        this.CHUNKS[2].prev = result.result[0].prev;
      }
      if(tags[1]=='spend'){
        this.CHUNKS[3].title=result.result[0].title;
        this.CHUNKS[3].rate = result.result[0].rate;
        this.CHUNKS[3].growthRate = result.result[0].growthRate;
        this.CHUNKS[3].prev = result.result[0].prev;
      }
    }else {
        this.isApps = false;
        }  
    })
  }

  commonFilter(event:any){
    var tags=event.target.value.split(',')
    this.GoogleDataService.commonFilter(tags[0],tags[1]).subscribe(result =>{
      if(tags[1]=='CAMPAIGNS_OVERVIEW'){
        this.CAMPAIGNVIEW=result.result;
      }
      if(tags[1]=='CTRKEYBOARD'){
        this.CTRKEYBOARD=result.result;
      }
      if(tags[1]=='IMPGRAPH'){
        this.IMP_GRAPH=result.result[0];
        // console.log(`On event function impression data ${JSON.stringify(this.IMP_GRAPH)}`);
        this.bindImpressionChart(this.IMP_GRAPH);        
      }
      if(tags[1]=='POSTENG_GRAPH'){
        this.ENG_GRAPH=result.result[1];
        // console.log(`On event function Clicks data ${JSON.stringify(this.ENG_GRAPH)}`);
        this.bindPostManagementChart(this.ENG_GRAPH);
      }
    })
  }

  defaultCampaignData(){
    this.GoogleDataService.commonFilter('today','nofilter').subscribe(result =>{
      if(result.status_code==200){
        this.CTRKEYBOARD=result.CAMPAIGNS_OVERVIEW;
        this.CAMPAIGNVIEW=result.CAMPAIGNS_OVERVIEW;
        this.CHUNKS=result.CAMPAIGN_CHUNKS;
        this.IMP_GRAPH=result.GRAPH_DATA[0];
        this.ENG_GRAPH=result.GRAPH_DATA[1];
      }
    })
  }
  ngOnInit() { 
    this.spinnerService.show();
    this.GoogleDataService.commonFilter('today','nofilter').subscribe(result =>{
      if(result.status_code==200){
        this.CTRKEYBOARD=result.CAMPAIGNS_OVERVIEW;
        this.CAMPAIGNVIEW=result.CAMPAIGNS_OVERVIEW;
        // console.log(`campaign data 102=====> ${JSON.stringify(this.CAMPAIGNVIEW)}`);
        this.CHUNKS=result.CAMPAIGN_CHUNKS;        
        // console.log(`campaign data 103=====> ${JSON.stringify(this.CHUNKS)}`);
        this.IMP_GRAPH=result.GRAPH_DATA[0];
        // console.log(`campaign data 105=====> ${JSON.stringify(this.IMP_GRAPH)}`);
        this.ENG_GRAPH=result.GRAPH_DATA[1];
        // console.log(`campaign data 107=====> ${JSON.stringify(this.ENG_GRAPH)}`);

        this.bindImpressionChart(this.IMP_GRAPH);
        
        this.bindPostManagementChart(this.ENG_GRAPH);
        setTimeout(()=>this.spinnerService.hide(),3000)
      }
    })
  }

  bindImpressionChart(data){
    this.chartContainer0Options = {
      title : '',
      credits: {
        enabled: false
      },
      xAxis: {
        visible : false,
        title: {
          enabled: false,
        }
      },
      yAxis: {
        visible : true,
        title: {
          enabled: false,
        }
      },
      tooltip : {
        shared : true,
        formatter: function () {
          var points = this.points;
            var pointsLength = points.length;
            var tooltipMarkup = '';
            var index;
            var totalValue = 0;
            for(index = 0; index < pointsLength; index += 1) {
              totalValue += Number(points[index].y);
              tooltipMarkup += '<span style="color:' + points[index].series.color + '">\u25CF</span> ' + points[index].series.name + ': <b>' + points[index].y  + '</b><br/>';
            }
            tooltipMarkup += ' Total : <b>' + totalValue  + '</b><br/>';
            return tooltipMarkup;
        }
      },
      plotOptions: {      
        series: {
            marker: {
                enabled: false
            }
        }
      },
      series: [{
        name : 'Current',
        type: 'area',
        data: data.graphData,
        zIndex: 2
      },
      {
        name : 'Previous',
        type: 'area',
        data: data.postGraphData,
        zIndex: 1
      }]
    };
  }

  bindPostManagementChart(data){
    this.chartContainer1Options = {
      title : '',
      credits: {
        enabled: false
      },
      xAxis: {
        visible : false,
        title: {
          enabled: false,
        }
      },
      yAxis: {
        visible : true,
        title: {
          enabled: false,
        }
      },
      tooltip : {
        shared : true,
        formatter: function () {
          var points = this.points;
            var pointsLength = points.length;
            var tooltipMarkup = '';
            var index;
            var totalValue = 0;
            for(index = 0; index < pointsLength; index += 1) {
              totalValue += Number(points[index].y);
              tooltipMarkup += '<span style="color:' + points[index].series.color + '">\u25CF</span> ' + points[index].series.name + ': <b>' + points[index].y  + '</b><br/>';
            }
            tooltipMarkup += ' Total : <b>' + totalValue  + '</b><br/>';
            return tooltipMarkup;
        }
      },
      plotOptions: {      
        series: {
            marker: {
                enabled: false
            }
        }
    },
      series: [
        {
          name : 'Current',
          type: 'area',
          data: data.graphData,
          zIndex: 2
        },
        {
          name : 'Previous',
          type: 'area',
          data: data.postGraphData,
          zIndex: 1
        },
      ]
    };   
  }
}
