import { NgxSpinnerService } from 'ngx-spinner';
import { ParlayService } from './../../services/parlay.service';
import { Parlay } from 'src/app/models/parlay.model';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-bets',
  templateUrl: './my-bets.component.html',
  styleUrls: ['./my-bets.component.css']
})
export class MyBetsComponent implements OnInit {
  @ViewChild("content") modalContent: TemplateRef<any>;
  parlays: Parlay[];
  parlay: Parlay;
  constructor(private parlaySvc: ParlayService, private spinner: NgxSpinnerService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.spinner.show();
    this.parlaySvc.getParlays().subscribe(
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

}
