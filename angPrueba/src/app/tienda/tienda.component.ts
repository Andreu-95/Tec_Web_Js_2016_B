import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {Http} from "@angular/http";
import {MasterURLService} from "../services/master-url.service";

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {
  title: string = 'Bienvenido a Ingresar Tiendas';

  nuevaTienda = {};
  error: string = 'No hay errores';
  disabledButtons = {
    NuevaTiendaFormSubmitButton: false
  };
  tiendas = [];

  constructor(private _http: Http, private _masterURL: MasterURLService) {
    console.log('Inicio el constructor');
  }

  ngOnInit() {
    this._http
      .get(this._masterURL.url + 'Tienda')
      .subscribe(
        res => {
          this.tiendas = res.json()
            .map((value) => {
              value.formularioCerrado = true;
              return value;
            })
        },
        err => {
          console.log('Error GET: ', err)
        }
      )
  }

  crearTienda(formulario: NgForm) {
    this.disabledButtons.NuevaTiendaFormSubmitButton = true;
    this._http
      .post(this._masterURL.url + 'Tienda', {
        nombre: formulario.value.nombre
      })
      .subscribe(
        res => {
          console.log('Respuesta: ', res);
          this.nuevaTienda = {};
          this.disabledButtons.NuevaTiendaFormSubmitButton = false;
          this.tiendas.push(res.json());
        },
        err => {
          console.log('Error: ', err);
          this.disabledButtons.NuevaTiendaFormSubmitButton = false;
        },
        () => {
          console.log("Se completo la accion")
        }
      );
  }

  borrarTienda(id: number) {
    let parametros = {
      id: id
    };
    this._http
      .delete(this._masterURL.url + "Tienda/" + parametros.id)
      .subscribe(
        res => {
          let tiendaBorrada = res.json();
          this.tiendas = this.tiendas.filter(value => tiendaBorrada.id != value.id)
        },
        err => {
          console.log(err)
        }
      )
  }

  actualizarTienda(tienda: any) {
    let parametros = {
      nombre: tienda.nombre
    };
    this._http
      .put(this._masterURL.url + 'Tienda/' + tienda.id, parametros)
      .subscribe(
        res => {
          console.log('Respuesta: ', res.json());
          tienda.formularioCerrado = true;
        },
        err => {
          console.log('Error: ', err)
        }
      )
  }
}
