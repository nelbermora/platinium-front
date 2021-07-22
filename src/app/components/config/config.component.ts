import { NgxSpinnerService } from 'ngx-spinner';
import { VersionService } from './../../services/version.service';
import { Config, Account } from './../../models/config.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  loading: boolean = false;
  config: Config = {
    bankAccounts : []
  };
  tempAccount: Account = {};
  
  dtSpanish = {
    'emptyTable': 'No hay registros para mostrar',
    'info': 'Pagina _PAGE_ de _PAGES_',
    'infoEmpty': '0 registros',
    'infoFiltered': '(encontrados _MAX_ registros)',
    'infoPostFix': '',
    'infoThousands': ' ',
    'loadingRecords': 'Procesando...',
    'lengthMenu': 'Mostrar _MENU_ registros',
    'processing': 'Procesando...',
    'search': 'Buscar:',
    'url': '',
    'zeroRecords': 'No hay registros',
    'paginate': {
      'first': 'Primera',
      'previous': 'Anterior',
      'next': 'Siguiente',
      'last': 'Ultima'
    },
    'aria': {
      'sortAscending': ': aktiver for å sortere kolonnen stigende',
      'sortDescending': ': aktiver for å sortere kolonnen synkende'
    }
  };

  dtopt: DataTables.Settings= {
    language: this.dtSpanish
  };
  constructor(private configSvc: VersionService, private spinnerSvc: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinnerSvc.show();
    this.configSvc.getVersion().subscribe(
      resp => {
        this.config = resp;
        this.spinnerSvc.hide();
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
      resp => (this.ngOnInit())
    );
  }

  isValidTempAccount(){
    let valid = false;
    if (this.tempAccount !== undefined && this.tempAccount !== null){
      if(this.tempAccount.bank !== undefined && this.tempAccount.bank !== null && this.tempAccount.bank.length > 0 
        && this.tempAccount.number !== undefined && this.tempAccount.number !== null && this.tempAccount.number.length > 0 
        && this.tempAccount.dni > 0){
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

}
