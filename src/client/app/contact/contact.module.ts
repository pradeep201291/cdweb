import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { LayoutModule } from './../../sl-ui-framework/layout/layout.module';

import { ContactPage } from './../contact/contact.page';
import { ContactCardComponent } from '../contact/contact-card/contact-card.component';

import { ContactCardService } from './contact.service';
import { ContactRoutingModule } from './contact-routing.module';

@NgModule({
  imports: [HttpModule, CommonModule, FormsModule, SharedModule, ContactRoutingModule, LayoutModule],
  declarations: [ ContactPage, ContactCardComponent],
  providers: [ContactCardService]
})
export class ContactModule { }
