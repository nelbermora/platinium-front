import { ParlayService } from './../../services/parlay.service';
import { Component, OnInit } from '@angular/core';
import { Parlay } from 'src/app/models/parlay.model';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Match } from 'src/app/models/match.model';
import { TeamOdd } from 'src/app/models/team-odd.model';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.css']
})
export class BetsComponent implements OnInit {
  parlay: Parlay = {};
  panelOpen = false;
  i = 0;
  activeIds: string[] = ['panel-0'];
  constructor(private parlaySvc: ParlayService) {
    this.parlay = this.parlaySvc.parlay;
    this.i = this.parlaySvc.i;
  }

  ngOnInit(): void {
    this.parlaySvc.parlayEmit.subscribe(
      (resp: Parlay) =>{
        this.parlay = resp;
      }
    )
  }

  delete(position: number){
    this.parlaySvc.delete(position);
  }
}
