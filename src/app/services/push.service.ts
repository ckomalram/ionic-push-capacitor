import { EventEmitter, Injectable } from '@angular/core';
import { OneSignal, OSNotification ,OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: OSNotificationPayload[]=[
    // {
    //   title: 'Titulo de la push',
    //   body: 'Cuerpo de la notificación',
    //   date: new Date()
    // }
  ];

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(private oneSignal: OneSignal, private storage: Storage) {
    this.init();
    this.cargarMensajes();
   }

   async getMensajes(){
    await this.cargarMensajes();
    return [...this.mensajes];
   }

  async init() {
    await this.storage.create();
    // console.log('instancia creada');
  }

  configuracionInicial(){
     // this.oneSignal.setLogLevel({ logLevel: 6, visualLevel: 0 });
     this.oneSignal.startInit('56036cdd-f2d4-4adb-92db-45b04052dd94', '55765949752');

     this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

     this.oneSignal.handleNotificationReceived().subscribe((noti) => {
       // do something when notification is received
       console.log('Notification received: ', noti);
       this.notificacionRecibida(noti);
     });

     this.oneSignal.handleNotificationOpened().subscribe((noti) => {
       // do something when a notification is opened
       console.log('Notification opened: ', noti);
     });

     this.oneSignal.endInit();
  }

  async notificacionRecibida(noti: OSNotification){

    await this.cargarMensajes();
      const payload = noti.payload;
      const existPush = this.mensajes.find(mensaje => mensaje.notificationID === payload.notificationID );

      // para prevenir duplicados
      if (existPush) {
        return;
      }

      this.mensajes.unshift(payload);
      this.pushListener.emit(payload);

      this.guardarMensajes();
  }

  guardarMensajes(){
    this.storage.set('mensajes',this.mensajes);
  }

  async cargarMensajes(){
    this.mensajes = await this.storage.get('mensajes') || [];
  }
}
