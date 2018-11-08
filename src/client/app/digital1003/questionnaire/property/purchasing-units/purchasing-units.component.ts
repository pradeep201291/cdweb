import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PropertyQuestionaire } from './../../../rules/models/property-questionaire.typedef';
import { QuestionaireComponent } from './../../../rules/models/questionaire-abstract/questionaire-component';

@Component({
    selector: 'sl-purchase-units',
    templateUrl: './purchasing-units.component.html',
})

export class PurchaseUnits extends QuestionaireComponent<PropertyQuestionaire> {
    @Input() input: PropertyQuestionaire;
    @Output() output: EventEmitter<PropertyQuestionaire>;
}
