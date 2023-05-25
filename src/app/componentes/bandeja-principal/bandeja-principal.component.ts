import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-bandeja-principal',
  templateUrl: './bandeja-principal.component.html',
  styleUrls: ['./bandeja-principal.component.scss']
})
export class BandejaPrincipalComponent implements OnInit {

  title = 'Bandeja Principal'
  pesajes : any= []
  pesajes2: any=[]
  transportes: any=[]
  transportistas: any=[]
  tabMostrar='';
  tab1 = true;
  tab2 = false;
  tab3 = false;
  nitAgricultor :any;
  cuentas : any=[];
  usuarioActual:any;
  placaValida=false; 
  nombreValido=false;
  minDate:any



  constructor( private servicios: ServiciosAgricultor, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
   
     this.nitAgricultor = sessionStorage.getItem('nitAgricultor')
     
    this.servicios.obtenerCuentas().subscribe(resp =>{
      console.log("Respuesta ==== " , resp)
      this.pesajes = resp;
      this.pesajes2 = resp;
    })

  
    //para validar que el usuario esté autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

    // this.usuarioActual = 'localhost' //sessionStorage.getItem('usuarioActual')
    this.usuarioActual = sessionStorage.getItem("usuarioActual")

    console.log("usuarioActual === ", this.usuarioActual)

  }

  mostrar(tab:string){

    if(tab == 'home'){
      console.log("tab 1")
      this.tab1 = true;
    }
  }

  mensajeExito(){
    Swal.fire({
      title: "El pesaje se ha creado con éxito.",
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'Se creó con éxito',
    }).then((result) => {
      location.href = 'bandeja-principal'
    });
  }

  obtenerCantidadParcialidades( idCuenta: number){

  }

  formatoFecha( fecha: Date){
    if (fecha == null) return null;
    let f2 = (fecha?.toString().split('T'))[0].split('-');
    return (f2[2]+'-'+ f2[1]+ '-' + f2[0])
  }

  fechaActual(){
    let date = new Date().toISOString()
    let f2 = (date.toString().split('T'))[0].split('-');
    return (f2[2]+'-'+ f2[1]+ '-' + f2[0])
  }


  obtenerEstado(idCuenta:number){
    let nombreEstado =[]; 
    nombreEstado = this.cuentas.filter( (data: any) => {
      if(data.idCuenta == idCuenta){
        return data.idEstado.nombre
      }
    })
    return nombreEstado[0]?.idEstado.nombre
  }


  estado(dato:any){
    if (dato){
      return "Activo"
    }
    else{
      return "Inactivo"
    }
  }


  disponible(dato:any){
    if (dato){
      return "Disponible"
    }
    else{
      return "No Disponible"
    }
  }


  mostrarMensajeError(texto:any){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: texto,
    })
  }

}
