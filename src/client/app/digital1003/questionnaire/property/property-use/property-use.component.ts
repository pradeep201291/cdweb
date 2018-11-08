import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PropertyQuestionaire } from './../../../rules/models/property-questionaire.typedef';
import { QuestionaireComponent } from './../../../rules/models/questionaire-abstract/questionaire-component';

@Component({
    selector: 'sl-property-use',
    templateUrl: './property-use.component.html',
})

export class PropertyUse extends QuestionaireComponent<PropertyQuestionaire> {
    @Input() input: PropertyQuestionaire;
    @Output() output: EventEmitter<PropertyQuestionaire>;

}
