import { Directive, ViewContainerRef } from '@angular/core';

/**
 * A Directive to mark valid insertion points in the template.
 * 
 * @export
 * @class AuthHostDirective
 */
@Directive({
    selector: '[auth-host]',
})
export class AuthHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
