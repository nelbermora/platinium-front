import { User } from './../../../models/user.model';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild("content") modalContent: TemplateRef<any>;
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
  constructor(private auth: AuthService, private modalService: NgbModal) { }

  ngOnInit() {
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

}
