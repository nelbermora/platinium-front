import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'dateArSimple'
})
export class DateArSimplePipe extends DatePipe implements PipeTransform{
    transform(date: Date): any {
        let newDate = new Date(date);
        newDate.setHours(newDate.getHours()-3);
        return super.transform(newDate, "dd/MM/yyyy");
    }
    
}