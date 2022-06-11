import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { PushService } from './services/push.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor( private platform: Platform, private pushservice: PushService) {
    this.init();
  }

  init() {
    this.platform.ready().then(() => {
     this.pushservice.configuracionInicial();
    });
  }
}
