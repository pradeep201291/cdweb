import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'sl-loan-option',
    templateUrl: './loan-option.component.html',
})

export class LoanOptionComponent implements OnInit {
    /**
     * loanOptionForm
     * 
     * @type {FormGroup}
     * @memberOf LoanOptionComponent
     */
    loanOptionForm: FormGroup;

    /**
     * Creates an instance of LoanOptionComponent.
     * 
     * @param {FormBuilder} fb
     * 
     * @memberOf LoanOptionComponent
     */
    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        // Add 'implements OnInit' to the class.
        this.loanOptionForm = this.fb.group(
            {
                notification: ['refinance']
            });
        this.loanOptionForm.get('notification').valueChanges
            .subscribe(value => console.log(value));
    }
}
