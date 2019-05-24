import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Apps } from '../models/apps';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { environment } from '../../environments/environment';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
let domainURL = environment.url;

@Injectable({
  providedIn: 'root'
})

export class GoogleAdsService {
  constructor(private http : HttpClient) { }
    dashboardChunksFilterData(range,data,type):Observable<any>{
      return this.http.get(domainURL+'/api/v2/ad_reporting/dashboard/'+data+'/'+range+'/'+type);
  }
  defaultData(range):Observable<any>{
      return this.http.get(domainURL+'/api/v1/ad_reporting/dashboard/google/last_30_days');
  }
  chunksFilter(range,type):Observable<any>{
  return this.http.get(domainURL+'/api/v1/ad_reporting/chunks_filter/google/'+range+'/'+type)
  }
  commonFilter(range,type):Observable<any>{
    return this.http.get(domainURL+'/api/v1/ad_reporting/common_filter/google/'+range+'/'+type)
  }
  dashboardAPI(data):Observable<any>{
    return this.http.get(domainURL+'/api/v2/ad_reporting/'+data+'/dashboard/quarter/'+data+','+'metric_graph')
   //return this.http.get('')
  }
dashboardCHUNKS(data,type):Observable<any>{
    return this.http.get(domainURL+'/api/v2/ad_reporting/'+data+'/six_chunks/last_30_days/'+type)
   //return this.http.get('')
  }
  public exportAsExcelFile(json: any[], excelFileName: string): void { 
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}