import { Component } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/observable/throw';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalQuestionFieldValidation } from './personal-question.service';
import { emailValidator, mobileNumberValidator } from './personal-question-validators';

@Component({
    selector: 'sl-personal-question',
    templateUrl: './personal-question.component.html',
    providers: [PersonalQuestionFieldValidation]
})

export class PersonalQuestionComponent {

    private personalQuestionForm: FormGroup;

    private personalQuestionFormErrors = {
        'firstName': '',
        'lastName': '',
        'mobileNumber': '',
        'email': ''
    };

    /**
     * Creates an instance of PersonalQuestionComponent.
     * 
     * @param {FormBuilder} fb
     * @param {Router} router
     * 
     * @memberOf PersonalQuestionComponent
     */
    constructor(private formBuilder: FormBuilder,
        private router: Router) {
        this.createFormGroup();
    }



    /**
     * 
     * 
     * 
     * @memberOf PersonalQuestionComponent
     */
    createFormGroup() {
        this.personalQuestionForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],
            mobileNumber: ['', Validators.required],
            email: ['', []]
        });
        let firstName = this.personalQuestionForm.controls['firstName'];
        firstName.setValidators(Validators.compose([
            Validators.required,
        ]));
    }


    onValueChange() {
        this.personalQuestionForm.valueChanges.subscribe((value: any) => {
            if ((value.email).valueChanges) {
                if (emailValidator(value.email)) {
                    this.personalQuestionFormErrors.email = '';
                } else {
                    this.personalQuestionFormErrors.email = 'Enter valid Email';
                }

            }
            if ((value.mobileNumber).valueChanges) {
                if (mobileNumberValidator(value.mobileNumber)) {
                    this.personalQuestionFormErrors.mobileNumber = '';
                } else {
                    this.personalQuestionFormErrors.mobileNumber = 'Enter valid Mobile Number';
                }

            }
        });
    }

    ngAfterViewInit() {
        // this.onValueChange();
    }

    onSubmit() {
        if (this.personalQuestionForm.valid) {

        }
    }

}
