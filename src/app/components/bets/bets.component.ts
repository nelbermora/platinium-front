import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ParlayService } from './../../services/parlay.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Parlay } from 'src/app/models/parlay.model';

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
    this.parlaySvc.betCalculator.calculate(this.parlay);
  }

  save(){
    this.loading = true;
    this.parlaySvc.save().subscribe(
      (resp: any) => {
        if(resp.oid > 0){
          this.open();
          this.parlay.date = resp.date;
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
