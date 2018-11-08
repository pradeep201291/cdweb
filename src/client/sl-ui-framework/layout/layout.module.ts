import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './nav/nav.component';
import { LoanActionBarComponent } from './action-bar/loan-action-bar.component';

import { MenuService } from './service/menu.service';

import { LayoutRoutingModule } from './layout-routing.module';


@NgModule({
  imports: [ CommonModule, LayoutRoutingModule ],
  declarations: [ HeaderComponent, FooterComponent, NavbarComponent, LoanActionBarComponent ],
  exports: [ HeaderComponent, FooterComponent, NavbarComponent, LoanActionBarComponent ],
  providers: [MenuService]
})
export class LayoutModule { }
