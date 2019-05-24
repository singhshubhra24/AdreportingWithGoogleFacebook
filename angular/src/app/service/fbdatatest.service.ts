import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Apps } from '../models/apps';
import { environment } from '../../environments/environment';

let domainURL = environment.url;

@Injectable({
  providedIn: 'root'
})

export class FbdatatestService {
  constructor(private http : HttpClient) { }

  defaultData(range):Observable<any>{
      return this.http.get(domainURL+'/api/v1/ad_reporting/dashboard/facebook/last_30_days');
  }
  chunksFilter(range,type):Observable<any>{
  		return this.http.get(domainURL+'/api/v1/ad_reporting/chunks_filter/facebook/'+range+'/'+type)
  }
  commonFilter(range,type):Observable<any>{
  		return this.http.get(domainURL+'/api/v1/ad_reporting/common_filter/facebook/'+range+'/'+type)
      
  }

}