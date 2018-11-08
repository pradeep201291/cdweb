import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, Event } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { PrivateLabelService } from './shared/service/private-label.service';
import { PrivateLblResponse, HyperlinkItem } from './shared/service/models/GetPrivateLabelResponse';
import { MenuService } from './../sl-ui-framework/layout/service/menu.service';
// import { AuthenticationService } from './../sl-ui-framework/auth/auth.service';
import { AuthResource } from './../sl-ui-framework/auth/auth.resource';
import * as _ from 'lodash';

const defaultDomain = 'brkr.tavant.com';
const companyCode = 'company_code';

declare var $: any;
/**
 * 
 */
@Component({
    selector: 'cd-app',
    templateUrl: './app.component.html',
    styles: [require('./../../assets/styles/styles.less')],
    encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnInit {
    linkItems: HyperlinkItem[];
    copyRightTxt: string;
    policyTxt: string;
    footerLogo: string;
    headerLogo: string;
    backgroundClass: string = '';
    isLogin: boolean = false;
    authenticatedPage: string = '';
    isFooterActive: boolean;
    isLogoActive: boolean;
    companyCode: string;
    /*
    **
    */
    constructor(private route: Router,
        private menuService: MenuService,
        private lblService: PrivateLabelService,
        private titleService: Title
    ) {
    }
    /*
    **
    */

    /**
     * 
     * @memberOf AppComponent
     */
    ngOnInit(): void {

        // Commented to make the f1003 page avaialble , needs to uncommnet for future use 
        // let currentPath = this.getPathName();
        // let activePath = sessionStorage.getItem('activePath');
        // if (activePath && activePath !== null) {
        //   //  if (currentPath.toLowerCase() !== activePath.toLowerCase()) { sessionStorage.clear(); }
        // }
        this.getPriateLabelResponse();
        this.route.events.subscribe((val: Event) => {
            sessionStorage.setItem('activePath', this.getPathName());
            if (!this.isLoggedIn()) {
                this.isLogin = true;
                this.backgroundClass = 'login_bg';
                this.authenticatedPage = '';
            } else {
                this.isLogin = false;
                /**
                 * @todo refactor.
                 */
                let settingsRoutes: string[] = [
                    '/changepassword',
                    '/resetpassword',
                    '/securitypreference',
                    '/eula'
                ];
                let url: string = val.url.toString().toLowerCase();

                if (settingsRoutes.includes(url)) {
                    this.backgroundClass = 'login_bg';
                } else {
                    this.backgroundClass = '';
                }
                this.authenticatedPage = 'container-fluid wrap  body-bg';
                // If the route has changed, reset the menu visibility
                this.menuService.hide();
            }
        });
    }

    public setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }

    getPriateLabelResponse() {
        let response = this.lblService.getPrivateLblResponse();
        response.subscribe((data: PrivateLblResponse) => {
            let hostName = this.getLocationUrl();
            if (_.isUndefined(data[hostName])) {
                hostName = defaultDomain;
            }
            /**
             * Title service
             */
            this.setTitle(data[hostName].title.text);
            this.isFooterActive = data[hostName].footer.isActive;
            this.isLogoActive = data[hostName].header.logoVisibility;
            this.linkItems = data[hostName].footer.hyperlinkItems;
            this.copyRightTxt = data[hostName].footer.copyRightContent;
            this.policyTxt = data[hostName].footer.policyContent;
            this.footerLogo = data[hostName].footer.logosrc;
            this.headerLogo = data[hostName].header.logosrc;
            /**
             * @desc company code is stored in session storage
             */
            this.companyCode = data[hostName].data.company_code;
            sessionStorage.setItem(companyCode, data[hostName].data.company_code);

            if (!_.isUndefined(data[hostName])) {
                let links = document.getElementsByTagName('head')[0];
                let htmlElement = document.createElement('link');
                htmlElement.setAttribute('rel', 'stylesheet');
                htmlElement.setAttribute('type', 'text/css');
                htmlElement.setAttribute('href', data[hostName].stylesheet.path);
                links.appendChild(htmlElement);
            }
        });
    }

    getLocationUrl(): string {
        return window.location.hostname;
    }

    getPathName(): string {
        return window.location.pathname;
    }
    /**
     * @todo session store access to be moved to a service at core level
     * 
     * @returns
     * 
     * @memberOf AppComponent
     */
    private isLoggedIn() {
        let userSessionDetails = JSON.parse(sessionStorage.getItem(AuthResource.login.currentUser));
        return userSessionDetails && userSessionDetails !== null;
    }

    disableOverlay() {
        this.menuService.hide();
        $('#overlay').hide();
        /**No scroll */
        $('body').removeClass('noScroll');
    }
}
