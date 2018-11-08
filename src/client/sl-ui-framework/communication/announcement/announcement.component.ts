import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from './announcement.service';

import { Announcement } from './announcement.typedef';
import { Router, Event } from '@angular/router';
declare let $: any;

/**
 * 
 */
@Component({
    selector: 'sl-announcement',
    templateUrl: './announcement.component.html',
    providers: [AnnouncementService]
})
export class AnnouncementComponent implements OnInit {

    announcementList: Announcement[] = [];
    isAnnouncementEnabled: boolean = false;

    /**
     * Creates an instance of AnnouncementComponent.
     * 
     * @param {AnnouncementService} announcementService
     * 
     * @memberOf AnnouncementComponent
     */
    constructor(private announcementService: AnnouncementService, private router: Router) {

    }


    /**
     * 
     * 
     * 
     * @memberOf AnnouncementComponent
     */
    ngOnInit() {
        this.announcementService.getAnnouncements()
            .subscribe(result =>
                this.announcementList = result.data.filter(e => e.announce_text !== '')
            );
        this.router.events.subscribe((val: any) => {
            let settingsRoutes: string[] = [
                '/login',
                '/summary'
            ];
            let url: string = val.url.toString().toLowerCase();

            if (settingsRoutes.includes(url)) {
                /** Enable announcements for Login and Summary page */
                this.isAnnouncementEnabled = true;
                    let footHeight = $('footer').height();
                    let pushValue = (footHeight + 30 + 87);
                    $('.wrapper').css('margin-bottom', -pushValue);
                    $('.wrapper-after').after().css('height', pushValue);
            } else {
                /** All other pages disable the announcements*/
                this.isAnnouncementEnabled = false;
                // let footHeight = $('footer').height();
                //     let pushValue = (footHeight + 30);
                //     $('.wrapper').css('margin-bottom', -pushValue);
                //     $('.wrapper-after').after().css('height', pushValue);
            }

        });

    }

    /**
     * 
     * 
     * 
     * @memberOf AnnouncementComponent
     */
    onAnnouncementClose() {
        // let footHeight = $('footer').height();
        // let pushValue = -(footHeight + 60);
        $('.alert-announce').hide();
    }
}
