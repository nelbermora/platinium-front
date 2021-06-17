import { OddParlay } from './../models/odd-parlay.model';
import { Parlay } from './../models/parlay.model';
import { EventEmitter, Injectable } from "@angular/core";

@Injectable()
export class BetCalculatorService{
    winAmount = new EventEmitter<number>();
    calculate(parlay: Parlay){
        let amount = 0;
        let indiceMultiplicador = 0;
        parlay.odds.forEach((bet,index) => {
            if(index === 0){
                indiceMultiplicador = this.americanToDecimal(bet.odd);
            }else{
                indiceMultiplicador = indiceMultiplicador * this.americanToDecimal(bet.odd);
            }            
        });
        amount = parlay.betAmount * indiceMultiplicador;
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
    
    americanToDecimal(americanOdd: number){
        let decimalOdd = 0;
        if(americanOdd > 0){
            decimalOdd = (americanOdd / 100) + 1;
        }else{
            decimalOdd = (100/(-americanOdd)) + 1;
        }
        return decimalOdd;
    }
}