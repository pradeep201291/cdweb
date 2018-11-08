import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { ProgressBarService } from './progress-bar/progress-bar.service';
import { StearnsHttpClient } from './http-client/http-client.service';
import { PagerService } from './pagination/pagination.service';
import { DataStoreService } from './data-store/data-store.service';
/*
**
*/
@NgModule(
    {
        imports: [HttpModule, CommonModule, FormsModule],
        providers: [ProgressBarService, StearnsHttpClient, PagerService, DataStoreService],
    }
)
/*
**
*/
export class InfrastructureModule { }
