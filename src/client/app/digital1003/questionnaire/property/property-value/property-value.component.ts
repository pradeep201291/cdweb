import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PropertyQuestionaire } from './../../../rules/models/property-questionaire.typedef';
import { QuestionaireComponent } from './../../../rules/models/questionaire-abstract/questionaire-component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { amountValidator } from '../property-down-payment/property-down-payment-validator';

@Component({
    selector: 'sl-property-value',
    templateUrl: './property-value.component.html',
})

export class PropertyValue extends QuestionaireComponent<PropertyQuestionaire> {
    @Input() input: PropertyQuestionaire;
    @Output() output: EventEmitter<PropertyQuestionaire>;

    private propertyValueForm: FormGroup;



    private propertyValueFormErrors = {
        'value': ''
    };

    /**
     * Creates an instance of PropertyValue.
     * 
     * @param {FormBuilder} formBuilder
     * @param {Router} router
     * 
     * @memberOf PropertyValue
     */
    constructor(private formBuilder: FormBuilder,
        private router: Router) {
        super();
        this.createFormGroup();
    }


    /**
     * 
     * 
     * 
     * @memberOf PropertyValue
     */
    createFormGroup() {
        this.propertyValueForm = this.formBuilder.group({
            value: ['']
        });
        let value = this.propertyValueForm.controls['value'];
        value.valueChanges.subscribe((propertyValue: any) => {
            if (amountValidator(propertyValue)) {
                console.log('success');
            } else {
                this.propertyValueForm.controls['value'].setValue(propertyValue.slice(0, -1));
                this.propertyValueFormErrors.value = 'property value should be less than 1000000000';
            };
        });
    }
}
