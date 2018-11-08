import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


import { PrivateLabelService } from './service/private-label.service';
import { EsignModalService }  from './service/esign-modal.service';
import { WidgetRenderService }  from './service/widget-render.service';

import { FileDropZoneComponent } from './file-dropzone/file-dropzone.component';

@NgModule({
  imports: [ HttpModule, CommonModule,  FormsModule ],
  declarations: [ FileDropZoneComponent],
  exports: [ FileDropZoneComponent],
  providers: [ PrivateLabelService, EsignModalService, WidgetRenderService ]
})
export class SharedModule { }
