import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-pesaje',
  templateUrl: './detalle-pesaje.component.html',
  styleUrls: ['./detalle-pesaje.component.scss']
})
export class DetallePesajeComponent implements OnInit {

  title = 'Detalle Pesaje'
  parcialidades : any= []
  idCuenta: any;
  idPesaje: any;

  idParcialidadActualizar:any;
  medidaPesoActualizar:any;

  medidaPeso:any = "kg";
  codigoMedida: any;

  usuarioActual: any;

  public formPeso = new FormGroup({
    peso: new FormControl(null, [Validators.required, Validators.min(1)]),
    observaciones: new FormControl(null, [Validators.required]),
  });

  constructor( private servicios: ServiciosAgricultor, private router: Router, 
    private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {

    this.idCuenta =  (this.route.snapshot.paramMap.get("idCuenta"));
    this.idPesaje =  (this.route.snapshot.paramMap.get("idPesaje"));
    this.codigoMedida = (this.route.snapshot.paramMap.get("codigo"));
    this.medidaPeso = (this.route.snapshot.paramMap.get("medida"));

    this.servicios.obtenerParcialidadesIdCuenta(this.idCuenta).subscribe(resp =>{
      console.log("Respuesta ==== " , resp)
      this.parcialidades = resp;
    })

    this.usuarioActual = sessionStorage.getItem("usuarioActual")
    //para validar que el usuario esté autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

  }


  regresar(){
    location.href = 'bandeja-principal'
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

  settearDatos(parcialidad:any, codigo:any){
    this.idParcialidadActualizar = parcialidad;
    this.codigoMedida = codigo; 
    // this.medidaPesoActualizar = medida==null ? "kg" : medida;

  }


  actualizarPeso(){
    console.log("holi")
    /**
    {
  "idParcialidad": 0,
  "idCuenta": 0,
  "observaciones": "string",
  "pesoObtenido": 0,
  "fechaPeso": "2023-05-24T17:50:47.588Z",
  "usuarioModifico": "string"
}

     */

    let form = this.formPeso.controls

    let data = {
      "idParcialidad" : this.idParcialidadActualizar, 
      "idCuenta": Number(this.idCuenta),
      "observaciones": form.observaciones.value,
      "pesoObtenido" : form.peso.value,
      // "fechaPeso" : new Date().toISOString,
      "codigoPeso": this.codigoMedida,
      "usuarioModifico": this.usuarioActual
    }

    console.log("datos para actualizar peso ==== " , data)

    this.servicios.actualizarPeso(data).toPromise().then(
      data =>{
        console.log("data ==== " , data)
      }
    ).catch(err => {
      console.log("entra al error ===== " , err.status)
      if(err.status == 200 || err.status == 201){
        this.mensajeExitoActualizar();
      }
      else{
        this.mostrarMensajeError(err.error)
      }
    });;
  }


  mostrarMensajeError(texto:any){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: texto,
    })
    // location.reload
  }


  mensajeExitoActualizar(){
    Swal.fire({
      title: "Se actualizó el peso de la parcialidad",
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'Se actualizó con éxito',
    }).then((result) => {
      // location.href = 'bandeja-principal'
      location.reload()
    });
    
  }

}
