import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { OddService } from 'src/app/services/odd.service';
import { Sport } from 'src/app/models/sport.model';

@Component({
  selector: 'app-basketball',
  templateUrl: './basketball.component.html',
  styleUrls: ['./basketball.component.css']
})
export class BasketballComponent implements OnInit {
  sport: Sport= {};
  constructor(private spinner: NgxSpinnerService, private oddSvc: OddService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.oddSvc.getOdds("basketball").subscribe(
      resp => {
        this.sport = resp;
        this.spinner.hide();
      }
    );
  }  
}
