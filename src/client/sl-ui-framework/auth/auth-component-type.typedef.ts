import { ComponentLoadArgs } from './auth-item.typedef';
import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthEventArgs } from './auth-event-args.typedef';


/**
 * An abstraction for Auth Component
 * 
 * @export
 * @abstract
 * @class AuthComponent
 */
export abstract class AuthComponent {
    /**
     * The input to form.
     * 
     * @abstract
     * @type {ComponentLoadArgs}
     * @memberOf AuthComponent
     */
    abstract input: ComponentLoadArgs;

    /**
     * The output from form.
     * 
     * @abstract
     * @type {EventEmitter<AuthEventArgs>}
     * @memberOf AuthComponent
     */
    abstract output: EventEmitter<AuthEventArgs>;

    /**
     * Getter for the current form;
     * 
     * @readonly
     * @abstract
     * @type {FormGroup}
     * @memberOf AuthComponent
     */
    abstract get thisForm(): FormGroup;

    /**
     * All the Form Errors
     * 
     * @abstract
     * @type {*}
     * @memberOf AuthComponent
     */
    abstract get formErrors(): any;

    /**
     * Validates the form.
     * 
     * @param {*} FormValidationMessages
     * 
     * @memberOf AuthComponent
     */
    /**
     * 
     * 
     * @param {*} FormValidationMessages
     * 
     * @memberOf AuthComponent
     */
    validateForm(FormValidationMessages: any) {
        for (const field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                this.formErrors[field] = '';
                const control = this.thisForm.get(field);
                if (control && !control.valid) {
                    for (const key in control.errors) {
                        if (control.errors.hasOwnProperty(key)) {
                            this.formErrors[field] = FormValidationMessages[field][key];
                            break;
                        }
                    }

                }
            }
        }
    }

}
