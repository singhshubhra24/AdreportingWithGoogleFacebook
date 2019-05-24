import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tbl-three-clmn-up-donw',
  templateUrl: './tbl-three-clmn-up-donw.component.html',
  styleUrls: ['./tbl-three-clmn-up-donw.component.css']
})
export class TblThreeClmnUpDonwComponent implements OnInit {
  @Input() rowData: any;
  @Input() id: number;

  constructor() { }

  ngOnInit() {
  }

}
