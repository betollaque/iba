import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Add_institu } from './add_institu';

@NgModule({
  declarations: [Add_institu],
  imports: [IonicPageModule.forChild(Add_institu)],
  exports: [Add_institu]
})
export class Add_instituModule {}
