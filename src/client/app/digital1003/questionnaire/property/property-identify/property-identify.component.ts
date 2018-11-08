import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { PropertyQuestionaire } from './../../../rules/models/property-questionaire.typedef';
import { QuestionaireComponent } from './../../../rules/models/questionaire-abstract/questionaire-component';


@Component({
    selector: 'sl-property-identify',
    templateUrl: './property-identify.component.html',
})

export class PropertyIdentify extends QuestionaireComponent<PropertyQuestionaire> implements OnInit {
    @Input() input: PropertyQuestionaire;
    @Output() output: EventEmitter<PropertyQuestionaire>;
    propertyIdentificationForm: FormGroup;

    constructor(private fb: FormBuilder) {
        super();
    }

    ngOnInit() {
        this.propertyIdentificationForm = this.fb.group(
            {
                propertyIdentified: ['']
            });
        this.propertyIdentificationForm.valueChanges.subscribe(val => {
            if (this.propertyIdentificationForm.value.propertyIdentified === 'yes') {
                this.input.isPropertyIdentified = true;
            } else {
                this.input.isPropertyIdentified = false;
            }
            this.continue();
        });
    }

    continue() {
        this.output.emit(this.input);
    }

}
