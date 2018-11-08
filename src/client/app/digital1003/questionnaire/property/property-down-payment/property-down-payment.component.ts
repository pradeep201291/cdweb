import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PropertyQuestionaire } from './../../../rules/models/property-questionaire.typedef';
import { QuestionaireComponent } from './../../../rules/models/questionaire-abstract/questionaire-component';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { amountValidator, percentageValidator } from './property-down-payment-validator';

@Component({
    selector: 'sl-property-down-payment',
    templateUrl: './property-down-payment.component.html',
})

export class PropertyDownPayment extends QuestionaireComponent<PropertyQuestionaire> {
    @Input() input: PropertyQuestionaire;
    @Output() output: EventEmitter<PropertyQuestionaire>;

    private propertyDownPaymentForm: FormGroup;

    searchControl = new FormControl();


    private propertyDownPaymentFormErrors = {
        'amount': '',
        'percentage': ''
    };

    constructor(private formBuilder: FormBuilder,
        private router: Router) {
        super();
        this.createFormGroup();
    }


    createFormGroup() {
        this.propertyDownPaymentForm = this.formBuilder.group({
            amount: [''],
            percentage: ['20']
        });
        let amount = this.propertyDownPaymentForm.controls['amount'];
        amount.valueChanges.subscribe((value: any) => {
            if (amountValidator(value)) {
                console.log('success');
            } else {
                this.propertyDownPaymentForm.controls['amount'].setValue(value.slice(0, -1));

            };

        });
        let percentage = this.propertyDownPaymentForm.controls['percentage'];
        percentage.valueChanges.subscribe((value: any) => {
            if (percentageValidator(value)) {
                console.log('success');
                this.propertyDownPaymentFormErrors.percentage = '';
            } else {
                this.propertyDownPaymentForm.controls['percentage'].setValue(value.slice(0, -1));
                this.propertyDownPaymentFormErrors.percentage = 'percentage should be between 1 - 100';
            };
        });
    }

}
