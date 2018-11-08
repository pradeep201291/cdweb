import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { LayoutModule } from './../../sl-ui-framework/layout/layout.module';

import { DocumentUploadRoutingModule } from './document-upload-routing.module';
import { DocumentUploadPage } from './document-upload.page';
import { ConditionListComponent } from './condition-list/condition-list.component';
import { DocumentSelectorComponent } from './document-selector/document-selector.component';
import { DocumentUploadService } from './document-upload.service';
/**
 * 
 * 
 * @export
 * @class DocumentUploadModule
 */
@NgModule({
  imports: [HttpModule, CommonModule, FormsModule, SharedModule, DocumentUploadRoutingModule, LayoutModule],
  declarations: [DocumentUploadPage,
    ConditionListComponent, DocumentSelectorComponent],
  providers: [DocumentUploadService]
})
export class DocumentUploadModule { }
