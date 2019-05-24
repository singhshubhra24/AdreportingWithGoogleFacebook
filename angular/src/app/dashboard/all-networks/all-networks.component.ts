declare var require: any;
import { Component, OnInit, Input } from '@angular/core';
import { GoogleAdsService } from '../../service/reporting_ads.service';

@Component({
  selector: 'app-all-networks',
  templateUrl: './all-networks.component.html',
  styleUrls: ['./all-networks.component.css']
})
export class AllNetworksComponent implements OnInit {

 @Input() allNetworks: Array<any>;
   public ALLNETWORKS=[];

  constructor(private GoogleAdsService:GoogleAdsService) {}
defaultCampaignData(){
   this.GoogleAdsService.commonFilter('last_30_days','DASHBOARD').subscribe(result =>{
  console.log("ALLNETWORKS===========")
  this.ALLNETWORKS=result.result.allData;
  })
};
  ngOnInit() {
  this.defaultCampaignData()
  }
  addChecked(e, data){
      debugger;
      data.checked = e.target.checked
  }
}

