
declare var require: any;
import { Component, OnInit } from '@angular/core';
import { FbdatatestService } from '../service/fbdatatest.service';
import { HttpClient } from '@angular/common/http';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpErrorResponse } from '@angular/common/http';
var CanvasJS = require('../../app/canvasjs.min.js');
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-facebookads',
  templateUrl: './facebookads.component.html',
  styleUrls: ['./facebookads.component.css']
})
export class FacebookadsComponent implements OnInit {
  public ADS_OVERVIEW :any;
  public CAMPAIGNVIEW :any;
  public CHUNKS :any;
  public IMP_GRAPH :any;
  public ENG_GRAPH :any;
  isApps : boolean = true;
  isCards : boolean = true;
  highChartContainer = Highcharts;
  chartContainer0Options : any;
  highChartContainer1 = Highcharts;
  chartContainer1Options : any;
  isLoaded : boolean = false;

  constructor(private FBdataService : FbdatatestService,private spinnerService: Ng4LoadingSpinnerService) {} 

  chunksFilter(event:any){
    var tags=event.target.value.split(',')
    this.FBdataService.chunksFilter(tags[0],tags[1]).subscribe(result =>{
        if(result.status_code == 200){
        console.log("chunksFilter>>>>>>>>")
        if(tags[1]=='cpm'){
          this.CHUNKS[0].title=result.result[0].title;
          this.CHUNKS[0].rate = result.result[0].rate;
          this.CHUNKS[0].growthRate = result.result[0].growthRate;
          this.CHUNKS[0].prev = result.result[0].prev;
        }
        if(tags[1]=='frequency'){
          this.CHUNKS[1].title=result.result[0].title;
          this.CHUNKS[1].rate = result.result[0].rate;
          this.CHUNKS[1].growthRate = result.result[0].growthRate;
          this.CHUNKS[1].prev = result.result[0].prev;
        }
        if(tags[1]=='ctr'){
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
        if(tags[1]=='cpc'){
          this.CHUNKS[4].title=result.result[0].title;
          this.CHUNKS[4].rate = result.result[0].rate;
          this.CHUNKS[4].growthRate = result.result[0].growthRate;
          this.CHUNKS[4].prev = result.result[0].prev;
        }
        if(tags[1]=='link_clicks'){
          this.CHUNKS[5].title=result.result[0].title;
          this.CHUNKS[5].rate = result.result[0].rate;
          this.CHUNKS[5].growthRate = result.result[0].growthRate;
          this.CHUNKS[5].prev = result.result[0].prev;
        }
      }
        else {
            this.isApps = false;
        }  
    })
  }

  commonFilter(event:any){
    var tags=event.target.value.split(',')
    this.FBdataService.commonFilter(tags[0],tags[1]).subscribe(result =>{
    console.log("commonFilter>>>>>>>>>>>>",result.result[0])
      if(tags[1]=='CAMPAIGNS_OVERVIEW'){
          this.CAMPAIGNVIEW=result.result;
      }if(tags[1]=='ADS_OVERVIEW'){
          this.ADS_OVERVIEW=result.result;
        }
        if(tags[1]=='IMPGRAPH'){
          console.log("IMPGRAPH>>>>>>>>>")
          this.IMP_GRAPH=result.result[0];
          this.bindImpressionChart(this.IMP_GRAPH);        
        }
        if(tags[1]=='POSTENG_GRAPH'){
          console.log("POSTENG_GRAPH>>>>>>>>>")
          this.ENG_GRAPH=result.result[1];
          this.bindPostManagementChart(this.ENG_GRAPH)
        }
    })
  }


  ngOnInit() {
    this.spinnerService.show();
    this.FBdataService.commonFilter('today','nofilter').subscribe(result =>{    
      if(result.status_code==200){
        console.log("result.CAMPAIGN_CHUNKS: ",result.CAMPAIGN_CHUNKS)
        this.CAMPAIGNVIEW=result.CAMPAIGNS_OVERVIEW;
        this.ADS_OVERVIEW=result.CAMPAIGNS_OVERVIEW;
        this.CHUNKS=result.CAMPAIGN_CHUNKS;
        this.IMP_GRAPH=result.GRAPH_DATA[0];
        this.ENG_GRAPH=result.GRAPH_DATA[1];
        this.bindImpressionChart(result.GRAPH_DATA[0])
        this.bindPostManagementChart(result.GRAPH_DATA[1])   
        this.isLoaded = true;        
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