import {Component} from '@angular/core';
import {
  IonicPage,
  NavParams,
  NavController,
  ActionSheetController,
  ToastController,
  AlertController,
  LoadingController
} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {Storage} from '@ionic/storage';
import {Geolocation} from '@ionic-native/geolocation';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
//import {FilePath} from '@ionic-native/file-path';
import {File} from '@ionic-native/file';
import {Network} from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-resultado',
  templateUrl: 'resultado.html'
})
export class ResultadoPage {

  segmento: string = "seg1";
  zona: string;
  user: string;
  total_abi: number;
  total_fam = '';
  lat: number;
  lng: number;
  wifi: number;
  getFAM = '';
  FAMILIA = [];
  FAM_SELEC = [];
  HISTORIAL = [];
  color: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, private toastCtrl: ToastController, private alertCtrl: AlertController, public http: Http, public storage: Storage, public loadingCtrl: LoadingController, private geolocation: Geolocation,private transfer: FileTransfer, private file: File, private network: Network) {
    this.getFAM = this.navParams.get('FAM');

    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.wifi=1;
      console.log('no internet');
    });
    // stop disconnect watch
    //disconnectSubscription.unsubscribe();

    let connectSubscription = this.network.onConnect().subscribe(() => {
      this.wifi=2;
      console.log('SI internet');
    });
    // stop connect watch
    //connectSubscription.unsubscribe();
  }

  ionViewWillEnter() {

    this.storage.get('familias').then((val) => {
      if (val == null)
        this.Lista_F(); //carga la lista de ordenes y familias
      else
        this.FAMILIA=val;

    });

    this.storage.get('user').then((val) => {
      this.user = val;
      console.log('user:', val);
    });

    this.storage.get('zona').then((val) => {
      this.zona = val;
      console.log('Zona:', val);
    });

    this.storage.get('fam_selec').then((val) => {

      if (val != null) {
        this.FAM_SELEC = val;
        console.log('total cantidad:', this.FAM_SELEC);
      }

      if (this.getFAM && this.getFAM!=''){
        this.FAM_SELEC.push({FAM:this.navParams.get('FAM'), IBA:this.navParams.get('IBA')});
        this.storage.set('fam_selec', this.FAM_SELEC);
        console.log('agrega familia: ', this.navParams.get('FAM'));
      }
      this.totalFamilia();

    });

    this.storage.get('historial').then((val) => {
      if (val != null)
        this.HISTORIAL = val;

      console.log('historial:'+ this.HISTORIAL);
    });

    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat=resp.coords.latitude;
      this.lng=resp.coords.longitude;
      console.log('Latitud: ', this.lat);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  addFamilia() {
    if (this.zona == null) {
      let toast = this.toastCtrl.create({
        message: 'Debe seleccionar la zona! ',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } else {
      this.getFAM='';
      this.navCtrl.push('OpcionPage');
    }

  }

  borrarFamilia(index: number) {
    this.FAM_SELEC.splice(index, 1);
    this.storage.set('fam_selec', this.FAM_SELEC);
    console.log('borra:'+ index);
    this.totalFamilia();
  }

  totalFamilia() {
    this.total_abi=0;
    this.FAM_SELEC.forEach( (value, key, index) => {
      this.total_abi = this.total_abi + value.IBA;
      if(key==0)
        this.total_fam = value.FAM;
      else
        this.total_fam = value.FAM +','+ this.total_fam;
      //console.log("This is the value", value);
      //console.log("from the key", key);
      //console.log("Index is", index);
      //console.log("toota sss " + this.total_abi);
    });

    console.log("total ", this.total_abi);
    if (this.total_abi<11) this.color='sehrschlecht';
    if (this.total_abi>=11 && this.total_abi<=26) this.color='schlecht';
    if (this.total_abi>=27 && this.total_abi<=44) this.color='normal';
    if (this.total_abi>=45 && this.total_abi<=70) this.color='gut';
    if (this.total_abi>70) this.color='sehrgut';
  }
  setZona(id) {
    this.storage.set('zona', id).then((val) => {
      this.zona = val;
      console.log('refresh Zona:', val);
    });
  }

  sincroniza() {

    let loading = this.loadingCtrl.create({
      content: 'Sincronizando evaluaciones..',
    });
    loading.present();
    this.HISTORIAL.forEach( (value, key, index) => {
      //console.log("This is the value", value);
      //console.log("from the key", key);
      //console.log("Index is", index);
      if (value.usu==this.user && value.sta==1){ //filtra por usuario y estado pendiente
        let link = 'http://ecbiz222.inmotionhosting.com/~vigose5/abi/abiweb1.php';
        let parametro = JSON.stringify({a_usu: value.usu, a_fec: value.fec, a_lat: value.lat, a_lng: value.lng, a_pun: value.pun, a_fam: value.fam, a_obs: value.obs, a_lug: value.lug, a_gru: value.gru, a_zon: value.zon, metodo: 'sincro'});
        let headers = new Headers({'Content-Type': 'application/json'});
        this.http.post(link, parametro, {headers: headers})
          .subscribe(data => {
              let res = data.json();
              console.log('actualizado '+ value.usu +': ' + res.resultado + ' ID: ' + key);
              if (res.resultado) {
                this.HISTORIAL[key].sta = 0;
                this.storage.set('historial', this.HISTORIAL);
                console.log('actualiza el array q fue sincronizado');
              }

            },
            err => console.error(err)
          );
      }
    });
    //------------  this.storage.set('historial', this.HISTORIAL);
    loading.dismiss();

  }

  guardarHistorial() {

    let alert = this.alertCtrl.create({
      title: '',
      subTitle: '',
      inputs: [
        {
          name: 'lug',
          placeholder: 'Lugar'
        },
        {
          name: 'gru',
          placeholder: 'Codigo'
        },
        {
          name: 'obs',
          placeholder: 'Observaciones'
        }
      ],
      buttons: [
        {
          text: 'GUARDAR',
          handler: data => {
            if (data.lug != '') {
              let fecha = Date.now();
              this.HISTORIAL.push({
                usu: this.user,
                fec: fecha,
                lat: this.lat,
                lng: this.lng,
                pun: this.total_abi,
                fam: this.total_fam,
                obs: data.obs,
                lug: data.lug,
                gru: data.gru,
                zon: this.zona,
                col: this.color,
                sta: 1
              });

              this.storage.set('historial', this.HISTORIAL);
              this.storage.remove('fam_selec');
              this.FAM_SELEC = [];
              let toast = this.toastCtrl.create({
                message: 'Datos guardados en el historial! ',
                duration: 3000,
                position: 'top'
              });
              toast.present();
            } else {
              //alert.dismiss();
              let toast = this.toastCtrl.create({
                message: 'Debe ingresar el lugar! ',
                duration: 3000,
                position: 'top'
              });
              toast.present();
              return false; // para que no cierre el popup
            }

          }
        }
      ]
    });
    alert.present();


  }

  acceso() {
    let alert = this.alertCtrl.create({
      title: 'Autenticación',
      subTitle: 'Ingrese su usuario y contraseña',
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
          text: 'Entrar Oculto',
          cssClass: 'oculto',
          handler: data => {
            this.user = null;
            this.storage.set('user', this.user);
          }
        },
        {
          text: 'Entrar',
          handler: data => {
            let link = 'http://ecbiz222.inmotionhosting.com/~vigose5/abi/abiweb1.php';
            let parametro = JSON.stringify({user: data.username, pass: data.password, metodo: 'login_app'});
            let headers = new Headers({'Content-Type': 'application/json'});
            if (data.username != '' && data.password != '') {
              this.http.post(link, parametro, {headers: headers})
                .subscribe(data => {
                    let res = data.json();
                    this.user = res.resultado;
                    if (this.user == null) {
                      console.log('nulooooo ' + this.user);
                      let toast = this.toastCtrl.create({
                        message: 'Usuario o Contraseña invalidos! ',
                        duration: 2000,
                        position: 'top'
                      });
                      toast.present();
                    } else {
                      alert.dismiss();
                      this.storage.set('user', this.user);
                      console.log('usuario: ' + this.user);
                      //this.showTask();
                    }
                  },
                  err => console.error(err)
                );
            }
            return false; // para que no cierre el popup del login

          }
        }
      ]
    });
    alert.present();
  }

  fotos() {
    if(this.wifi==2){

      let confirm = this.alertCtrl.create({
        title: 'ACTUALIZAR FOTOS',
        message: 'Esto podria tardar varios minutos dependiendo de su velocidad de internet',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Actualizar',
            handler: () => {

              let carpeta = this.file.documentsDirectory; // para IOs
              //let carpeta = this.file.dataDirectory; // para Android
              const fileTransfer: FileTransferObject = this.transfer.create();
              let loading = this.loadingCtrl.create({
                content: 'Actualizando fotos..',
              });
              for (let i = 0; i < 138; i++) {
                loading.present();
                for (let j = 1; j < 7; j++) {
                  const url = 'http://ecbiz222.inmotionhosting.com/~vigose5/abi/img/'+(i+1)+'_'+j+'.jpg';
                  fileTransfer.download(url, carpeta + (i+1) +"_"+j+".jpg").then((entry) => {
                    console.log('download complete: ' + entry.toURL());  // I always enter here.
                  }, (error) => {
                    console.log('error');
                  });
                }
                loading.dismiss();
              }

            }
          }
        ]
      });
      confirm.present();

    } else {
      let toast = this.toastCtrl.create({
        message: 'Verifique su conexion a internet o vuelva a activar su Wifi',
        duration: 5000,
        position: 'top'
      });
      toast.present();
    }


  }

  borrarHistorial(index: number) {
    let confirm = this.alertCtrl.create({
      title: 'BORRAR',
      message: 'Esta seguro?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Borrar',
          handler: () => {
            this.HISTORIAL.splice(index, 1);
            //this.HISTORIAL[index].lug = 'xxxx'; //actualiza el lugar q se selecciona
            this.storage.set('historial', this.HISTORIAL);
          }
        }
      ]
    });
    confirm.present();
  }

  Lista_F() {
    // this.precarga.present();
    let link = 'http://ecbiz222.inmotionhosting.com/~vigose5/abi/abiweb1.php';
    let parametro = JSON.stringify({metodo: 'l_fam'});
    let headers = new Headers({'Content-Type': 'application/json'});
    this.http.post(link, parametro, {headers: headers})
      .subscribe(data => {
          let post_F = data.json();
          //this.precarga.dismiss();
          if (post_F == null) {
            console.log('falla_F ' + post_F);
          } else {
            this.storage.set('familias', post_F);
            this.FAMILIA=post_F;
            console.log('ok_F ');
          }
        },
        err => console.error(err)
      );

  }

}

