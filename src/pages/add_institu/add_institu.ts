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
  selector: 'page-add_institu',
  templateUrl: 'add_institu.html',
})
export class Add_institu {

  posts: any;
  precarga: any;
  getUSER: string;
  label: string;
  user: string;
  pass: string;
  nom: string;
  mai: string;

  constructor(public navCtrl: NavController, public viewCtrl:ViewController, public navParams: NavParams, public http: Http, private toastCtrl: ToastController, public loadingCtrl: LoadingController) {

    this.getUSER = navParams.get('USER');

    if (this.getUSER == 'new') {
      this.label = "Nuevo";
    } else {
      this.label = "Editar";
      this.preCarga();
      let link = 'http://ecbiz222.inmotionhosting.com/~vigose5/abi/abiweb1.php';
      let parametro = JSON.stringify({user: this.getUSER, metodo: 'v_user'});
      let headers = new Headers({'Content-Type': 'application/json'});
      this.http.post(link, parametro, {headers: headers})
        .subscribe(data => {
            this.posts = data.json();
            this.precarga.dismiss();

            if (this.posts == null) {
              console.log('falla ' + this.posts);
            } else {
              this.user = this.posts[0].user;
              this.pass = this.posts[0].pass;
              this.nom = this.posts[0].nom;
              this.mai = this.posts[0].mai;
              console.log('ok ' + this.user);
            }
          },
          err => console.error(err)
        );

    }

  }

  Guarda() {
    this.preCarga();
    let link = 'http://ecbiz222.inmotionhosting.com/~vigose5/abi/abiweb1.php';
    let parametro = JSON.stringify({getuser:this.getUSER,user:this.user,pass:this.pass,nom:this.nom,mai:this.mai, metodo: 'e_user'});
    let headers = new Headers({'Content-Type': 'application/json'});
    this.http.post(link, parametro, {headers: headers})
      .subscribe(data => {
          let res = data.json();
          this.precarga.dismiss();

          if (res.resultado == null) {
            console.log('falla ' + res.resultado);
            let toast = this.toastCtrl.create({
              message: 'Este usuario ya existe!',
              duration: 3000,
              position: 'top'
            });
            toast.present();
          } else {
            console.log('ok ' + res.resultado);
            this.Cierra();
          }
        },
        err => console.error(err)
      );

  }

  Cierra() {
    this.viewCtrl.dismiss();
  }

  preCarga() {

    this.precarga = this.loadingCtrl.create({
      content: ''
    });

    this.precarga.present();

  }

}
