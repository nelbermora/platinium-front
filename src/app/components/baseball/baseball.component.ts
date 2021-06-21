import { ParlayService } from './../../services/parlay.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Match } from './../../models/match.model';
import { League } from './../../models/league.model';
import { OddService } from './../../services/odd.service';
import { Component, OnInit } from '@angular/core';
import { Sport } from 'src/app/models/sport.model';
import { TeamOdd } from 'src/app/models/team-odd.model';

@Component({
  selector: 'app-baseball',
  templateUrl: './baseball.component.html',
  styleUrls: ['./baseball.component.css']
})
export class BaseballComponent implements OnInit {
  sport: Sport= {};
  activeIds: string[] = ['panel-0'];
  constructor(private oddSvc: OddService, private spinner: NgxSpinnerService,
    private parlaySvc: ParlayService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.oddSvc.getOdds("baseball").subscribe(
      resp => {
        this.sport = resp;
        this.spinner.hide();
      }
    );
  }

  select(team: TeamOdd, betType: string, match: Match){
    if(this.isOddValid(team,betType,match)){
      this.parlaySvc.add(team, betType, match, "Baseball");
    }    
  }

  isSelected(team: TeamOdd, betType: string, match: Match){
    let seleted = false;
    if(this.parlaySvc.exists(team,betType,match)>-1){
      seleted = true;
    };
    return seleted;
  }

  isOddValid(team: TeamOdd, betType: string, match: Match){
    let valid = true;
    switch (betType) {
      case "win": {
        if (team.win === 0 || team.win === null || team.win === undefined){
          valid = false;
        }
        break;
      }
      case "rl": {
        if (team.rlHandicap === 0 || team.rlHandicap === null || team.rlHandicap === undefined ){
          valid = false;
        }
        break;
      }
      case "ou": {
        if (team.overUnder === 0 || team.overUnder === null || team.overUnder === undefined ){
          valid = false;
        }
        break;
      }
      case "win5": {
        if (team.win5 === 0 || team.win5 === null || team.win5 === undefined){
          valid = false;
        }
        break;
      }
      case "rl5": {
        if (team.rlHandicap5 === 0 || team.rlHandicap5 === null || team.rlHandicap5 === undefined ){
          valid = false;
        }
        break;
      }
      case "ou5": {
        if (team.overUnder5 === 0 || team.overUnder5 === null || team.overUnder5 === undefined ){
          valid = false;
        }
        break;
      }
      case "sf": {
        if (team.scoresFirst === 0 || team.scoresFirst === null || team.scoresFirst === undefined ){
          valid = false;
        }
        break;
      }
      case "fiy": {
        if (match.firstInningScoreYes === 0 || match.firstInningScoreYes === null || match.firstInningScoreYes === undefined ){
          valid = false;
        }
        break;
      }
      case "fin": {
        if (match.firstInningScoreNo === 0 || match.firstInningScoreNo === null || match.firstInningScoreNo === undefined ){
          valid = false;
        }
        break;
      }
      case "th": {
        if (team.totalHits === 0 || team.totalHits === null || team.totalHits === undefined || team.thHandicap === 0 ){
          valid = false;
        }
        break;
      }
      case "tie": {
        if (team.tieValue === 0 || team.tieValue === null || team.tieValue === undefined ){
          valid = false;
        }
        break;
      }
      case "tie5": {
        if (team.tieValue5 === 0 || team.tieValue5 === null || team.tieValue5 === undefined ){
          valid = false;
        }
        break;
      }
    }
    return valid;
  }

}
