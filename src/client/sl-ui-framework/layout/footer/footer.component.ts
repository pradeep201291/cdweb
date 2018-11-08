import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';

import { HyperlinkItem, EulaConfig, HyperLinkType } from './footer.model';
import { Router } from '@angular/router';
import { FooterService } from './footer.service';
declare var $: any;
@Component({
    selector: 'sl-footer',
    templateUrl: 'footer.component.html',
    providers: [FooterService]
})
export class FooterComponent implements OnInit {
    @Input() hyperlinkItems: HyperlinkItem[];
    @Input() copyRightContent: string;
    @Input() policyContent: string;
    @Input() logosrc: string;
    @Input() companyCode: string;
    footerClass: string = null;
    eulaConfig: EulaConfig;
    eulaSrc: SafeResourceUrl;

    constructor(private router: Router, private footerService: FooterService, private santizer: DomSanitizer) {
    }

    ngOnInit() {
        if (this.footerClass === null) { this.setFooterClass(this.router.url); };
        this.router.events.subscribe((val: any) => {
            let url: string = val.url.toString().toLowerCase();
            this.setFooterClass(url);
            // If the route has changed, reset the menu visibility
        });
        this.footerService.getEulaDetails(this.companyCode)
            .subscribe(result => {
                this.eulaConfig = result;
            });
    }

    footerLinkClickHandler(hyperLinkItem: HyperlinkItem) {
        console.log(hyperLinkItem);
        if (hyperLinkItem.linkType === HyperLinkType.EULA) {
            this.openEula();
        }

    }

    openEula() {
        if (this.eulaConfig && this.eulaConfig.consent !== '') {
            this.eulaSrc = this.santizer.bypassSecurityTrustResourceUrl(this.eulaConfig.consent);
            $('#eula-modal').modal('show');
        }
    }

    setFooterClass(url: string) {
        let settingsRoutes: string[] = [
            '/changepassword',
            '/resetpassword',
            '/securitypreference',
            '/login',
            '/forgotpassword',
            '/eula'
        ];
        if (settingsRoutes.includes(url)) {
            /** When there is a background image */
            this.footerClass = 'login-footer';
        } else {
            /** When there is no background image */
            this.footerClass = 'regular-footer';
        }
    }

    /**/
    ngAfterViewChecked(){
        let footHeight = $('footer').height();
        let pushValue = (footHeight + 80);

        $('.wrapper').css('margin-bottom', -pushValue);
        $('.wrapper-after').after().css('height', pushValue);
    }
}
