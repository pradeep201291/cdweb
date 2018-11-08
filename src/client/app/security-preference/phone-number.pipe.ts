import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

/**
 * 
 * 
 * @export
 * @class PhoneNumberMaskPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'phoneNumber' })
export class PhoneNumberPipe implements PipeTransform {
    /**
     * @desc masking pipe for phone number {40X-XXX-9876}
     * 
     * @param {string} value
     * @returns {string}
     * 
     * @memberOf PhoneNumberMaskPipe
     */
    transform(value: string, canMask: boolean): string {
        let isValid = /^\+?[1-9][\d]*$/.test(value);
        if (isValid) {
            let charArray = _.toArray(value);
            if (canMask) {
                charArray[2] = charArray[3] = charArray[4] = charArray[5] = 'x';
            }
            let city = charArray.slice(0, 3);
            let number = charArray.slice(3);

            return ('(' + city + ')' + '-' + number.slice(0, 3) + '-' + number.slice(3)).trim().replace(/,/g, '');
        }
        return value;
    }
}
