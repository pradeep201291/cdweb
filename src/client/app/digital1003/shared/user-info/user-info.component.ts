import { Component } from '@angular/core';
// import 'rxjs/add/observable/throw';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { PersonalQuestionFieldValidation } from './personal-question.service';
import { emailValidator, mobileNumberValidator } from './user-info-validators';

@Component({
    selector: 'sl-user-info',
    templateUrl: './user-info.component.html',
    // providers: [PersonalQuestionFieldValidation]
})

export class UserInfoComponent {

    private userInfoForm: FormGroup;

    private userInfoForErrors = {
        'firstName': '',
        'lastName': '',
        'mobileNumber': '',
        'email': ''
    };

    /**
     * Creates an instance of UserInfoComponent.
     * 
     * @param {FormBuilder} fb
     * 
     * @memberOf UserInfoComponent
     */
    constructor(private fb: FormBuilder) {
        this.createFormGroup();
    }



    /**
     * 
     * 
     * 
     * @memberOf UserInfoComponent
     */
    createFormGroup() {
        this.userInfoForm = this.fb.group({
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],
            mobileNumber: ['', Validators.required],
            email: ['', []]
        });
        let newPassword = this.userInfoForm.controls['firstName'];
        newPassword.setValidators(Validators.compose([
            Validators.required,
        ]));
    }


    onValueChange() {
        this.userInfoForm.valueChanges.subscribe((value: any) => {
            if ((value.email).valueChanges) {
                if (emailValidator(value.email)) {
                    this.userInfoForErrors.email = '';
                } else {
                    this.userInfoForErrors.email = 'Enter valid Email';
                }

            }
            if ((value.mobileNumber).valueChanges) {
                if (mobileNumberValidator(value.mobileNumber)) {
                    this.userInfoForErrors.mobileNumber = '';
                } else {
                    this.userInfoForErrors.mobileNumber = 'Enter valid Mobile Number';
                }

            }
        });
    }

    ngAfterViewInit() {
        // this.onValueChange();
    }

    onSubmit() {
        if (this.userInfoForm.valid) {

        }
    }

}
