declare var require: any;
import { Component, OnInit } from '@angular/core';
import { GoogleAdsService } from '../../service/reporting_ads.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner'
var CanvasJS= require('../../../app/canvasjs.min.js');
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-displayed-networks',
  templateUrl: './displayed-networks.component.html',
  styleUrls: ['./displayed-networks.component.css']
})
export class DisplayedNetworksComponent implements OnInit {
  public TOP_1_FB : any;
  public TOP_1_GAd: any;
  public TOP_2_FB : any;
  public TOP_2_GAd: any;
  public TOP_3_FB : any;
  public TOP_3_GAd: any;
  public TOP_4_FB : any;
  public TOP_4_GAd: any;
  public TOP_5_FB : any;
  public TOP_5_GAd: any;
  public googleData : any;
  public facebookData : any;
  public totalData : any;
  public actualValue : any;
  public clicks : any;
  public impressions : any;
  public spend : any;
  public cpc : any;
  public graphData : any;
  chart1 = Highcharts;
  chart1Options : any;
  chart2 = Highcharts;
  chart2Options : any;
  chart3 = Highcharts;
  chart3Options : any;
 
 constructor(private GoogleDataService : GoogleAdsService,private spinnerService: Ng4LoadingSpinnerService) {};
  chunksFilter(event:any){
    let types=event.target.value.split(',');
    console.log("types",types[0],types[1])
    if(event.target.value=='leads'){
      console.log("got ",event.target.value)
    }else{
      this.generateGrapg(types[0],types[1])
    }
  }

  facebookFilter(event:any){
    let types=event.target.value.split(',');
    console.log("types",types[0],types[1])
    if(event.target.value=='leads'){
      console.log("got ",event.target.value)
    }else{
      this.generateFacebookGraph(types[0])
    }
  }

  generateGrapg(type,order){
    console.log("CHUNKS FILTER FOR: ",type)
    this.GoogleDataService.commonFilter('last_30_days','DASBOARDCHUNKS').subscribe(result =>{
        console.log("=======================>",JSON.stringify(result.CHUNKS.totalSUM))
      if(type=='impressions'){
        this.impressions=parseInt(result.CHUNKS.totalSUM[0].impressions)+parseInt(result.CHUNKS.totalSUM[1].impressions)
        console.log("this.impressions",this.impressions)
        var graph_data=result.CHUNKS.result.map(function(item) {
          delete item.avgcpc
          item.y=parseInt(item.impressions)
          delete item.impressions
          delete item.budget
          delete item.ctr
          delete item.clicks
          delete item.cpc
          delete item.spend
          delete item.conversions
          delete item.date
          return item
          })
      }
      if(type=='clicks'){
        this.clicks=parseInt(result.CHUNKS.totalSUM[0].clicks)+parseInt(result.CHUNKS.totalSUM[1].clicks)
        console.log("===================>this.clicks",this.clicks)
        var graph_data=result.CHUNKS.result.map(function(item) {
          delete item.avgcpc
          item.y=parseInt(item.clicks)
          delete item.impressions
          delete item.budget
          delete item.ctr
          delete item.clicks
          delete item.cpc
          delete item.spend
          delete item.conversions
          delete item.date
          return item
          })
      }
      if(type=='spend'){
        this.spend=parseInt(result.CHUNKS.totalSUM[0].spend)+parseInt(result.CHUNKS.totalSUM[1].spend)
          console.log("===================>his.spend",this.spend)
          var graph_data=result.CHUNKS.result.map(function(item) {
          delete item.avgcpc
          item.y=parseInt(item.spend)
          delete item.impressions
          delete item.budget
          delete item.ctr
          delete item.clicks
          delete item.cpc
          delete item.spend
          delete item.conversions
          delete item.date
          return item
          })
      }
      if(type=='ctr'){
        var graph_data=result.CHUNKS.result.map(function(item) {
          delete item.avgcpc
          item.y=parseInt(item.ctr)
          delete item.impressions
          delete item.budget
          delete item.ctr
          delete item.clicks
          delete item.cpc
          delete item.spend
          delete item.conversions
          delete item.date
          return item
          })
      }
      if(type=='cpc'){
        this.cpc=parseInt(result.CHUNKS.totalSUM[0].cpc)+parseInt(result.CHUNKS.totalSUM[1].cpc)
          console.log("===================>",this.cpc)
          var graph_data=result.CHUNKS.result.map(function(item) {
          delete item.avgcpc
          item.y=parseInt(item.cpc)
          delete item.impressions
          delete item.budget
          delete item.ctr
          delete item.clicks
          delete item.cpc
          delete item.spend
          delete item.conversions
          delete item.date
          return item
          })
      }
      if(type=='avgcpc'){
        var graph_data=result.CHUNKS.result.map(function(item) {
          item.y=parseInt(item.avgcpc)
          delete item.avgcpc
          delete item.impressions
          delete item.budget
          delete item.ctr
          delete item.clicks
          delete item.cpc
          delete item.spend
          delete item.conversions
          delete item.date
          return item
          })
      }
      if(type=='conversions'){
        var graph_data=result.CHUNKS.result.map(function(item) {
          item.y=parseInt(item.conversions)
          delete item.avgcpc
          delete item.impressions
          delete item.budget
          delete item.ctr
          delete item.clicks
          delete item.cpc
          delete item.spend
          delete item.conversions
          delete item.date
          return item
          })
      }
      if(order=='TOP_1'){
        this.bindChart1(graph_data)
      }
      if(order=='TOP_2'){
        this.bindChart2(result.CHUNKS.totalSUM);
      }
    })
  }

  generateFacebookGraph(type){
    this.GoogleDataService.commonFilter('last_30_days','DASBOARDCHUNKS_CPC').subscribe(result =>{
      let FBCPC=[];
      let GCPC=[];
      result.CHUNKS.result.forEach(function(ele){ 
        let value = 0;      
        if(type=='impressions'){
          value = ele.impressions;
        }
        if(type=='clicks'){
          value = ele.clicks;
        }
        if(type=='spend'){
          value = ele.spend;
        }
        if(type=='ctr'){
          value = ele.ctr;
        }
        if(type=='cpc'){
          value = ele.cpc;
        }
        if(type=='avgcpc'){
          value = ele.avgcpc;
        }
        if(type=='conversions'){
          value = ele.conversions;
        }
       if(ele.platform=='facebook'){    
        FBCPC.push(Number(value))
       }
       if(ele.platform=='google'){ 
        GCPC.push(Number(value))
       }
      })
      this.bindChart3(FBCPC, GCPC)
    })
  }

  defaultChunks(){
    this.spinnerService.show();
    this.GoogleDataService.commonFilter('last_30_days','DASBOARDCHUNKS').subscribe(result =>{
    this.googleData=result.CHUNKS.totalSUM[0];
    console.log("DASBOARDCHUNKS==========>")
    this.graphData=result.CHUNKS.result;
    this.clicks=parseInt(result.CHUNKS.totalSUM[0].clicks)+parseInt(result.CHUNKS.totalSUM[1].clicks)
    this.impressions=parseInt(result.CHUNKS.totalSUM[0].impressions)+parseInt(result.CHUNKS.totalSUM[1].impressions)
    this.spend=parseInt(result.CHUNKS.totalSUM[0].spend)+parseInt(result.CHUNKS.totalSUM[1].spend)
    this.cpc=parseInt(result.CHUNKS.totalSUM[0].cpc)+parseInt(result.CHUNKS.totalSUM[1].cpc)
    this.totalData=parseInt(result.CHUNKS.googleTotal+result.CHUNKS.fbTotal)
    this.facebookData=parseInt(result.CHUNKS.totalSUM[1]);
    this.TOP_1_FB=parseInt(result.CHUNKS.totalSUM[1].clicks);
    this.TOP_1_GAd=parseInt(result.CHUNKS.totalSUM[0].clicks);
    this.TOP_2_FB=parseInt(result.CHUNKS.totalSUM[1].impressions);
    this.TOP_2_GAd=parseInt(result.CHUNKS.totalSUM[0].impressions);
    this.TOP_3_FB=parseInt(result.CHUNKS.totalSUM[1].spend);
    this.TOP_3_GAd=parseInt(result.CHUNKS.totalSUM[0].spend);
    this.TOP_4_FB=parseInt(result.CHUNKS.totalSUM[1].cpc) ? parseInt(result.CHUNKS.totalSUM[1].cpc) : 0;
    this.TOP_4_GAd=parseInt(result.CHUNKS.totalSUM[0].cpc) ? parseInt(result.CHUNKS.totalSUM[0].cpc) : 0;
    //this.TOP_5_FB=parseInt(result.CHUNKS.totalSUM[1].leads);
    //this.TOP_5_GAd=parseInt(result.CHUNKS.totalSUM[0].leads);
    console.log(this.TOP_4_FB,"=========================>",JSON.stringify(result.CHUNKS.totalSUM))
    setTimeout(()=>this.spinnerService.hide(),45000)
    })
  }
  ngOnInit() {
    this.defaultChunks()
    this.generateGrapg('clicks','TOP_1');
    this.generateGrapg('impressions','TOP_2');
    this.generateFacebookGraph('cpc');
  }

  bindChart1(data){
    this.chart1Options = {
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
      
      plotOptions: {      
        series: {
            marker: {
                enabled: false
            }
        }
      },
      series: [{
        showInLegend: false,
        name : 'Current',
        type: 'line',
        data: data,
        zIndex: 2
      }]
    };
  }
  bindChart2(data){
    this.chart2Options = {
      title : '',
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
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
      
      plotOptions: {      
        series: {
          marker: {
              enabled: false
          }
        }
      },
      series: [{
        name: 'Brands',
        colorByPoint: true,
        size: '100%',
        innerSize: '70%',
        showInLegend:false,
        dataLabels: {
            enabled: false
        },
        data: [{
            name: '',
            y: data[0].cpc,
            sliced: true,
            selected: true
        },
        {
          name: '',
          y: data[1].cpc,
          sliced: true,
          selected: true
        }]
      }]
    };
  }
  bindChart3(FBCPC, GCPC){
    this.chart3Options = {
      title : '',
      chart: {
        type: 'column'
    },
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
        showInLegend: false,
        name : 'Facebook',
        data: FBCPC,
        zIndex: 2
      },
      {
        showInLegend: false,
        name : 'Google',
        data: GCPC,
        zIndex: 1
      }]
    };
  }
}