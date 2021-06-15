import { OddParlay } from './../models/odd-parlay.model';
import { Parlay } from './../models/parlay.model';
import { EventEmitter, Injectable } from "@angular/core";

@Injectable()
export class BetCalculatorService{
winAmount = new EventEmitter<number>();

calculate(parlay: Parlay){
    let amount = 0;
    parlay.odds.forEach(bet => {
      amount = amount + this.getWinForBet(bet, parlay.betAmount);
    });
    this.winAmount.emit(Math.round(amount*100)/100);
}

getWinForBet(odd: OddParlay, betAmount: number) {
    let amount = 0;
    if(odd.odd > 0){
        amount = ((odd.odd/100)*betAmount) + betAmount;
    }else if(odd.odd < 0){
        amount = ((betAmount/(-odd.odd)) * 100) + betAmount;
    }else{
        amount = 0;
    }
    return amount;
}

}