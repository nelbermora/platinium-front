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
  constructor(private oddSvc: OddService) { }

  ngOnInit(): void {
    this.oddSvc.getOdds("baseball").subscribe(
      resp => {
        console.log(resp);
        this.sport = resp;
      }
    )
  }

}
