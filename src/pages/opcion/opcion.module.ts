import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OpcionPage } from './opcion';

@NgModule({
  declarations: [OpcionPage],
  imports: [IonicPageModule.forChild(OpcionPage)],
  exports: [OpcionPage]
})
export class OpcionPageModule { }
