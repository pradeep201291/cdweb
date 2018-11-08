import { Component, OnInit, OnDestroy } from '@angular/core';

import { MenuService } from './.././service/menu.service';
import { DocumentService } from '../../../app/documents/documents.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
/**
 * Component for Navbar
 */
@Component({
    selector: 'sl-nav',
    templateUrl: 'nav.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {

    private showMenu: boolean = false;
    private componentDestroyed: Subject<void> = new Subject<void>();

    /**
     * Constructor 
     * @param {MenuService} menuService
     */
    constructor(private menuService: MenuService, private documentService: DocumentService) {
    }

    /**
     * Toggles the visibility of the menu
     */
    toggleMenu() {
        this.showMenu = !this.showMenu;
    }

    ngOnInit() {
        // Subscription when the menu is on the header
        this.menuService.toggleMenu$.takeUntil(this.componentDestroyed).subscribe(() => {
            this.toggleMenu();
        });

        this.menuService.hideMenu$.takeUntil(this.componentDestroyed).subscribe(() => {
            this.showMenu = false;
        });

        /*   this.menuService.notification$.subscribe((count) => {
               this.notificationCount = count;
           });
   
           this.menuService.message$.subscribe((count) => {
               this.messageCount = count;
           });*/
    }
    /**
     * @todo remove page overlay
     * 
     * 
     * @memberOf NavbarComponent
     */
    removeOverlay() {
        this.documentService.isDocumentUploaded = false;
        $('#overlay').hide();
        /**No scroll */
        $('body').removeClass('noScroll');
    }

    ngOnDestroy() {
        this.componentDestroyed.next();
        this.componentDestroyed.complete();
    }
}
