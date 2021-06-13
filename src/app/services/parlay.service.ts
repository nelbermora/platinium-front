import { Match } from "./../models/match.model";
import { OddParlay } from "./../models/odd-parlay.model";
import { Parlay } from "./../models/parlay.model";
import { EventEmitter, Injectable } from "@angular/core";
import { TeamOdd } from "../models/team-odd.model";

@Injectable()
export class ParlayService {
  parlayEmit = new EventEmitter<Parlay>();
  parlay: Parlay;
  i = 0;

  constructor(){
    this.parlay = {
        odds: []
    };
  }

  add(team: TeamOdd, betType: string, match: Match) {
    let idExists = this.exists(team, betType, match);
    if (idExists > -1) {
      this.delete(idExists);
    } else {
      if (this.canExists(team, betType, match)) {
        let newOdd: OddParlay = {};
        switch (betType) {
          case "win": {
            newOdd.type = this.getBetName(betType);
            newOdd.matchId = match.oid;
            newOdd.teamName = team.team.name;
            newOdd.teamId = team.oid_team
            newOdd.odd = team.win;
            break;
          }
          case "rl": {
            newOdd.matchId = match.oid;
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.handicap = team.rlHandicap;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.runLine;
            break;
          }
          case "ou": {
            newOdd.matchId = match.oid;
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.overUnder;
            newOdd.letter = team.ouLetter;
            newOdd.handicap = team.ouHandicap;
            break;
          }
          case "win5": {
            newOdd.matchId = match.oid;
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.win5;
            break;
          }
          case "rl5": {
            newOdd.matchId = match.oid;
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.runLine5;
            newOdd.handicap = team.rlHandicap5;
            break;
          }
          case "ou5": {
            newOdd.matchId = match.oid;
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.overUnder5;
            newOdd.letter = team.ouLetter5;
            newOdd.handicap = team.ouHandicap5;
            break;
          }
          case "sf": {
            newOdd.matchId = match.oid;
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.scoresFirst;
            break;
          }
          case "fiy": {
            newOdd.matchId = match.oid;
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = match.firstInningScoreYes;
            break;
          }
          case "fin": {
            newOdd.matchId = match.oid;
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = match.firstInningScoreNo;
            break;
          }
          case "th": {
            newOdd.matchId = match.oid;
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.totalHits;
            newOdd.letter = team.thLetter;
            newOdd.handicap = team.thHandicap;
            break;
          }
          case "tie": {
            newOdd.matchId = match.oid;
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.tieValue;            
            break;
          }
          case "tie5": {
            newOdd.matchId = match.oid;
            newOdd.teamId = team.oid_team
            newOdd.teamName = team.team.name;
            newOdd.type = this.getBetName(betType);
            newOdd.odd = team.tieValue5;            
            break;
          }
        }
        this.parlay.odds.push(newOdd);
        this.parlayEmit.emit(this.parlay);
      }
    }
  }

  delete(position: number) {
    this.parlay.odds.splice(position,1);
  }

  save() {}

  canExists(team: TeamOdd, betType: string, match: Match) {
    return true;
  }

  exists(team: TeamOdd, betType: string, match: Match) {
    let position = -1;
    this.parlay.odds.forEach((element, index) => {
        if(element.teamId === team.oid_team
            && element.matchId === team.oid_match
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
}
