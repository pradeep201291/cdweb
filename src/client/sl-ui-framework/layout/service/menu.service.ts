/**
 * @author: Tavant Technologies
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
/**
 * This service will be used for sharing the events 
 * between Header and  navigation components
 */
export class MenuService {
    private toggleMenu: Subject<void> = new Subject<void>();
    private hideMenu: Subject<void> = new Subject<void>();
    private notificationSubject: Subject<number> = new Subject<number>();
    private messageSubject: Subject<number> = new Subject<number>();

    toggleMenu$ = this.toggleMenu.asObservable();
    hideMenu$ = this.hideMenu.asObservable();
    notification$ = this.notificationSubject.asObservable();
    message$ = this.messageSubject.asObservable();
    /**
     * The toggle method
     */
    toggle() {
        this.toggleMenu.next();
    }

    /**
     * Hide the menu always. Used by router events. i.e. if the page is navigated to a new page, then hide the menu.
     */
    hide() {
        this.hideMenu.next();
    }

    /**
     * Shows notification badge.
     */
    showNotification(count: number) {
        this.notificationSubject.next(count);
    }

    showMessage(count: number) {
        this.messageSubject.next(count);
    }
}
