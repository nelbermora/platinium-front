import Swal from 'sweetalert2';
import { LoggerService } from './../../services/logger.service';
import { Match } from './../../models/match.model';
import { ParlayService } from './../../services/parlay.service';
import { TeamOdd } from './../../models/team-odd.model';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Sport } from 'src/app/models/sport.model';
import { OddService } from 'src/app/services/odd.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-soccer',
  templateUrl: './soccer.component.html',
  styleUrls: ['./soccer.component.css']
})
export class SoccerComponent implements OnInit {
  activeIds: string[] = [];
  sport: Sport= {};
  component = "SoccerOdds";
  isAdmin = false;
  editionMode: boolean = false;
  emptyResults: boolean = false;
  constructor(private spinner: NgxSpinnerService, private oddSvc: OddService,
              private parlaySvc: ParlayService, private logger: LoggerService,
              private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.activeUser.type === 'Admin' ? this.isAdmin = true : this.isAdmin = false;  
    this.logger.log(this.component, 'Ingreso');
    this.spinner.show();
    this.oddSvc.getOdds("Soccer").subscribe(
      resp => {
        this.activeIds = ['panel-0'];
        this.sport = resp;
        if(this.sport.leagues.length === 0){
          this.emptyResults = true;
        }
        this.spinner.hide();
      }
    );
    this.auth.isLogged.subscribe(
      resp => {
        this.auth.activeUser.type === 'Admin' ? this.isAdmin = true : this.isAdmin = false;        
      }
    );
  }

  select(team: TeamOdd, betType: string, match: Match){
    if(this.isOddValid(team,betType,match)){
      this.parlaySvc.add(team, betType, match, "Soccer");
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
        if (team.totalHits === 0 || team.totalHits === null || team.totalHits === undefined ){
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

  saveOdds(){
    this.spinner.show();
    this.oddSvc.saveOdds(this.sport).subscribe(
      resp => {
        if (resp){
          this.spinner.hide();
          this.editionMode = false;
          Swal.fire(
            'Cambios guardados!',
            '',
            'success'
          );          
        }
      }
    );    
  }
}
