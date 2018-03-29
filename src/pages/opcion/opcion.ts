import { Component } from '@angular/core';
import { NavController, ModalController, IonicPage,ToastController,AlertController } from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {File} from '@ionic-native/file';
import {GalleryModal} from 'ionic-gallery-modal';

@IonicPage()
@Component({
  selector: 'page-opcion',
  templateUrl: 'opcion.html'
})
export class OpcionPage {

  FAMILIA = [];
  zona: string;
  carpeta: string;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public storage: Storage, private toastCtrl: ToastController, private alertCtrl: AlertController, private file: File) {

    this.carpeta = this.file.documentsDirectory; // para IOs
    //this.carpeta = this.file.dataDirectory; // para Android

    this.storage.get('familias').then((val) => {
      //this.FAMILIA = val;
      let carsByDest = {};
      val.forEach((car) => {
        if (!carsByDest[car.orden]) {
          carsByDest[car.orden] = [];
        }

        carsByDest[car.orden].push(car);
      });
      for (let dest in carsByDest) {
        this.FAMILIA.push({orden: dest, fams: carsByDest[dest]});
      }
    });

    this.storage.get('zona').then((val) => {
      this.zona = val;
    });

  }

  addFamilia(id,ord,fam,abi) {

    this.navCtrl.push('ResultadoPage',{FAM:ord+': '+fam, IBA:abi});
    console.log("aver "+ id);
  }

  verFoto(id,titulo) {

    //url: this.carpeta+id+'_'+i+'.jpg',
    // http://ecbiz222.inmotionhosting.com/~vigose5/abi/img/

    let modal = this.modalCtrl.create(GalleryModal, {
      photos: [{
        url: this.carpeta+id+'_1.jpg'
      },{
        url: this.carpeta+id+'_2.jpg'
      },{
        url: this.carpeta+id+'_3.jpg'
      },{
        url: this.carpeta+id+'_4.jpg'
      },{
        url: this.carpeta+id+'_5.jpg'
      },{
        url: this.carpeta+id+'_6.jpg'
      }],
      initialSlide: 0,
    });
    modal.present();
  }

  verFoto2(foto, titulo) {
    console.log("foto2: "+foto);
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: [{
        url: 'assets/imgs/' + foto
      }],
      initialSlide: 0,
    });
    modal.present();
  }

  toggleSection(i) {
    this.FAMILIA[i].open = !this.FAMILIA[i].open;
  }

}
