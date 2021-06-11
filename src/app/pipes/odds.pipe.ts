import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'odd'
})
export class OddsPipe implements PipeTransform{
    transform(n: number): string {
        if(n === undefined || n == null || n === 0){
            return "--"
        }else{
            if (n > 0){
                return '+' + n;
            }else{
                return n + '';
            }
        }                
    }
    
}