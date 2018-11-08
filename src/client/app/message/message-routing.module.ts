/**
 * Routing configuration for Message
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagePage } from './message.page';
import { AuthorizationGuard } from '../../././sl-ui-framework/auth/shared/guard';

const messageRoutes: Routes = [
    { path: 'message', component: MessagePage, canActivate: [AuthorizationGuard] },
];

/**
 * 
 * @export
 * @class MessageRoutingModule
 */
@NgModule({
    imports: [
        RouterModule.forChild(messageRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class MessageRoutingModule {

}
