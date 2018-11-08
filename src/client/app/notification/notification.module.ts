import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';

import { NotificationPage } from './notification.page';
import { NotificationRoutingModule} from './notification-routing.module';
import { NotificationService } from './notification.service';
import { DateFormatPipe } from './notification.dateformat.pipe';
import { LayoutModule } from './../../sl-ui-framework/layout/layout.module';
@NgModule({
  imports: [ HttpModule, CommonModule, FormsModule, SharedModule, NotificationRoutingModule, LayoutModule ],
  declarations: [ NotificationPage, DateFormatPipe],
  providers: [NotificationService],
})
export class NotificationModule {
}
