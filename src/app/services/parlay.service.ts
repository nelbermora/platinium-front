import { Router } from '@angular/router';
import { VersionService } from './version.service';
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
  maxCount: number = -1;
  maxAmount: number = -1;
  maxOuAndRl: number = 99999;
  minCount: number = 0;
  maxWins: number = 99999;

  constructor(public betCalculator: BetCalculatorService, private http: HttpClient,
    private authSvc: AuthService, private versionSvc:VersionService,
    private router: Router){
    this.versionSvc.getVersion().subscribe(
      (resp: any) => {
        this.maxCount = resp.maxCount;
        this.maxAmount = resp.maxAmountCoefficient;
        if(resp.maxOuAndRl > 0){
          this.maxOuAndRl = resp.maxOuAndRl;
        };
        if(resp.maxWins > 0){
          this.maxWins = resp.maxWins;
        };
        if(resp.minCount > 0){
          this.minCount = resp.minCount;
        };
      }
    );   
    this.parlay = {
        userId: this.authSvc.activeUser.id,
        odds: []
    };
    this.authSvc.isLogged.subscribe(
      resp => {
        this.parlay = {
          userId: this.authSvc.activeUser.id,
          odds: []
        };  
      }
    )
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
      if (this.canExists(team, betType, match, sport) && this.isValid() && this.isAdult()) {
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
      if(element.matchId === match.id){
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
          
        }else if(sport === "Football"){
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
               && this.getBetName(betType) !== "Si" && this.getBetName(betType) !== "No"
               && this.getBetName(betType) !== "Anota Primero"
               ){
              can = false;
            }
            if(element.letter === "A"){
              if (this.getBetName(betType) === "Si"){
                can = false;
              }
            }
            if(element.letter === "B"){
              if (this.getBetName(betType) === "No"){
                can = false;
              }
            }   
          }

          if(element.type === "Alta/Baja 1er Mitad"){
            if(this.getBetName(betType) !== "Ganar" && this.getBetName(betType) !== "Ganar 1er Mitad"
               && this.getBetName(betType) !== "Si" && this.getBetName(betType) !== "No"
               && this.getBetName(betType) !== "RunLine" && this.getBetName(betType) !== "RunLine 1er Mitad"
               && this.getBetName(betType) !== "Anota Primero"){
              can = false;
            }
            if(element.letter === "A"){
              if (this.getBetName(betType) === "Si"){
                can = false;
              }
            }
            if(element.letter === "B"){
              if (this.getBetName(betType) === "No"){
                can = false;
              }
            }   
          }

          if(element.type === "RunLine" || element.type === "RunLine 1er Mitad"){
            if(this.getBetName(betType) !== "Si" && this.getBetName(betType) !== "No"
            && this.getBetName(betType) !== "Alta/Baja 1er Mitad" && this.getBetName(betType) !== "Total Hits"){
              can = false;
            }
            if(this.getBetName(betType) === "Anota Primero" && element.teamPosition != team.position){
              can = true;
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
              && this.getBetName(betType) !== "Total Hits"){
                can = false;
              }
            }
            
            if((this.getBetName(betType) !== "RunLine" || this.getBetName(betType) !== "RunLine 1er Mitad") && this.getBetName(betType) !== "Anota Primero" &&
              element.teamPosition !== team.position){
              can = true;
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
              if(this.getBetName(betType) !== "Alta/Baja" || this.getBetName(betType) !== "Alta/Baja 1er Mitad"){
                if (this.getBetName(betType) !== "RunLine" && this.getBetName(betType) !== "RunLine 1er Mitad" &&
                    this.getBetName(betType) !== "Ganar" && this.getBetName(betType) !== "Ganar 1er Mitad"
                    && this.getBetName(betType) !== "Anota Primero"){
                  if(team.ouLetter === 'A'){
                    can = false;
                  }
                }                
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
              if(this.getBetName(betType) !== "Alta/Baja" || this.getBetName(betType) !== "Alta/Baja 1er Mitad"){
                if (this.getBetName(betType) !== "RunLine" && this.getBetName(betType) !== "RunLine 1er Mitad" &&
                    this.getBetName(betType) !== "Ganar" && this.getBetName(betType) !== "Ganar 1er Mitad"
                    && this.getBetName(betType) !== "Anota Primero"){
                  if(team.ouLetter === 'B'){
                    can = false;
                  }
                }                
              }              
            }
          }
        }else if(sport === "Hockey"){
          if(element.type === "Ganar" || element.type === "Ganar 1er Mitad"){
            if(this.getBetName(betType) !== "Alta/Baja" && this.getBetName(betType) !== "Alta/Baja 1er Mitad"){
              can = false;
            }
          }

          if(element.type === "Alta/Baja" || element.type === "Alta/Baja 1er Mitad"){
            if(this.getBetName(betType) !== "Ganar" && this.getBetName(betType) !== "Ganar 1er Mitad"){
              can = false;
            }
          }

          if(element.type === "RunLine" || element.type === "RunLine 1er Mitad"){
            can = false;            
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
    }else{
      if(!this.validaRlAb(betType)){
        return false;
      }
      if(!this.validaWins(betType)){
        return false;
      }
    }
    return can;
  }

  exists(team: TeamOdd, betType: string, match: Match) {
    let position = -1;
    this.parlay.odds.forEach((element, index) => {
        if(element.teamName === team.team.name
            && element.matchId === team.matchId
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

  update(parlay: Parlay){
    return this.http.put<Parlay>(this.url, parlay);
  }

  invalidate(parlay: Parlay){
    return this.http.delete(this.url + "?id=" + parlay.oid);
  }


  getParlays(desde: string, hasta: string, idUser?: number, status?: string, ticket ?: string){
    let usuario: number;
    let stat: string;
    idUser > 0 ? usuario = idUser : usuario = this.authSvc.activeUser.id;
    //"Todos","En Juego", "Perdidos", "Ganados", "Anulados"
    switch(status){
      case "En Juego":
        stat = "A";
        break;
      case "Perdidos":
        stat = "L";
        break;
      case "Ganados":
        stat = "W";
        break;
      case "Anulados":
        stat = "B";
        break;        
    }

    let param: string;
    stat === undefined ? 
      param =  "?idUser=" + usuario + "&desde=" + desde + "&hasta=" + hasta + "&ticket=" + ticket:
      param =  "?idUser=" + usuario + "&desde=" + desde + "&hasta=" + hasta + "&ticket=" + ticket + "&status=" + stat;
    return this.http.get<Parlay[]>(this.url + param);
  }

  isValid(){
    let valid = false;
    if (this.maxCount !== null && this.maxCount > 0){
      if(this.parlay.odds.length <= (this.maxCount - 1)){
        valid = true;
      }
    }else{
      valid = true;
    }
    
    if(!valid){
      Swal.fire({
        icon: 'info',
        title: 'Información...',
        text: 'Límite de combinaciones alcanzadas',
        footer: 'Abre un nuevo parlay para jugar mas combinaciones'
      })
    }
    return valid;    
  }

  isAdult(){/*
    let age = (+new Date()- +new Date(this.authSvc.activeUser.fechaNacimiento));
    console.log(age);
    if(age >= 567600000000){
      return true;
    }else{
      Swal.fire({
        icon: 'warning',
        title: 'Alerta...',
        text: 'Para jugar debes cargar tu fecha de nacimiento y ser mayor de edad',
        confirmButtonText: "Actualizar Datos"
      }).then((result)=>{
        if(result.isConfirmed){
          this.router.navigate(['/profile'], { queryParams: { tab: 'i' } });        
        }
      });    
      return false;
    } */
    return true;       
  }

  reprocess(odd: OddParlay){
    let path: string;
    if(environment.production){
      path = "https://platiniumsport.com/pservices/be/reprocesoGame";
    }else{
      path = "http://localhost/pservices/be/reprocesoGame";
    }
    return this.http.post<Parlay>(path, odd);
  }

  validaRlAb(betType: string){
    let isValid = true;
    if(betType === 'ou' || betType === 'ou5' ||
    betType === 'rl' || betType === 'rl5'){
      if(this.getCurrentRlAndOu() >= this.maxOuAndRl){
        isValid = false;
        Swal.fire({
          icon: 'info',
          title: 'Atención...',
          text: 'Máximo de RunLine y Alta/Baja alcanzado',
          footer: 'Puedes incorporar otras combinaciones o jugar distintos Parlays. Buena suerte!'
        })
      }
    }
    return isValid;
  }

  getCurrentRlAndOu(){
    let qty = 0;
    this.parlay.odds.forEach(element => {
      if(element.type === 'Alta/Baja' || element.type === 'Alta/Baja 1er Mitad' ||
          element.type === 'RunLine' || element.type === 'RunLine 1er Mitad'){
            qty = qty + 1;
          }
    });
    return qty;
  }

  validaWins(betType: string){    
    console.log(betType);
    let isValid = true;
    if(betType === 'win' || betType === 'win5'){
      if(this.getCurrentWins() >= this.maxWins){
        isValid = false;
        Swal.fire({
          icon: 'info',
          title: 'Atención...',
          text: 'Alcanzaste el Máximo de Apuestas a "Ganar"',
          footer: 'Puedes incorporar otras combinaciones o jugar distintos Parlays. Buena suerte!'
        })
      }
    }
    return isValid;
  }

  getCurrentWins(){
    let qty = 0;
    this.parlay.odds.forEach(element => {
      if(element.type === 'Ganar' || element.type === 'Ganar 1er Mitad'){
            qty = qty + 1;
          }
    });
    return qty;
  }  

}
