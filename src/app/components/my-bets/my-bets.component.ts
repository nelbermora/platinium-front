import { OddParlay } from './../../models/odd-parlay.model';
import { AuthService } from 'src/app/services/auth.service';
import { LoggerService } from './../../services/logger.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParlayService } from './../../services/parlay.service';
import { Parlay } from 'src/app/models/parlay.model';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import Swal from 'sweetalert2';

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
  ticket: string = "";
  activeUser: User = {};
  totalJugado: number;
  totalDevolucion: number;
  cantidadJugado: number;
  cantidadDevolucion: number;
  constructor(private parlaySvc: ParlayService, private spinner: NgxSpinnerService,
    private modalService: NgbModal, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
    private logger: LoggerService, private route: ActivatedRoute, private authSvc: AuthService) { 
      this.activeUser = this.authSvc.activeUser;
      this.authSvc.isLogged.subscribe(
        resp => {
          this.activeUser = this.authSvc.activeUser;
        }
      );
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
      from = "1980-01-01";
      to = "2980-01-01";
    }else{
      from = this.desde;
      to = this.hasta;
    }
    this.parlaySvc.getParlays(from,to, this.idUser, this.statusSelected, this.ticket).subscribe(
      resp=> {
        this.parlays = resp;
        this.ticket = "";
        this.spinner.hide();
        this.setTotals();
      }
    );
  }

  open(index: number) {
    this.parlay = this.parlays[index];
    this.modalService.open(this.modalContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {}, (reason) => {});
  }

  pay(index:number){
    if(confirm('Desea marcar como pagado el Parlay ' + this.parlays[index].oid + '?')){
      this.spinner.show();
      this.parlays[index].status = 'Z';
      this.parlaySvc.update(this.parlays[index]).subscribe(
        resp => {
          if(resp.oid > 0){
            this.spinner.hide();
            Swal.fire(
              'Parlay marcado como pagado',
              '',
              'success'
            );
          }
        }
      );
    }
  }

  isNulleable(index: number){    
    // date del parlay
    let parlayServerDate = new Date();
    let strDate = this.parlays[index].date + "";
    parlayServerDate.setFullYear(+strDate.substring(0,4));
    parlayServerDate.setMonth((+strDate.substring(5,7))-1);
    parlayServerDate.setDate(+strDate.substring(8,10));
    parlayServerDate.setHours((+strDate.substring(11,13)),+strDate.substring(14,16))    
    let nulleable = false;
    let date = new Date();
    date.setTime( date.getTime() + date.getTimezoneOffset()*60*1000 )
    date.setHours(date.getHours() - 3);
    parlayServerDate.setMinutes(parlayServerDate.getMinutes() + 20);    
    if(date <= parlayServerDate){
      nulleable = true;
    }
    if(this.activeUser.type === 'Admin'){
      nulleable = true;
    }
    return nulleable;
  }

  cancel(index: number){
    if(confirm('Desea anular el Parlay' + this.parlays[index].oid + '?')){
      this.spinner.show();
      this.parlays[index].status = 'E';
      this.parlaySvc.update(this.parlays[index]).subscribe(
        resp => {
          if(resp.oid > 0){
            this.spinner.hide();
            Swal.fire(
              'Parlay anulado',
              '',
              'success'
            );
          }else{
            this.parlays[index].status = 'A';
            this.spinner.hide();
            Swal.fire(
              'Anulación no satisfactoria',
              'Expiró el tiempo para anular la jugada o inició alguno de los juegos',
              'warning'
            );
          }
        }
      )
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
 /* <div *ngIf="parlay.status === 'S'" class="badge badge-info">Suspendido</div>
  <div *ngIf="parlay.status === 'A'" class="badge badge-warning">En Juego</div>
  <div *ngIf="parlay.status === 'W'" class="badge badge-success">Ganó!</div>
  <div *ngIf="parlay.status === 'L'" class="badge badge-danger">Perdió</div>
  <div *ngIf="parlay.status === 'Z'" class="badge badge-info">Pagado</div>*/
  setTotals(){
    let jugado: number = 0;
    let cantJugado: number = 0;
    let dev: number = 0;
    let cantDev: number = 0;
    this.parlays.forEach(element => {
      if(element.status === 'A'){
        jugado = jugado + (+element.betAmount);
        cantJugado = cantJugado + 1;
      }else if(element.status === 'W'){
        jugado = jugado + (+element.betAmount);
        cantJugado = cantJugado + 1;
        dev = dev + (+element.winAmount);
        cantDev = cantDev + 1;
      }else if(element.status === 'S'){
        jugado = jugado + (+element.betAmount);
        cantJugado = cantJugado + 1;
        dev = dev + (+element.betAmount);
        cantDev = cantDev + 1;
      }else if(element.status === 'L'){
        jugado = jugado + (+element.betAmount);
        cantJugado = cantJugado + 1;
      }else if(element.status === 'Z'){
        jugado = jugado + (+element.betAmount);
        cantJugado = cantJugado + 1;
        dev = dev + (+element.winAmount);
        cantDev = cantDev + 1;
      }
    });
    this.totalJugado = jugado;
    this.cantidadJugado = cantJugado;
    this.totalDevolucion = dev;
    this.cantidadDevolucion = cantDev;
  }

  reprocess(odd: OddParlay){
    if(confirm('Seguro que desea iniciar reproceso ['+ odd.teamName +']?')){
      this.spinner.show();
      this.parlaySvc.reprocess(odd).subscribe(
        (resp: any) => {
          this.spinner.hide();
          if(resp.affected !== null && resp.affected > 0){
            Swal.fire(
              'Reproceso automático iniciado',
              'En minutos podrá visualizar el resultado del mismo',
              'info'
            );          
          }else{
            Swal.fire(
              'Error en reproceso',
              'Intente nuevamente mas tarde',
              'error'
            );
          }
  
        }
      );            
    }    
  }

  invalidate(index: number) {
    if(confirm('La jugada será eliminada y no se devolverá el dinero al jugador Este proceso es irreversible. Desea invalidar Parlay ' + this.parlays[index].oid + '?')){
      this.parlaySvc.invalidate(this.parlays[index]).subscribe(
        resp => {
          this.ngOnInit();
        }
      )
    }
  }

}
