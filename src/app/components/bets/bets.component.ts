import { BetCalculatorService } from './../../services/bet-calculator.service';
import { ParlayService } from './../../services/parlay.service';
import { Component, OnInit } from '@angular/core';
import { Parlay } from 'src/app/models/parlay.model';

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
    );

    this.parlaySvc.betCalculator.winAmount.subscribe(
      (resp: number) => {
        this.parlay.winAmount = resp;
      }
    )
  }

  delete(position: number){
    /*
    this.parlay.betAmount = undefined;
    this.parlay.winAmount = undefined;*/
    this.parlaySvc.delete(position);
  }

  calculate(){
    this.parlaySvc.betCalculator.calculate(this.parlay);
  }
}
