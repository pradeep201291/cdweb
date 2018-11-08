import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuleLoaderException } from './module-import.guard';

import { StearnsAppConfig } from './global-configuration/config';
import { AppSettings } from './global-configuration/settings';
import { StateProviderService } from './state-provider.service';

/**
 * 
 * 
 * @export
 * @class CoreModule
 */
@NgModule({
    imports: [ CommonModule ],
    exports: [],
    declarations: [],
    providers: [ { provide: AppSettings, useValue: StearnsAppConfig } , StateProviderService]
})
export class CoreModule {
    /**
     * Creates an instance of CoreModule.
     * 
     * @param {CoreModule} parentModule
     * 
     * @memberOf CoreModule
     */
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        ModuleLoaderException(parentModule, 'CoreModule');
    }
}
