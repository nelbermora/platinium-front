import { User } from './../../models/user.model';
import { AuthService } from './../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaymentService } from './../../services/payment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VersionService } from "./../../services/version.service";
import { Account } from "./../../models/config.model";
import { Payment } from "./../../models/payment.model";
import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { ClipboardService } from "ngx-clipboard";
import { ToastrService } from "ngx-toastr";
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: "app-payments",
  templateUrl: "./payments.component.html",
  styleUrls: ["./payments.component.css"],
})
export class PaymentsComponent implements OnInit, AfterViewInit {
  @ViewChild("content") modalContent: TemplateRef<any>;
  @ViewChild("wdContent") wdContent: TemplateRef<any>;
  active = "carga";
  pago: Payment = {};
  ctas: Account[] = [];
  loading: boolean = false;
  uploadForm: FormGroup;
  pending: Payment[] = [];
  withdrawal: Payment = {};
  withdrawals: Payment[] = [];
  user: User = {};
  thumbnail: any;
  pagoShowed: Payment = {};
  wdShowed: Payment = {};
  index: number;
  constructor(
    config: NgbTabsetConfig,
    private modalService: NgbModal,
    private ctasSvc: VersionService,
    private _clipboardService: ClipboardService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private paymentSvc: PaymentService,
    private spinnerSvc: NgxSpinnerService,
    private authSvc: AuthService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    config.justify = "center";
    config.type = "pills";
  }

  ngOnInit(): void {
    this.authSvc.getAll().subscribe((resp: User) => {
      this.user = resp;
      this.pago.userId = resp.id;
      this.withdrawal.userId = resp.id;
      this.paymentSvc.get(this.pago.userId).subscribe(
        (resp: any) => {
          if(resp){
            this.pending = resp;          
          }
        }
      );
      this.paymentSvc.getWithdrawals(this.pago.userId) .subscribe(
        (resp: any) => {
          if(resp){
            this.withdrawals = resp;
          }
        }
      );
    })
    
    
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
    this.ctasSvc
      .getVersion()
      .subscribe((resp: any) => (this.ctas = resp.bankAccounts));
      this.route.queryParams.subscribe(params => {
         if(params.tab === 'r'){
           this.active = 'retiro';
         }
      }
    );    
  }

  ngAfterViewInit(): void {}

  files: File[] = [];

  onSelect(event) {
    if (this.files.length === 0) { 
      console.log(event);
      this.files.push(...event.addedFiles);
      this.uploadForm.get('profile').setValue(this.files[0]);
    }
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  guardar() {
    this.loading = true;
    this.spinnerSvc.show();    
    const formData = new FormData();
    formData.append('sendimage', this.uploadForm.get('profile').value);
    formData.append('data', JSON.stringify(this.pago));
    this.paymentSvc.savePayment(formData).subscribe(
      (resp: any) => {
        this.loading = false;
        this.spinnerSvc.hide();
        if(resp !== null && resp.id > 0){
          Swal.fire(
            'Solicitud guardada',
            'En breve el pago será verificado y acreditado en tu billetera',
            'success'
          ); 
          this.files = [];
          this.pago = {
            userId: this.authSvc.activeUser.id
          };
          this.ngOnInit();
        }else{
          Swal.fire(
            'Error',
            'Tamaño de archivo excede al permitido.',
            'error'
          ); 
          this.files = [];
          this.pago = {
            userId: this.authSvc.activeUser.id
          };
        }
      }
    );
  }

  open(index?: number, payment?: Payment) {
    if(payment !== undefined && payment !== null){
      this.index = index;
      this.pagoShowed = payment;
      let objectURL = 'data:image/jpeg;base64,' + payment.comprobante;
      this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }
    this.modalService
      .open(this.modalContent, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.pagoShowed = {};
        },
        (reason) => {}
      );
  }

  copy(text: string) {
    this.showToast();
    this._clipboardService.copy(text);
  }

  showToast() {
    this.toastr.info(
      "Texto copiado al portapapeles",
      "Copiado",
      {
        progressBar: true,
        closeButton: true,
        positionClass: "toast-top-center",
      }
    );
  }

  comparar( pais1: string, pais2 :string) {
    if (pais1 == null || pais2 == null) {
      return false;
    }
    return pais1 === pais2;
  }

  paymentValid(){
    let valid = true;
    if(this.pago.cta_destino === undefined ||
      this.pago.amount === undefined ||
      this.pago.amount <= 0 ||
      this.files.length === 0){
        valid = false;
      }
    return valid;
  }

  withdrawalValid(){
    let valid = true;
    if(this.user.cuenta === undefined || this.user.cuenta.length === 0 ||
      this.withdrawal.amount === undefined || this.withdrawal.amount <= 0){
        valid = false;
      }
      return valid;
  }

  confirm(){
    if(confirm('Desea confirmar este pago?')){
      this.spinnerSvc.show();
      this.pagoShowed.status = 'A';
      this.pagoShowed.usuario_confirmacion = this.user.id;
      this.paymentSvc.updatePayment(this.pagoShowed).subscribe(
        resp => {
          if(resp){
            this.pending.splice(this.index,1);
            this.modalService.dismissAll();
            this.spinnerSvc.hide();
            Swal.fire(
              'Carga Aprobada',
              'El saldo fué acreditado en la billetera',
              'success'
            ); 
          }        
        }
      );     
    }    
  }

  reject(){
    if(confirm('Desea rechazar este pago?')){
      this.spinnerSvc.show();
      this.pagoShowed.status = 'R';
      this.pagoShowed.usuario_confirmacion = this.user.id;
      this.paymentSvc.updatePayment(this.pagoShowed).subscribe(
        resp => {
          if(resp){
            this.pending.splice(this.index,1);
            this.modalService.dismissAll();
            this.spinnerSvc.hide();
            Swal.fire(
              'Pago rechazado',
              'No se acreditará en billetera',
              'warning'
            ); 
          }        
        }
      );  
    }    
  }

  withdraw(){
    if(confirm('Desea retirar ' + this.withdrawal.amount + ' de su billetera?')){
      this.loading = true;
      this.spinnerSvc.show();
      this.withdrawal.cta_destino = this.user.cuenta;
      this.withdrawal.moneda = this.user.moneda;
      this.withdrawal.status = 'S';
      this.paymentSvc.saveWithdrawal(this.withdrawal).subscribe(
        (resp: Payment) => {
          this.loading = false;
          this.spinnerSvc.hide();
          if(resp !== null && resp.id > 0){
            Swal.fire(
              'Solicitud guardada',
              'En breve será procesado y se le notificará por correo.',
              'success'
            );
            this.withdrawals.push(resp);
            this.authSvc.fundsChange.emit(true);
          }else{
            if(resp !== null && resp.id <0){
              Swal.fire(
                'Saldo insuficiente',
                'Por favor intente con un monto menor',
                'warning'
              ); 
            }else{
              Swal.fire(
                'Error en el servicio',
                'Por favor intente en unos minutos nuevamente',
                'error'
              ); 
            }            
          }
        }
      )
    }
  }

  openWdModal(index: number){
    let objectURL = 'data:image/jpeg;base64,' + this.withdrawals[index].comprobante;
    this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    this.wdShowed = this.withdrawals[index];
    this.modalService
      .open(this.wdContent, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.wdShowed = {};
        },
        (reason) => {}
      );
  }

  uploadWd(){
    this.loading = true;
    this.spinnerSvc.show();    
    const formData = new FormData();
    formData.append('sendimage', this.uploadForm.get('profile').value);
    this.paymentSvc.uploadWithdrawal(formData, this.wdShowed.id).subscribe(
      (resp: any) =>{
        this.loading = false;
        this.spinnerSvc.hide();
        if(resp.id  > 0){
          this.updateRow(this.wdShowed.id);
          this.modalService.dismissAll();
        }else{
          Swal.fire(
            'Error',
            resp.message,
            'error'
          );           
        }
      }
    )
  }

  updateRow(id: number){
    let indice = 0;
    let foundit = false;
    this.withdrawals.forEach((element,index) => {
      if(element.id === id){
        foundit = true;
        indice = index;
        element.status = 'A';
      }
    });
    if (foundit){
      this.withdrawals.splice(indice,1);
    }
  }
}