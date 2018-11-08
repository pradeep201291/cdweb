import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PropertyQuestionaire } from './../../../rules/models/property-questionaire.typedef';
import { QuestionaireComponent } from './../../../rules/models/questionaire-abstract/questionaire-component';

@Component({
    selector: 'sl-property-type',
    templateUrl: './property-type.component.html',
})

export class PropertyType extends QuestionaireComponent<PropertyQuestionaire> {
    @Input() input: PropertyQuestionaire;
    @Output() output: EventEmitter<PropertyQuestionaire>;
}
