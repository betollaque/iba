import {NgModule, ErrorHandler} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {FormsModule} from '@angular/forms';
import {IonicStorageModule} from '@ionic/storage';
import {Geolocation} from '@ionic-native/geolocation';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import {Network} from '@ionic-native/network';
import * as ionicGalleryModal from 'ionic-gallery-modal';
import {HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,HttpModule,FormsModule,IonicStorageModule,ionicGalleryModal.GalleryModalModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    FileTransfer,
    FileTransferObject,
    File,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: HAMMER_GESTURE_CONFIG, useClass: ionicGalleryModal.GalleryModalHammerConfig}
  ]
})
export class AppModule {}
