import {Component} from '@angular/core';
import {
  IonicPage,
  NavController,
  ViewController,
  ToastController,
  LoadingController,
  NavParams
} from 'ionic-angular';
import {Http, Headers} from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-add_muestra',
  templateUrl: 'add_muestra.html',
})
export class Add_muestra {

  precarga: any;
  getORDEN: string;
  getTITULO: string;

  constructor(public navCtrl: NavController, public viewCtrl:ViewController, public navParams: NavParams, public http: Http, private toastCtrl: ToastController, public loadingCtrl: LoadingController) {

    this.getORDEN = navParams.get('ORDEN');
    this.getTITULO = navParams.get('TITULO');

  }

  Cierra() {
    this.viewCtrl.dismiss();
  }

  preCarga() {

    this.precarga = this.loadingCtrl.create({
      content: 'Subiendo imagen..'
    });

    this.precarga.present();

  }

}
