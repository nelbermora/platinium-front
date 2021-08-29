import { LoggerService } from './../../../services/logger.service';
import { User } from './../../../models/user.model';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild("content") modalContent: TemplateRef<any>;
  component = 'Profile';
  user: User = {};
  invalidMail = false;
  paises = ['Antigua y Barbuda',
  'Argentina',
  'Bahamas',
  'Barbados',
  'Belice',
  'Bolivia',
  'Brasil',
  'Canadá',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Dominica',
  'Dominicana',
  'Ecuador',
  'El Salvador',
  'Estados Unidos de América',
  'Granada',
  'Guatemala',
  'Guyana',
  'Haití',
  'Honduras',
  'Jamaica',
  'México',
  'Nicaragua',
  'Panamá',
  'Paraguay',
  'Perú',
  'Saint Kitts y Nevis',
  'San Vicente y las Granadinas',
  'Santa Lucía',
  'Suriname',
  'Trinidad y Tabago',
  'Uruguay',
  'Venezuela'];
  currencies = ['ARS', 'BRL', 'CLP', 'COP', 'USD', 'PEN', 'VES'];
  loading = false;
  notPass = false;
  invalidPass = false;
  confirmNewPass: string;
  passNotMatch = false;
  constructor(private auth: AuthService, private modalService: NgbModal,
    private logger: LoggerService) { }

  ngOnInit() {
    this.logger.log(this.component, 'Ingreso');
    this.user = this.auth.activeUser;
    this.auth.isLogged.subscribe(
      resp => {
        this.user = this.auth.activeUser;
      }
    );
  }

  validMail(){
    let valid = false;
    if(this.user.correo.includes('@') 
    && this.user.correo.includes('.')
    && this.user.correo.length > 7){
      this.invalidMail = false;
      valid = true;
    }else{    
      this.invalidMail = true;
    }    
    return valid;
  }

  open(){
    this.modalService.open(this.modalContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {}, (reason) => {});
  }

  compararPaises( pais1: string, pais2 :string) {
    if (pais1 == null || pais2 == null) {
      return false;
    }
    return pais1 === pais2;
  }

  guardar(){
    this.loading = true;
    this.logger.log(this.component, 'Actualiza datos', JSON.stringify(this.user));
    this.auth.update(this.user).subscribe(
      resp => {
        if(resp){
          Swal.fire(
            'Datos guardados!',
            '',
            'success'
          );          
        }else{
          this.logger.log(this.component, 'Error al guardar', JSON.stringify(resp));
          Swal.fire({
            icon: 'warning',
            title: 'Alerta...',
            text: 'No se ha podido ejecutar la operacion solicitada',
            footer: 'Intente en unos minutos'
          })
        }
        this.loading = false;
      }
    )
  }

  updatePassword(){
    if(this.validPasswordChange()){
      this.logger.log(this.component, 'Cambia Password');
      this.loading = true;
      this.auth.updatePass(this.user).subscribe(
        resp =>{
          this.modalService.dismissAll();
          if(resp){
            Swal.fire(
              'Contraseña cambiada!',
              '',
              'success'
            );          
          }else{
            this.logger.log(this.component, 'Error al cambiar pasword', JSON.stringify(resp));
            Swal.fire({
              icon: 'warning',
              title: 'Alerta...',
              text: 'Credenciales inválidas',
              footer: 'Intente nuevamente ingresando su actual contraseña correcta'
            })
          }
          this.loading = false;
        }
      )
    }
    
  }

  validPasswordChange(){
    let valid = true;
    if(this.user.password === null || this.user.password === undefined){
      this.notPass = true;
      valid = false;
    }else{
      this.notPass = false;
    }
    if(this.user.newPassword === null || this.user.newPassword === undefined || this.user.newPassword.length < 6){
      this.invalidPass = true;
      valid = false;
    }else{
      this.invalidPass = false;
    }

    if(this.confirmNewPass !== this.user.newPassword){
      this.passNotMatch = true;
      valid = false;
    }else{
      this.passNotMatch = false;
    }

    return valid;
  }

  comparar( item1: string, item2 :string) {
    if (item1 == null || item2 == null) {
      return false;
    }
    return item1 === item2;
  }

}
