import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'dateArSimple'
})
export class DateArSimplePipe extends DatePipe implements PipeTransform{
    transform(strDate: string): any {
        let newDate = new Date();
        newDate.setFullYear(+strDate.substring(0,4));
        newDate.setMonth((+strDate.substring(5,7))-1);
        newDate.setDate(+strDate.substring(8,10));
        newDate.setHours((+strDate.substring(11,13))-3,+strDate.substring(14,16))
        return super.transform(newDate, "dd/MM/yyyy");        
    }
    
}