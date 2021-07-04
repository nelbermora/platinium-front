import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { BetCalculatorService } from './bet-calculator.service';
import { Match } from "./../models/match.model";
import { OddParlay } from "./../models/odd-parlay.model";
import { Parlay } from "./../models/parlay.model";
import { EventEmitter, Injectable } from "@angular/core";
import { TeamOdd } from "../models/team-odd.model";
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Injectable()
export class ParlayService {
  url: string = '';
  parlayEmit = new EventEmitter<Parlay>();
  parlay: Parlay;
  i = 0;

  constructor(public betCalculator: BetCalculatorService, private http: HttpClient,
    private authSvc: AuthService){
    this.parlay = {
        userId: this.authSvc.activeUser.id,
        odds: []
    };
    if(environment.production){
      this.url = "https://platiniumsport.com/pservices/be/parlay";
    }else{
      this.url = "http://localhost/pservices/be/parlay";
    }
  }

  add(team: TeamOdd, betType: string, match: Match, sport: string) {
    let idExists = this.exists(team, betType, match);
    if (idExists > -1) {
      this.delete(idExists);
    } else {
      if (this.canExists(team, betType, match, sport)) {
        let newOdd: OddParlay = {
          sport: sport,
          teamPosition: team.position,
          matchId: match.id,
          matchOid: match.oid,
          matchDate: match.date
        };
        switch (betType) {
          case "win": {
            newOdd.type = this.getBetName(betType);
            newOdd.teamName = team.team.name;
            newOdd.teamId = team.oid_team
            newOdd.odd = team.win;
            break;
          }
          case "rl": {
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.handicap = team.rlHandicap;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.runLine;
            break;
          }
          case "ou": {
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.overUnder;
            newOdd.letter = team.ouLetter;
            newOdd.handicap = team.ouHandicap;
            break;
          }
          case "win5": {
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.win5;
            break;
          }
          case "rl5": {
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.runLine5;
            newOdd.handicap = team.rlHandicap5;
            break;
          }
          case "ou5": {
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.overUnder5;
            newOdd.letter = team.ouLetter5;
            newOdd.handicap = team.ouHandicap5;
            break;
          }
          case "sf": {
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.scoresFirst;
            break;
          }
          case "fiy": {
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = match.firstInningScoreYes;
            break;
          }
          case "fin": {
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = match.firstInningScoreNo;
            break;
          }
          case "th": {
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.totalHits;
            newOdd.letter = team.thLetter;
            newOdd.handicap = team.thHandicap;
            break;
          }
          case "tie": {
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.tieValue;            
            break;
          }
          case "tie5": {
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.tieValue5;            
            break;
          }
        }
        this.parlay.odds.push(newOdd);
        this.betCalculator.calculate(this.parlay);
        this.parlayEmit.emit(this.parlay);
      }
    }
  }

  delete(position: number) {
    this.parlay.odds.splice(position,1);
    this.betCalculator.calculate(this.parlay);
  }  

  canExists(team: TeamOdd, betType: string, match: Match, sport: string) {
    let can = true;
    this.parlay.odds.forEach(element => {
      if(element.matchOid === match.oid){
        if(sport === "Soccer"){
          can = false;
        }else if(sport === "Basketball"){
          if(element.type === "Ganar" || element.type === "Ganar 1er Mitad"){
            if(this.getBetName(betType) !== "Alta/Baja" && this.getBetName(betType) !== "Alta/Baja 1er Mitad"){
              can = false;
            }
          }

          if(element.type === "Alta/Baja" || element.type === "Alta/Baja 1er Mitad"){
            if(this.getBetName(betType) !== "Ganar" && this.getBetName(betType) !== "Ganar 1er Mitad"
             && this.getBetName(betType) !== "RunLine" && this.getBetName(betType) !== "RunLine 1er Mitad"){
              can = false;
            }
          }

          if(element.type === "RunLine" || element.type === "RunLine 1er Mitad"){
            if(this.getBetName(betType) !== "Alta/Baja" && this.getBetName(betType) !== "Alta/Baja 1er Mitad"){
              can = false;
            }
          }
          
        }else if(sport === "Baseball"){
          if(element.type === "Ganar" || element.type === "Ganar 1er Mitad"){
            if(this.getBetName(betType) === "Anota Primero"){
              if(element.teamPosition === team.position){
                can = false;
              }
            }else{
              if(this.getBetName(betType) !== "Alta/Baja" && this.getBetName(betType) !== "Alta/Baja 1er Mitad"
              && this.getBetName(betType) !== "Si" && this.getBetName(betType) !== "No"
              && this.getBetName(betType) !== "Total Hits"
              ){
                can = false;
              }
            }            
          }

          if(element.type === "Alta/Baja"){
            if(this.getBetName(betType) !== "Ganar" && this.getBetName(betType) !== "Ganar 1er Mitad"
               && this.getBetName(betType) !== "Si" && this.getBetName(betType) !== "No"){
              can = false;
            }
          }

          if(element.type === "Alta/Baja 1er Mitad"){
            if(this.getBetName(betType) !== "Ganar" && this.getBetName(betType) !== "Ganar 1er Mitad"
               && this.getBetName(betType) !== "Si" && this.getBetName(betType) !== "No"
               && this.getBetName(betType) !== "RunLine" && this.getBetName(betType) !== "RunLine 1er Mitad"){
              can = false;
            }
          }

          if(element.type === "RunLine" || element.type === "RunLine 1er Mitad"){
            if(this.getBetName(betType) !== "Si" && this.getBetName(betType) !== "No"
            && this.getBetName(betType) !== "Alta/Baja 1er Mitad"){
              can = false;
            }
          }

          if(element.type === "Anota Primero"){
            if(this.getBetName(betType) === "Ganar" || this.getBetName(betType) === "Ganar 1er Mitad"){
              if(element.teamPosition === team.position){
                can = false;
              }
            }else{
              if(this.getBetName(betType) !== "Si" && this.getBetName(betType) !== "No"
              && this.getBetName(betType) !== "Alta/Baja" && this.getBetName(betType) !== "Alta/Baja 1er Mitad"
              && this.getBetName(betType) !== "RunLine" && this.getBetName(betType) !== "RunLine 1er Mitad"
              && this.getBetName(betType) !== "Total Hits"){
                can = false;
              }
            }            
          }

          if(element.type === "Total Hits"){
            if(element.letter === "A"){
              if(this.getBetName(betType) !== "Ganar" && this.getBetName(betType) !== "Ganar 1er Mitad"
              && this.getBetName(betType) !== "RunLine" && this.getBetName(betType) !== "RunLine 1er Mitad"
              && this.getBetName(betType) !== "Anota Primero" && this.getBetName(betType) !== "No"){
                can = false;
              }
            }else{
              if(this.getBetName(betType) !== "Ganar" && this.getBetName(betType) !== "Ganar 1er Mitad"
              && this.getBetName(betType) !== "RunLine" && this.getBetName(betType) !== "RunLine 1er Mitad"
              && this.getBetName(betType) !== "Anota Primero" && this.getBetName(betType) !== "Si"){
                can = false;
              }
            }            
          }
          
          if(element.type === "Si"){
            if(this.getBetName(betType) === "Total Hits"){
              if(team.thLetter !== "B"){
                can = false;
              }
            }else{
              if(this.getBetName(betType) !== "Ganar" && this.getBetName(betType) !== "Ganar 1er Mitad"
              && this.getBetName(betType) !== "RunLine" && this.getBetName(betType) !== "RunLine 1er Mitad"
              && this.getBetName(betType) !== "Alta/Baja" && this.getBetName(betType) !== "Alta/Baja 1er Mitad"
              && this.getBetName(betType) !== "Anota Primero"){
                can = false;
              }              
            }            
          }

          if(element.type === "No"){
            if(this.getBetName(betType) === "Total Hits"){
              if(team.thLetter !== "A"){
                can = false;
              }
            }else{
              if(this.getBetName(betType) !== "Ganar" && this.getBetName(betType) !== "Ganar 1er Mitad"
              && this.getBetName(betType) !== "RunLine" && this.getBetName(betType) !== "RunLine 1er Mitad"
              && this.getBetName(betType) !== "Alta/Baja" && this.getBetName(betType) !== "Alta/Baja 1er Mitad"
              && this.getBetName(betType) !== "Anota Primero"){
                can = false;
              }              
            }
          }
        }        
      }
    });
    if(!can){
      Swal.fire({
        icon: 'warning',
        title: 'Alerta...',
        text: 'Combinación inválida!',
        footer: 'Intenta otras combinaciones. Buena suerte!'
      })
    }
    return can;
  }

  exists(team: TeamOdd, betType: string, match: Match) {
    let position = -1;
    this.parlay.odds.forEach((element, index) => {
        if(element.teamId === team.oid_team
            && element.matchOid === team.oid_match
            && element.type === this.getBetName(betType)){
                position = index;
            }
    });
    return position;
  }

  getBetName(betType: string){
    let type: string;
    switch (betType) {
        case "win": {
          type = "Ganar";
          break;
        }
        case "rl": {
          type = "RunLine";
          break;
        }
        case "ou": {
          type = "Alta/Baja";
          break;
        }
        case "win5": {
          type = "Ganar 1er Mitad";
          break;
        }
        case "rl5": {
          type = "RunLine 1er Mitad"
          break;
        }
        case "ou5": {
          type = "Alta/Baja 1er Mitad";
          break;
        }
        case "sf": {
          type = "Anota Primero";
          break;
        }
        case "fiy": {
          type = "Si";
          break;
        }
        case "fin": {
          type = "No";
          break;
        }
        case "th": {
          type = "Total Hits";
          break;
        }
        case "tie": {
            type = "Empate";
            break;
        }
        case "tie5": {
            type = "Empate 1er Mitad";
            break;
        }
      }
      return type;
  }

  clearParley(){
    this.parlay = {
      userId: this.authSvc.activeUser.id,
      odds: []
    };
    this.parlayEmit.emit(this.parlay);
  }

  save(){
    return this.http.post<Parlay>(this.url, this.parlay);
  }

  getParlays(desde: string, hasta: string){
    return this.http.get<Parlay[]>(this.url + "?idUser=" + this.authSvc.activeUser.id + "&desde=" + desde + "&hasta=" + hasta);
  }
}
