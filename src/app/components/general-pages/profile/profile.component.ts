import { LoggerService } from "./../../../services/logger.service";
import { User } from "./../../../models/user.model";
import { AuthService } from "./../../../services/auth.service";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  @ViewChild("content") modalContent: TemplateRef<any>;
  component = "Profile";
  user: User = {};
  invalidMail = false;
  paises = [
    "Antigua y Barbuda",
    "Argentina",
    "Bahamas",
    "Barbados",
    "Belice",
    "Bolivia",
    "Brasil",
    "Canadá",
    "Chile",
    "Colombia",
    "Costa Rica",
    "Cuba",
    "Dominica",
    "Dominicana",
    "Ecuador",
    "El Salvador",
    "Estados Unidos de América",
    "Granada",
    "Guatemala",
    "Guyana",
    "Haití",
    "Honduras",
    "Jamaica",
    "México",
    "Nicaragua",
    "Panamá",
    "Paraguay",
    "Perú",
    "Saint Kitts y Nevis",
    "San Vicente y las Granadinas",
    "Santa Lucía",
    "Suriname",
    "Trinidad y Tabago",
    "Uruguay",
    "Venezuela",
  ];
  currencies = [    
    {codigo: "EUR",desc:"Euros"},
    {codigo: "USD",desc:"Dolares"},    
    {codigo: "CLP",desc:"Pesos Chilenos"},
    {codigo: "COP",desc:"Pesos Colombianos"},    
    {codigo: "VES",desc:"Bolívares"}
    /*
    {codigo: "ARS",desc:"Pesos Argentinos"},
    {codigo: "BRL",desc:"Reales"},
    
    
    {codigo: "PEN",desc:"Soles Peruanos"},*/
    
    ];
  loading = false;
  notPass = false;
  invalidPass = false;
  confirmNewPass: string;
  passNotMatch = false;
  active: string = "basic";
  constructor(
    private auth: AuthService,
    private modalService: NgbModal,
    private logger: LoggerService,
    private route: ActivatedRoute,
    private spinnerSvc: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinnerSvc.show();
    this.logger.log(this.component, "Ingreso");
    this.auth.get().subscribe(
      (resp: User) => {
        this.spinnerSvc.hide();
        this.user = resp;
      }
    );
    this.route.queryParams.subscribe((params) => {
      if (params.tab === "b") {
        this.active = "banc";
      }
      if (params.tab === "i") {
        this.active = "basic";
      }
    });
  }

  validMail() {
    let valid = false;
    if (
      this.user.correo.includes("@") &&
      this.user.correo.includes(".") &&
      this.user.correo.length > 7
    ) {
      this.invalidMail = false;
      valid = true;
    } else {
      this.invalidMail = true;
    }
    return valid;
  }

  open() {
    this.modalService
      .open(this.modalContent, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  compararPaises(pais1: string, pais2: string) {
    if (pais1 == null || pais2 == null) {
      return false;
    }
    return pais1 === pais2;
  }

  guardar() {
    
      if (this.isValid()) {
        this.loading = true;
        this.logger.log(
          this.component,
          "Actualiza datos",
          JSON.stringify(this.user)
        );
        this.auth.update(this.user).subscribe((resp:any) => {
          if (resp) {
            if(resp.affected >= 0){
              Swal.fire(
                "Datos guardados!",
                "Ahora que comience la diversión!",
                "success"
              );
            }else{
              Swal.fire(
                "Cambio no guardado",
                "La moneda de su cuenta no puede ser distinta a la moneda en la que efectuó la carga de fondos.",
                "error"
              );
            }
            
          } else {
            this.logger.log(
              this.component,
              "Error al guardar",
              JSON.stringify(resp)
            );
            Swal.fire({
              icon: "warning",
              title: "Alerta...",
              text: "No se ha podido ejecutar la operacion solicitada",
              footer: "Intente en unos minutos",
            });
          }
          this.loading = false;
        });      
    }
  }

  updatePassword() {
    if (this.validPasswordChange()) {
      this.logger.log(this.component, "Cambia Password");
      this.loading = true;
      this.auth.updatePass(this.user).subscribe((resp) => {
        this.modalService.dismissAll();
        if (resp) {
          Swal.fire("Contraseña cambiada!", "", "success");
        } else {
          this.logger.log(
            this.component,
            "Error al cambiar pasword",
            JSON.stringify(resp)
          );
          Swal.fire({
            icon: "warning",
            title: "Alerta...",
            text: "Credenciales inválidas",
            footer:
              "Intente nuevamente ingresando su actual contraseña correcta",
          });
        }
        this.loading = false;
      });
    }
  }

  validPasswordChange() {
    let valid = true;
    if (this.user.password === null || this.user.password === undefined) {
      this.notPass = true;
      valid = false;
    } else {
      this.notPass = false;
    }
    if (
      this.user.newPassword === null ||
      this.user.newPassword === undefined ||
      this.user.newPassword.length < 6
    ) {
      this.invalidPass = true;
      valid = false;
    } else {
      this.invalidPass = false;
    }

    if (this.confirmNewPass !== this.user.newPassword) {
      this.passNotMatch = true;
      valid = false;
    } else {
      this.passNotMatch = false;
    }

    return valid;
  }

  comparar(item1: string, item2: string) {
    if (item1 == null || item2 == null) {
      return false;
    }
    return item1 === item2;
  }

  isValid() {
    let valid = true;
    
    if(this.user.documento === undefined
      || this.user.documento == 0){
      Swal.fire({
        icon: "warning",
        title: "Falta poco...",
        text: "Debe completar Numero de documento",        
      });
      this.active = 'id';
      valid = false;
    }
    
    if(this.user.primerNombre === undefined ||
      this.user.primerNombre === null ||
      this.user.primerNombre.length === 0){
        Swal.fire({
          icon: "warning",
          title: "Falta poco...",
          text: "Por favor completar su nombre",        
        });
        this.active = 'basic';
        valid = false;
      }

    if(this.user.cuenta === undefined ||
      this.user.cuenta === null ||
      this.user.cuenta.length === 0 || 
      this.user.banco === undefined ||
      this.user.banco === null ||
      this.user.banco.length === 0 || 
      this.user.moneda === undefined ||
      this.user.moneda === null ||
      this.user.moneda.length === 0 ){
        Swal.fire({
          icon: "warning",
          title: "Por último...",
          text: "Por favor completar todos los datos bancarios",        
        });
        this.active = 'basic';
        valid = false;
      }
    return valid;
  }

  invalidBirthday(){
    let invalid = true;
    let fecnac = new Date(this.user.fechaNacimiento);    
    if(fecnac.getFullYear() > 0){
      invalid = false;
    }
    return invalid;
  }
}
