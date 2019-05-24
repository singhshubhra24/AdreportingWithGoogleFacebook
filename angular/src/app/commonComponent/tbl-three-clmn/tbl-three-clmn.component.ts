import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tbl-three-clmn',
  templateUrl: './tbl-three-clmn.component.html',
  styleUrls: ['./tbl-three-clmn.component.css']
})
export class TblThreeClmnComponent implements OnInit {
  @Input() rowData: any;
  @Input() id: number;
  @Input() type:string;


  constructor() { }

  ngOnInit() {
    console.log(`rowdata =====> ${this.rowData}`);
    console.log(`type value =====> ${JSON.stringify(this.type)}`);
  }
}
