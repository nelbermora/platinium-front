import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ParlayService } from './../../services/parlay.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Parlay } from 'src/app/models/parlay.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.css']
})
export class BetsComponent implements OnInit {
  @ViewChild("content") modalContent: TemplateRef<any>;
  parlay: Parlay = {};
  panelOpen = false;
  i = 0;
  loading = false;
  activeIds: string[] = ['panel-0'];
  closeResult= '';
  constructor(private parlaySvc: ParlayService, private modalService: NgbModal) {
    this.parlay = this.parlaySvc.parlay;
    this.i = this.parlaySvc.i;
  }

  ngOnInit(): void {
    this.parlaySvc.parlayEmit.subscribe(
      (resp: Parlay) =>{
        this.parlay = resp;
      }
    );

    this.parlaySvc.betCalculator.winAmount.subscribe(
      (resp: number) => {
        this.parlay.winAmount = resp;
        this.isValid();
      }
    );
  }

  delete(position: number){
    /*
    this.parlay.betAmount = undefined;
    this.parlay.winAmount = undefined;*/
    this.parlaySvc.delete(position);
  }

  calculate(){
    //if(this.isValid()){
      this.parlaySvc.betCalculator.calculate(this.parlay);
      this.isValid();
    //}    
  }

  isValid(){
    console.log(this.parlay.winAmount);
    console.log(this.parlay.betAmount);
    console.log(this.parlaySvc.maxAmount);
    let valid = false;
    if (this.parlaySvc.maxAmount !== null && this.parlaySvc.maxAmount > 0 && this.parlay.betAmount !== null
      && this.parlay.winAmount !== null && this.parlay.winAmount > 0){
      if((this.parlay.winAmount/this.parlay.betAmount) <= this.parlaySvc.maxAmount){
        valid = true;
      }
    }else{
      valid = true;
    }
    
    if(!valid){
      Swal.fire({
        icon: 'info',
        title: 'Información...',
        text: 'Monto Máximo alcanzado',
        footer: 'Elimine logros del Parlay'
      });
      this.parlay.betAmount = 0;
      this.parlay.winAmount = 0;
    }
    return valid;    
  }

  save(){
    this.loading = true;
    this.parlaySvc.save().subscribe(
      (resp: any) => {
        if(resp.oid > 0){
          this.open();
          this.parlay.date = resp.date;
          this.parlay.oid = resp.oid;
          this.loading = false;
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Jugada no guardada',
            text: 'Uno de los juegos seleccionados ya inició',
            footer: 'Carga una nueva jugada con logros vigentes'
          });
          this.loading = false;
        }        
      }
    )
  }

  open() {
    this.modalService.open(this.modalContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.cleanParlay();
      // console.log("Cierro Modal por button");
    }, (reason) => {
      this.cleanParlay();
      console.log("Cierro Modal");
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  cleanParlay(){ 
    this.parlaySvc.clearParley();
  }
}
