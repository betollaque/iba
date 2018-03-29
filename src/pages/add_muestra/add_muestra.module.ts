import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Add_muestra } from './add_muestra';

@NgModule({
  declarations: [Add_muestra],
  imports: [IonicPageModule.forChild(Add_muestra)],
  exports: [Add_muestra]
})
export class Add_muestraModule {}
