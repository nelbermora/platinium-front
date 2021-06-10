import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Sport } from 'src/app/models/sport.model';
import { OddService } from 'src/app/services/odd.service';

@Component({
  selector: 'app-soccer',
  templateUrl: './soccer.component.html',
  styleUrls: ['./soccer.component.css']
})
export class SoccerComponent implements OnInit {
  sport: Sport= {};
  constructor(private spinner: NgxSpinnerService, private oddSvc: OddService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.oddSvc.getOdds("Soccer").subscribe(
      resp => {
        this.sport = resp;
        this.spinner.hide();
      }
    );
  }

}
