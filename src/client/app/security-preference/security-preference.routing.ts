import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityPreference } from './security-preference.component';

const securityRoutes: Routes = [
     {path: 'securitypreference', component: SecurityPreference},
];

@NgModule({
    imports: [
        RouterModule.forChild(securityRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class SecurityRoutingModule {

}
