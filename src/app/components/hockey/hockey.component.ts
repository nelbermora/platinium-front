import Swal from 'sweetalert2';
import { LoggerService } from './../../services/logger.service';
import { ParlayService } from './../../services/parlay.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { OddService } from 'src/app/services/odd.service';
import { Sport } from 'src/app/models/sport.model';
import { Match } from 'src/app/models/match.model';
import { TeamOdd } from 'src/app/models/team-odd.model';
import { AuthService } from 'src/app/services/auth.service';
import jspdf from 'jspdf';

@Component({
  selector: 'app-hockey',
  templateUrl: './hockey.component.html',
  styleUrls: ['./hockey.component.css']
})
export class HockeyComponent implements OnInit {

  activeIds: string[] = ['panel-0'];
  sport: Sport= {};
  component = "HockeyOdds";
  isAdmin = false;
  isTaquilla = false
  editionMode: boolean = false;
  emptyResults: boolean = false;
  loadingPdf = false;
  constructor(private spinner: NgxSpinnerService, private oddSvc: OddService,
    private parlaySvc: ParlayService, private logger: LoggerService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.activeUser.type === 'Admin' ? this.isAdmin = true : this.isAdmin = false;  
    this.auth.activeUser.type === 'Taquilla' ? this.isTaquilla = true : this.isTaquilla = false;
    this.logger.log(this.component, 'Ingreso');
    this.spinner.show();
    this.oddSvc.getOdds("hockey").subscribe(
      resp => {
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
        this.auth.activeUser.type === 'Taquilla' ? this.isTaquilla = true : this.isTaquilla = false;
      }
    );
  }
  
  select(team: TeamOdd, betType: string, match: Match){
    if(this.isOddValid(team,betType,match)){
      this.parlaySvc.add(team, betType, match, "Hockey");
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
  getPdf(){
    this.loadingPdf = true;
    let data = document.getElementById("pdf");  
    var doc = new jspdf();
    doc.setFontSize(9);
    doc.html(data, {
      // A, B, bottom, left 
     margin: [2, 2, 5, 10],
     callback: function (doc) {
       var totalPages = doc.internal.pages.length;
       for (let i = 1; i <= totalPages; i++) {
         doc.setPage(i);
         doc.setFontSize(14)
         doc.setTextColor(150);         
         doc.text('www.galosportbets.com',75, doc.internal.pageSize.height);         
       }
       var today = new Date(); 
       doc.save('Hockey_' + today.getDate() + '_' + (today.getMonth()+1));
     },
    x: 4,
    y: 4,
    html2canvas: {
            scale: 0.24,
        },
    });    
  }
}
