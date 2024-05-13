import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'dateFull'
})
export class DateFullPipe extends DatePipe implements PipeTransform{
    /*transform(strDate: string): any {
        //2021-09-05 19:00:00
        let newDate = new Date();
        newDate.setFullYear(+strDate.substring(0,4));
        newDate.setMonth((+strDate.substring(5,7))-1);
        newDate.setDate(+strDate.substring(8,10));
        newDate.setHours((+strDate.substring(11,13)),+strDate.substring(14,16))
        return super.transform(newDate, "dd/MM/yyyy h:mm a");
    }*/
    transform(fechaHora: string): string {
        const fechaHoraLocal = new Date(fechaHora);
        const offset = fechaHoraLocal.getTimezoneOffset();
    
        fechaHoraLocal.setMinutes(fechaHoraLocal.getMinutes() - offset);
        const opcionesDeFormato: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          };
      
        const fechaHoraFormateada = fechaHoraLocal.toLocaleString('es-ES', opcionesDeFormato);
        //const fechaHoraFormateada = fechaHoraLocal.toLocaleString();
    
        return fechaHoraFormateada;
    }
    
}