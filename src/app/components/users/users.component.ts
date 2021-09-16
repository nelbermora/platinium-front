import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild("content") modalContent: TemplateRef<any>;
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: any = DataTableDirective;
  dtSpanish = {
    'emptyTable': 'No hay registros para mostrar',
    'info': 'Mostrando _START_ a _END_ de _TOTAL_ registros',
    'infoEmpty': '0 registros',
    'infoFiltered': '(Total _MAX_)',
    'loadingRecords': 'Procesando...',
    'lengthMenu': 'Mostrar _MENU_ por pagina',
    'processing': 'Procesando...',
    'search': 'Buscar:',
    'url': '',
    'zeroRecords': 'No hay registros',
    'paginate': {
      'first': 'Primera',
      'previous': 'Anterior',
      'next': 'Siguiente',
      'last': 'Ultima'
    }
  };

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

  types = ['Admin',
  'Jugador',
  'Taquilla'];

  dtopt: DataTables.Settings= {
    language: this.dtSpanish
  };
  dtTrigger: Subject<any> = new Subject<any>();
  dtElement: DataTableDirective;

  users: User[] = [];
  user: User = {
    type: "Jugador"
  };
  currencies = [
    {codigo: "ARS",desc:"Pesos Argentinos"},
    {codigo: "BRL",desc:"Reales"},
    {codigo: "CLP",desc:"Pesos Chilenos"},
    {codigo: "COP",desc:"Pesos Colombianos"},
    {codigo: "USD",desc:"Dolares"},
    {codigo: "PEN",desc:"Soles Peruanos"},
    {codigo: "VES",desc:"Bolívares"}
    ];
  fieldErrors: boolean = false;
  alreadyExists: boolean = false;
  isLoading: boolean = false;
  constructor(private userSvc: AuthService, private modalService: NgbModal,
    private router: Router, private spinnerSvc: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinnerSvc.show();
    this.users = [];
    this.userSvc.getAll().subscribe(
      (resp: any) => {
        this.users = resp;
        this.dtopt = {
          language: this.dtSpanish
        };
        this.spinnerSvc.hide();
      }
    );
  }

  ngAfterViewInit(): void {
    this.userSvc.getAll().subscribe(
      (resp: any) => {
        this.users = resp;
        this.dtopt = {
          language: this.dtSpanish
        };
        this.dtTrigger.next();
      }
    );    
  }

  open(index?: number) {
    if(index !== null && index !== undefined){
      this.user = this.users[index];
    }else{
      this.user = {type: "Jugador"};
    }
    this.modalService.open(this.modalContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {}, (reason) => {});
  }

  saveUser(){
    if(this.isUserValid()){
      this.spinnerSvc.show();
      this.isLoading = true;
      this.userSvc.update(this.user).subscribe(
        (resp: any) => {
          if(this.user.id !== undefined && this.user.id > 0){
            this.isLoading = false;
            this.spinnerSvc.hide();
            Swal.fire(
              'Cambios guardados!',
              '',
              'success'
            );  
            this.modalService.dismissAll();
            this.alreadyExists = false;
            this.ngOnInit();            
          }else{
            if (resp.id == null){
              this.alreadyExists = true;
              this.isLoading = false;
            }else{
              this.isLoading = false;
              this.modalService.dismissAll();
              this.alreadyExists = false;
              Swal.fire(
                'Cambios guardados!',
                '',
                'success'
              );
              this.user.id = resp.id;                        
              this.user.status = 'A';
              this.users.push(this.user);
              this.user = {};
              this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy();
                this.dtTrigger.next();
              });
              this.spinnerSvc.hide();
            }            
          }
          
        }
      );
      this.fieldErrors = false;  
    }else{
      this.fieldErrors = true;
    }    
  }

  isUserValid(){
    let valid = false;
    if(
      this.user.correo !== undefined && this.user.correo.length > 0
      && this.user.primerNombre !== undefined && this.user.primerNombre.length > 0
      && this.user.primerApellido !== undefined && this.user.primerApellido.length > 0
      && this.user.paisResidencia !== undefined && this.user.paisResidencia.length > 0      
    ){
      valid = true;
    }
    return valid;
  }

  compararPaises( pais1: string, pais2 :string) {
    if (pais1 == null || pais2 == null) {
      return false;
    }
    return pais1 === pais2;
  }

  compararTypes( pais1: string, pais2 :string) {
    if (pais1 == null || pais2 == null) {
      return false;
    }
    return pais1 === pais2;
  }

  comparar(item1: string, item2: string) {
    if (item1 == null || item2 == null) {
      return false;
    }
    return item1 === item2;
  }

  disable(index: number){
    this.users[index].status = 'B';
    this.userSvc.update(this.users[index]).subscribe();
  }

  enable(index: number){
    this.users[index].status = 'A';
    this.userSvc.update(this.users[index]).subscribe();
  }

  goBets(id: number, emailUser: string){
    this.router.navigate(['/mybets'], { queryParams: { idUser: id, user: emailUser } });
  }

}
