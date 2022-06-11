import { ApplicationRef, Component, OnInit } from '@angular/core';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mensajes: OSNotificationPayload[]=[
  ];

  constructor(private pushservices: PushService, private appref: ApplicationRef ) {}

  ngOnInit(): void {
    this.pushservices.pushListener.subscribe(noti => {
      this.mensajes.unshift(noti);
      /* A method that forces the view to update. */
      this.appref.tick();
    });
  }

  async ionViewWillEnter(){
    console.log('ionViewWillEnter');
    this.mensajes =  await this.pushservices.getMensajes();
  }

}
