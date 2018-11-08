import { Component, Input, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, Event, ActivatedRoute } from '@angular/router';

import { MenuService } from './.././service/menu.service';
import { HeaderService } from './header.service';
import * as _ from 'lodash';
import { AppSettings } from './../../../app/core/global-configuration/settings';
import { AuthResource } from './../../../sl-ui-framework/auth/auth.resource';
import { GlobalConstants } from '../../../app/core/global-constant/global-constant';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';


declare var $: any;
/**
 * 
 * 
 * @export
 * @class HeaderComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'sl-header',
    templateUrl: 'header.component.html',
    providers: [HeaderService]
})
export class HeaderComponent implements OnInit, OnDestroy {
    private isIdlePopupVisible = false;
    private _idleTimer: any;
    private _idleShowPopupTimer: any;
    private isLoggedOut: boolean = false;

    @Input() isLoggedIn: boolean;

    @Input() logosrc: string;

    @Input() logoVisibility: boolean;
    private userName: string;
    private hide: boolean;
    private notificationCount: number = 0;
    private messageCount: number = 0;
    isLogin: boolean;
    isSettingsClicked: boolean = false;
    private idleTimeOut: number;       // 30 minutes
    private popupTimeOut: number;     // 28 minutes..
    private componentDestroyed: Subject<void> = new Subject<void>();
    /**
     * Creates an instance of HeaderComponent.
     * 
     * @param {AuthenticationService} userService
     * @param {Router} router
     * @param {MenuService} menuService
     * @param {ActivatedRoute} activeRoute
     * 
     * @memberOf HeaderComponent
     */
    constructor(private router: Router,
        private menuService: MenuService,
        private activeRoute: ActivatedRoute,
        private headerService: HeaderService,
        private appSettings: AppSettings) {
        this.hide = true;
    }

    /**
     * @description OnLogout : user session details are removed from localstorage
     * 
     * 
     * @memberOf HeaderComponent
     */
    onLogOut() {
        this.isLoggedOut = true;
        let userId: string;
        let sessionDetails = this.getUserFromSession();
        clearTimeout(this._idleTimer);
        clearTimeout(this._idleShowPopupTimer);
        sessionDetails !== null && sessionDetails.UserId ? userId = sessionDetails.UserId : userId = '';
        this.headerService.logout({ UserId: sessionDetails.UserId })
            .subscribe(result => {
                if (result) {
                    this.clearSessionStore();
                    this.router.navigate(['/login']);
                    this.removeOverlay();
                }
            },
            (error: any) => {
                this.clearSessionStore();
                this.router.navigate(['/login']);
                this.removeOverlay();

            });
    }


    /**
     * 
     * 
     * 
     * @memberOf HeaderComponent
     */
    onHamburgerClick() {
        this.hide = !this.hide;
        this.menuService.toggle();
        if (this.hide) {
            $('#overlay').hide();
            /**No scroll */
            $('body').removeClass('noScroll');
        } else {
            $('#overlay').show();
            /**No scroll */
            $('body').addClass('noScroll');
        }

    }

    /**
     * 
     * Hide Settings if clicked anywhere.
     * 
     * 
     * @memberOf HeaderComponent
     */
    @HostListener('document:click', ['$event'])
    hideSettings(event: any) {
        this.isSettingsClicked = false;
    }

    /**
     * To show and hide the options on click of Settings button.
     */
    onSettingsClick(event: any) {
        this.isSettingsClicked = !this.isSettingsClicked;
        if (event) {
            event.stopPropagation();
        }
    }

    /**
     * 
     * 
     * 
     * @memberOf HeaderComponent
     */
    ngOnInit(): void {
        this.idleTimeOut = this.appSettings.security.idleTimeout;
        this.popupTimeOut = this.appSettings.security.popupTimeout;
        this.router.events.subscribe((val: Event) => {
            if ($('.modal-backdrop.in').is(':visible')) {
                $('.modal-backdrop.in').hide();
            }
            $('#session-expire').modal('hide');
            this.isIdlePopupVisible = false;
            let userDetails = JSON.parse(sessionStorage.getItem(AuthResource.login.currentUser));
            this.isLoggedIn = (userDetails && userDetails !== null);
            if (this.isLoggedIn) {
                this.isLoggedOut = false;
                this.userName = userDetails.FirstName + ' ' + userDetails.LastName;
                this.setIdleTimeOut();
            }
        });
        this.menuService.hideMenu$.takeUntil(this.componentDestroyed).subscribe(() => {
            this.hide = true;
        });
        this.menuService.notification$.takeUntil(this.componentDestroyed).subscribe((count) => {
            this.notificationCount = count;
        });

        this.menuService.message$.takeUntil(this.componentDestroyed).subscribe((count) => {
            this.messageCount = count;
        });

    }

    /**
     * @todo session store access to be moved to service at core level
     * 
     * @returns
     * 
     * @memberOf HeaderComponent
     */
    getUserFromSession() {
        let userSessionDetails = JSON.parse(sessionStorage.getItem(AuthResource.login.currentUser));
        if (userSessionDetails && userSessionDetails !== null) {
            return {
                UserId: userSessionDetails.UserId,
                password: userSessionDetails.password,
                FirstName: userSessionDetails.FirstName,
                LastName: userSessionDetails.LastName,
                email: userSessionDetails.email,
                access_token: userSessionDetails.access_token,
                refresh_token: userSessionDetails.refresh_token,
                expires_in: userSessionDetails.expires_in,
                issued: userSessionDetails.issued,
                expires: userSessionDetails.expires
            };
        }
        return null;
    }

    removeOverlay() {
        $('#overlay').hide();
        /**No scroll */
        $('body').removeClass('noScroll');
    }

    private setIdleTimeOut() {
        if (this.isIdlePopupVisible || this.isLoggedOut) {
            return;
        }
        if (this._idleTimer !== null) {
            clearTimeout(this._idleTimer);
        }
        if (this._idleShowPopupTimer !== null) {
            clearTimeout(this._idleShowPopupTimer);
        }
        this._idleShowPopupTimer = setTimeout(this.idleEventHandler.bind(this), this.popupTimeOut);
        this._idleTimer = setTimeout(function () {
            console.log('idle timer');
            if (!this.isLoggedIn) {
                return;
            }
            $('#session-expire').modal('hide');
            this.isIdlePopupVisible = false;
            this.onLogOut();
        }.bind(this), this.idleTimeOut);

    }

    private idleEventHandler() {
        if (!this.isLoggedIn) {
            return;
        }
        $('#session-expire').modal('show');
        this.isIdlePopupVisible = true;
    }


    @HostListener('mousemove', ['$event'])
    @HostListener('mouseenter', ['$event'])
    @HostListener('window:scroll', ['$event'])
    @HostListener('window:click', ['$event'])
    @HostListener('window:keydown', ['$event'])
    @HostListener('window:dblclick', ['$event'])
    eventListner(e: any) {
        if (this.isLoggedIn && this.isIdlePopupVisible === false) {
            this.setIdleTimeOut();
        }
    }

    continue() {
        $('#session-expire').modal('hide');
        this.isIdlePopupVisible = false;

        this.setIdleTimeOut();
    }

    ngOnDestroy() {
        this.componentDestroyed.next();
        this.componentDestroyed.complete();
    }

    clearSessionStore() {
        sessionStorage.removeItem(AuthResource.login.currentUser);
        sessionStorage.removeItem(GlobalConstants.currentLoan);
        sessionStorage.removeItem(GlobalConstants.currentMessageDO);
        sessionStorage.removeItem(GlobalConstants.borrower_request_count);
        sessionStorage.removeItem(GlobalConstants.borrower_session);
    }

    goToMessage() {
        this.removeOverlay();
        if ($('#warningModal').is(':visible')) {
            $('#warningModal').modal('hide');
        }
        this.router.navigate(['/message']);
    }
}
