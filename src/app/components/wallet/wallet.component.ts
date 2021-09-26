import { Router } from '@angular/router';
import { WalletService } from './../../services/wallet.service';
import { AuthService } from './../../services/auth.service';
import { WalletMovement } from './../../models/wallet-movement.model';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit, AfterViewInit {
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
    language: this.dtSpanish,
    ordering: false
  };
  dtTrigger: Subject<any> = new Subject<any>();
  movements: WalletMovement[] = [];
  userId: number;
  saldo: number;
  component = "Wallet";
  constructor(private authSvc: AuthService, private walletSvc: WalletService,
    private router: Router, private logger: LoggerService) { }

  ngOnInit(): void {
    this.logger.log(this.component, 'Ingreso');
    this.userId = this.authSvc.activeUser.id;
    this.authSvc.isLogged.subscribe(
      resp =>{
        this.userId = this.authSvc.activeUser.id;
      }
    );
  }

  ngAfterViewInit(): void {    
    this.walletSvc.getMovements(this.userId).subscribe(
      (resp: any) => {
        this.saldo = resp.saldo;
        this.movements = resp.movimientos;
        this.dtTrigger.next();    
      }
    );
  }

  goRetirar(){
    this.router.navigate(['/payments'], { queryParams: { tab: 'r' } });
  }

}
