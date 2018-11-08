import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnouncementComponent } from './announcement/announcement.component';
import { InfrastructureModule } from './../infrastructure/infrastructure.module';
import { StearnsHttpClient } from './../infrastructure/http-client/http-client.service';


@NgModule({
  imports: [ CommonModule, InfrastructureModule ],
  declarations: [ AnnouncementComponent ],
  exports: [ AnnouncementComponent ],
  providers: [StearnsHttpClient]
})
export class CommunicationModule { }
