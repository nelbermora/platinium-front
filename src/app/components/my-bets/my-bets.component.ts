import { LoggerService } from './../../services/logger.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParlayService } from './../../services/parlay.service';
import { Parlay } from 'src/app/models/parlay.model';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-bets',
  templateUrl: './my-bets.component.html',
  styleUrls: ['./my-bets.component.css']
})
export class MyBetsComponent implements OnInit {
  @ViewChild("content") modalContent: TemplateRef<any>;
  parlays: Parlay[];
  parlay: Parlay;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  desde: string;
  hasta: string;
  component = 'MyBets';
  statusSelected: string;
  statuses = ["Todos","En Juego", "Perdidos", "Ganados", "Anulados"];
  consultedUser: string;
  idUser: number;
  ignoreDate: boolean = false;
  constructor(private parlaySvc: ParlayService, private spinner: NgxSpinnerService,
    private modalService: NgbModal, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
    private logger: LoggerService, private route: ActivatedRoute) { 
      this.fromDate = calendar.getPrev(calendar.getToday(),'d',1);
      //this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
      this.toDate = calendar.getToday();
    }

  ngOnInit(status?: string, ignore?: boolean): void {
    if(status === null || status === undefined){
      this.statusSelected = 'Todos';
    }else{
      this.statusSelected = status;
    }
    this.ignoreDate = ignore;
    this.route.queryParams.subscribe(params => {
        this.consultedUser = params.user;
        this.idUser = params.idUser;
      }
    );  
    if(this.desde === null || this.desde === undefined){
      this.desde = this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day;
      this.hasta = this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day;
    }
    this.spinner.show();
    this.logger.log(this.component, 'Ingreso', this.desde + "-" + this.hasta);
    let from: string;
    let to: string;
    if(this.ignoreDate){
      console.log('entro al ignore');
      from = "1980-01-01";
      to = "2980-01-01";
    }else{
      from = this.desde;
      to = this.hasta;
    }
    this.parlaySvc.getParlays(from,to, this.idUser, this.statusSelected).subscribe(
      resp=> {
        this.parlays = resp;
        this.spinner.hide();
      }
    );
  }

  open(index: number) {
    this.parlay = this.parlays[index];
    this.modalService.open(this.modalContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {}, (reason) => {});
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

  search(){
    this.desde = this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day;
    if(this.toDate === undefined || this.toDate === null){
      this.hasta = this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day;  
    }else{
      this.hasta = this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day;
    }    
    this.ngOnInit(this.statusSelected, this.ignoreDate);
  }

}
