import { Component, OnInit , Input} from '@angular/core';
import { GoogleAdsService } from '../../service/reporting_ads.service';
@Component({
  selector: 'app-top-networks',
  templateUrl: './top-networks.component.html',
  styleUrls: ['./top-networks.component.css']
})
export class TopNetworksComponent implements OnInit {
	public ALLDATA : any;
    @Input() topNetwork: Array<any>;
  constructor(private GoogleDataService : GoogleAdsService) { }

  ngOnInit() {
  this.GoogleDataService.commonFilter('last_30_days','DASHBOARD').subscribe(result =>{
  	this.ALLDATA=result.result.allData;
  	
  })
  }
exportAsXLSX(data) {
    this.GoogleDataService.exportAsExcelFile(data, 'campaign_performance');
  }
}