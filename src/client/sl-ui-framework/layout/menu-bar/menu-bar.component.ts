import { Component, OnInit } from '@angular/core';

import { MenuService } from './.././service/menu.service';
import { Menu } from './../menu-item/menu-item.typedef';

/**
 * Component for Navbar
 */
@Component({
    selector: 'sl-menu-bar',
    templateUrl: 'menu-bar.component.html',
})
export class MenuBarComponent implements OnInit {

    private showMenu: boolean = false;
    private notificationCount: number = 0;
    private messageCount: number = 0;

    menuBar: Menu[];
    /**
     * Constructor 
     * @param {MenuService} menuService
     */
    constructor(private menuService: MenuService) {
    }

    /**
     * Toggles the visibility of the menu
     */
    toggleMenu() {
        this.showMenu = !this.showMenu;
    }

    ngOnInit() {

        // Subscription when the menu is on the header
        this.menuService.toggleMenu$.subscribe(() => {
            this.toggleMenu();
        });

        this.menuService.hideMenu$.subscribe(() => {
            this.showMenu = false;
        });

        this.menuService.notification$.subscribe((count) => {
            this.notificationCount = count;
        });

        this.menuService.message$.subscribe((count) => {
            this.messageCount = count;
        });

        this.menuBar = this.menuBar = [{
            sequence: 1,
            navUrl: '/summary',
            skin: 'summary',
            displayText: 'Summary',
            unreadActivityCount: 0
        },
        {
            sequence: 2,
            navUrl: '/dashboard',
            skin: 'dashboard',
            displayText: 'Dashboard',
            unreadActivityCount: 0
        },
        {
            sequence: 3,
            navUrl: '/message',
            skin: 'messages',
            displayText: 'Messages',
            unreadActivityCount: this.messageCount
        },
        {
            sequence: 4,
            navUrl: '/contact',
            skin: 'contacts',
            displayText: 'Contacts',
            unreadActivityCount: 0
        },
        {
            sequence: 5,
            navUrl: '/notification',
            skin: 'notifications',
            displayText: 'Notifications',
            unreadActivityCount: this.notificationCount
        },
        {
            sequence: 6,
            navUrl: '/message',
            skin: 'messages',
            displayText: 'Messages',
            unreadActivityCount: this.messageCount
        }];
    }
}
