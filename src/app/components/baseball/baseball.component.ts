import { NgxSpinnerService } from 'ngx-spinner';
import { Match } from './../../models/match.model';
import { League } from './../../models/league.model';
import { OddService } from './../../services/odd.service';
import { Component, OnInit } from '@angular/core';
import { Sport } from 'src/app/models/sport.model';

@Component({
  selector: 'app-baseball',
  templateUrl: './baseball.component.html',
  styleUrls: ['./baseball.component.css']
})
export class BaseballComponent implements OnInit {
  sport: Sport= {};
  activeIds: string[] = ['panel-0'];
  constructor(private oddSvc: OddService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.oddSvc.getOdds("baseball").subscribe(
      resp => {
        this.sport = resp;
        this.spinner.hide();
      }
    );
  }

}
