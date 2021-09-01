import { ReportService } from './../../services/report.service';
import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  desde: string;
  hasta: string;
  typeSelected: string = "Todos";
  types = ["Todos", "Taquilla", "Jugador", "Admin"];
  users: User[] = [];
  empty: boolean;
  constructor(public formatter: NgbDateParserFormatter, private calendar: NgbCalendar,
    private reportsSvc: ReportService, private spinner: NgxSpinnerService) {
    this.fromDate = calendar.getPrev(calendar.getToday(),'d',1);
    this.toDate = calendar.getToday();
   }

  ngOnInit(): void {
    if(this.desde === null || this.desde === undefined){
      this.desde = this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day;
      this.hasta = this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day;
    }
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  dateShowed(){
    let showed = '';
    if (this.fromDate && this.toDate) {
        showed = this.fromDate.day + "/" + this.fromDate.month + "/" + (this.fromDate.year - 2000) +
        " -- " + this.toDate.day + "/" + this.toDate.month + "/" + (this.toDate.year - 2000);
    }else{
      showed = this.fromDate.day + "/" + this.fromDate.month + "/" + (this.fromDate.year - 2000) +
        " -- " + this.fromDate.day + "/" + this.fromDate.month + "/" + (this.fromDate.year - 2000);
    }
    return showed;
  }
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  search(){
    this.spinner.show();
    this.desde = this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day;
    if(this.toDate === undefined || this.toDate === null){
      this.hasta = this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day;  
    }else{
      this.hasta = this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day;
    }    
    let type = null;
    if(this.typeSelected !== "Todos"){
      type = this.typeSelected;
    }
    this.reportsSvc.getReport(type, this.desde, this.hasta).subscribe(
      (resp: any) => {
        this.users = resp;
        if(this.users.length === 0){
          this.empty = true;
        }else{
          this.empty = false;
        }
        this.spinner.hide();
      }
    );
  }

  nullFormatter(value: string){
    if(value === undefined || value === null){
      return 0;
    }else{
      return +value;
    }
  }
  
  getTotal(user: any){
    //return 4;
    return this.nullFormatter(user.singles.jugado)
         + this.nullFormatter(user.doubles.jugado)
         + this.nullFormatter(user.parlays.jugado)
         - this.nullFormatter(user.singles.ganado)
         - this.nullFormatter(user.doubles.ganado)
         - this.nullFormatter(user.parlays.ganado);
    /*return (user.singles.jugado + user.doubles.jugado + user.parlays.jugado)
          -(user.singles.ganado + user.doubles.ganado + user.parlays.ganado);*/
  }

}
