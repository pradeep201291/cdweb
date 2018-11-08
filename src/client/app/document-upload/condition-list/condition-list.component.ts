import { Component, Input } from '@angular/core';

import { Condition } from './../models/condition-list.model';
/**
 * 
 * 
 * @export
 * @class ConditionListComponent
 */
@Component({
    templateUrl: './condition-list.component.html',
    selector: 'condition-list',
})
export class ConditionListComponent {

    @Input() conditions: Condition[];
}
