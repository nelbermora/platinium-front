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
    'infoEmpty': 'Viser 0 til 0 av 0 linjer',
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
  constructor() { }

  ngOnInit(): void {
  }

  guardar(){

  }

  addAcount(){
    this.config.bankAccounts.push(this.tempAccount);
    this.tempAccount = {};
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

}
