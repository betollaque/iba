import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReactionsPage } from './reactions';

@NgModule({
  declarations: [ReactionsPage],
  imports: [IonicPageModule.forChild(ReactionsPage)],
  exports: [ReactionsPage]
})
export class ReactionsPageModule {}
