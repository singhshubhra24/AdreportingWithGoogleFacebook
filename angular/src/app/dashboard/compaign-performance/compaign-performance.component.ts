declare var require: any;
import { Component, OnInit, Input} from '@angular/core';
import { GoogleAdsService } from '../../service/reporting_ads.service';
@Component({
  selector: 'app-compaign-performance',
  templateUrl: './compaign-performance.component.html',
  styleUrls: ['./compaign-performance.component.css']
})
export class CompaignPerformanceComponent implements OnInit {

  @Input() comppaignPerformanceData: Array<any>;
    public CAMPAIGNVIEW : any;
    public FTOTAL : any;
    public GTOTAL : any;
    public searchText : any;
    public COUNT : any;
    public clicks : any;
    public budget : any;
    public impr : any;
    public ctr : any;
    public spend : any;
    public avgcpc : any;
    constructor(private GoogleDataService : GoogleAdsService) {};
    defaultCampaignData(){
     this.GoogleDataService.commonFilter('last_30_days','DASHBOARD').subscribe(result =>{
        this.CAMPAIGNVIEW=result.result.result;
        this.COUNT=result.result.result.length;
        this.FTOTAL = result.result.allData[0];
        this.GTOTAL = result.result.allData[1];
        this.clicks = parseInt(this.GTOTAL.clicks)+parseInt(this.FTOTAL.clicks),
        this.budget = parseFloat(this.GTOTAL.budget+this.FTOTAL.budget),
        this.impr = parseInt(this.GTOTAL.impr)+parseInt(this.FTOTAL.impr),
        this.ctr = parseFloat(this.GTOTAL.ctr)+parseFloat(this.FTOTAL.ctr),
        this.spend = parseFloat(this.GTOTAL.spend)+parseFloat(this.FTOTAL.spend),
        this.avgcpc = parseFloat(this.GTOTAL.avgCpc)+parseFloat(this.FTOTAL.avgCpc)
      })
    };

  ngOnInit() {
    this.defaultCampaignData();
  }
  addChecked(e, data){
    debugger;
    data.checked = e.target.checked
  }
  exportAsXLSX(data) {
    this.GoogleDataService.exportAsExcelFile(data, 'campaign_performance');
  }
}