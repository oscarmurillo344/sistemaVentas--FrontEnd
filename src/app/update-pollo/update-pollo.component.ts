import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { updatePollo } from '../clases/productos/updatePollo';
import { DataService } from '../service/data.service';
import { InventarioService } from '../service/inventario.service';
import { Router } from '@angular/router';
import { Inventario } from '../clases/productos/inventario';
import { Subject } from 'rxjs';
import { LocalstorageService } from '../service/localstorage.service';

@Component({
  selector: 'app-update-pollo',
  templateUrl: './update-pollo.component.html',
  styleUrls: ['./update-pollo.component.css']
})
export class UpdatePolloComponent implements OnInit {

  PollosForm:FormGroup;
  update:updatePollo;
  update2:updatePollo;
  productLista:Array<Inventario>=new Array();
  constructor(
    private __serviceinven:InventarioService,
    private toast:ToastrService,
    private datas:DataService,
    private route:Router,
    private local:LocalstorageService
  ) 
  { 
  }
  ngOnInit() {
    this.PollosForm=this.crearForm();
  }
 crearForm(){
   return new FormGroup({
     pollo:new FormControl(0,[Validators.required,Validators.min(0)]),
     presa:new FormControl(0,[Validators.required,Validators.max(8),Validators.min(0)]),
     validar:new FormControl()
   });
 }

 ActualizarPollo(){
   if (this.PollosForm.valid){
     this.update=new updatePollo(this.PollosForm.value.pollo,
      this.PollosForm.value.presa)
      if(!this.PollosForm.value.validar){
        let id: number
        this.productLista=this.local.GetStorage("listaProducto");
        this.productLista.forEach(data=> data.productoId.tipo==='mercaderia' ?id=data.id:id=0)
        this.__serviceinven.UpdatePollo(id,this.update).
        subscribe(data=>{
          this.datas.pollo+=this.PollosForm.value.pollo;
          this.datas.presa+=this.PollosForm.value.presa;
          this.update2=new updatePollo(this.datas.pollo,this.datas.presa);
          this.toast.success(data.mensaje,"Exitoso");
          this.PollosForm.reset();
          this.__serviceinven.TablePollo(this.update2).
          subscribe(data=>this.route.navigate(["/inicio"]));
        },error=>{
          if(error.error.mensaje===undefined) this.toast.error("Error en la consulta","Error");
          else this.toast.error(error.error.mensaje,"Error");
        })
      }else{
        this.__serviceinven.TablePollo(this.update).
        subscribe(data=> this.route.navigate(["/inicio"]));
        this.datas.pollo=this.PollosForm.value.pollo;
        this.datas.presa=this.PollosForm.value.presa;
        this.toast.success("Pollo actualizado","Exitoso");
        this.PollosForm.reset();
      }
   }
 }
}
