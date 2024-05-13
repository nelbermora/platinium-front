import { NgxSpinnerService } from 'ngx-spinner';
import { VersionService } from './../../services/version.service';
import { Config, Account } from './../../models/config.model';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit, AfterViewInit {
  paises = ['EUR', 'USD'];
  /*paises = ['Antigua y Barbuda',
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
  'Venezuela'];*/
  loading: boolean = false;
  config: Config = {
    bankAccounts : []
  };
  tempAccount: Account = {
    pais: ""
  };
  
  dtTrigger: Subject<any> = new Subject<any>();

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

  dtopt: DataTables.Settings= {
    language: this.dtSpanish
  };
  constructor(private configSvc: VersionService, private spinnerSvc: NgxSpinnerService) { }
  

  ngOnInit(): void {
    this.configSvc.getVersion().subscribe(
      resp => {
        this.config = resp;
        this.dtopt = {
          language: this.dtSpanish
        };         
        this.spinnerSvc.hide();
      }
    );    
    
  }

  ngAfterViewInit(): void {
    this.configSvc.getVersion().subscribe(
      resp => {
        this.config = resp;
        this.dtopt = {
          language: this.dtSpanish
        }; 
        this.dtTrigger.next();        
      }
    );    
  }

  guardar(){
    this.spinnerSvc.show();
    this.configSvc.saveConfig(this.config).subscribe(
      resp => (this.ngOnInit())
    );
  }

  addAcount(){
    this.spinnerSvc.show();
    this.config.bankAccounts.push(this.tempAccount);
    this.configSvc.saveConfig(this.config).subscribe(
      resp => {
        this.tempAccount = {}
        this.ngOnInit();
      }
    );
  }

  isValidTempAccount(){
    let valid = false;
    if (this.tempAccount !== undefined && this.tempAccount !== null){
      if(this.tempAccount.bank !== undefined && this.tempAccount.bank !== null && this.tempAccount.bank.length > 0 
        && this.tempAccount.number !== undefined && this.tempAccount.number !== null && this.tempAccount.number.length > 0 
        && this.tempAccount.dni !==undefined && this.tempAccount.dni > 0 && this.tempAccount.pais.length > 0){
        valid = true;
      }
    }     
    return valid;
  }

  delete(index: number){
    this.spinnerSvc.show();
    this.config.bankAccounts.splice(index,1);
    this.config.bankAccounts.push(this.tempAccount);
    this.configSvc.saveConfig(this.config).subscribe(
      resp => (this.ngOnInit())
    );
  }

  compararPaises( pais1: string, pais2 :string) {
    if (pais1 == null || pais2 == null) {
      return false;
    }
    return pais1 === pais2;
  }

}
