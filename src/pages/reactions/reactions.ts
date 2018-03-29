import { Component } from '@angular/core';
import {
  IonicPage,
  ModalController,
  NavController,
  ActionSheetController,
  ToastController,
  AlertController,
  LoadingController
} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-reactions',
  templateUrl: 'reactions.html',
})
export class ReactionsPage {

  lab: string;

	constructor(private navCtrl: NavController, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController, private toastCtrl: ToastController, private alertCtrl: AlertController, public http: Http, public storage: Storage, public loadingCtrl: LoadingController) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ReactionsPage');
	}

  acceso() {
    let alert = this.alertCtrl.create({
      title: 'Autenticación',
      subTitle: 'Ingrese su usuario y contraseña',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'username',
          placeholder: 'Usuario'
        },
        {
          name: 'password',
          placeholder: 'Contraseña',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Entrar',
          handler: data => {
            let link = 'http://ecbiz222.inmotionhosting.com/~vigose5/abi/abiweb1.php';
            let parametro = JSON.stringify({user: data.username, pass: data.password, metodo: 'login'});
            let headers = new Headers({'Content-Type': 'application/json'});
            if (data.username != '' && data.password != '') {
              this.http.post(link, parametro, {headers: headers})
                .subscribe(data => {
                    let res = data.json();
                    this.lab = res.resultado;
                    if (this.lab == null) {
                      console.log('nulooooo ' + this.lab);
                      let toast = this.toastCtrl.create({
                        message: 'Usuario o Contraseña invalidos! ',
                        duration: 2000,
                        position: 'top'
                      });
                      toast.present();
                    } else {
                      alert.dismiss();
                      console.log('jojojuuuu ' + this.lab);
                      //this.showTask();
                    }
                  },
                  err => console.error(err)
                );
            }
            console.log('oe queeee ' + this.lab);

            return false; // para que no cierre el popup del login

          }
        }
      ]
    });
    alert.present();
  }

  zona(id){
    this.storage.set('zona', id);
    console.log('zona ' + id);
  }

  salir(){
    this.acceso();
  }

}
