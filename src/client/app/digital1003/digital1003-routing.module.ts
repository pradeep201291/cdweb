/**
 * Routing configuration for Checklist
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from '../../././sl-ui-framework/auth/shared/guard';

import { Digital1003Page } from './digital1003.page';
import { BorrowerPage } from './questionnaire/borrower/borrower.page';
import { PropertyPage } from './questionnaire/property/property.page';
import { PersonalPage } from './questionnaire/personal/personal.page';


// import { SummaryWrapComponent } from './summary-wrap/summary.wrap.component';
// import { WelcomeWrapComponent } from './welcome-wrap/welcome-wrap.component';
// import { PersonalQuestionComponent } from './questionnaire/personal/personal-question/personal-question.component';

const digital1003Routes: Routes = [
    {
        path: 'digital1003',
        component: Digital1003Page,
        canActivate: [AuthorizationGuard],
        children: [
            {
                path: '',
                redirectTo: '/digital1003/property',
                pathMatch: 'full'

            },
            {
                path: 'property',
                component: PropertyPage,
            },
            // {
            //     path: 'welcome',
            //     component: WelcomeWrapComponent,
            // },
            {
                path: 'borrower',
                component: BorrowerPage,
            },
            // {
            //     path: 'property',
            //     component: PropertyPage,
            // }, 
            {
                path: 'personal',
                component: PersonalPage,
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(digital1003Routes)
    ],
    exports: [
        RouterModule
    ]
})
export class Digital1003RoutingModule {

}
