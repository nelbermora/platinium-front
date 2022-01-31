import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'dateAr'
})
export class DateArPipe extends DatePipe implements PipeTransform{
    transform(strDate: string): any {
        let lasTry = new Date(+strDate.substring(0,4),+strDate.substring(5,7)-1,+strDate.substring(8,10),(+strDate.substring(11,13))-3,+strDate.substring(14,16));
        return super.transform(lasTry, "dd/MM/yyyy h:mm a");
    }    
}