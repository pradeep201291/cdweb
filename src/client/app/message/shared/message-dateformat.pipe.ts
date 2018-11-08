import { Pipe, PipeTransform } from '@angular/core';

const NotAvailable = 'NA';
/**
 * 
 * 
 * @export
 * @class DateFormatPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'toLocalDate' })
export class DateFormatPipe implements PipeTransform {

    /**
     * @desc transforms datetime to local prior to host environment
     * 
     * @param {string} value
     * @returns {Date}
     * 
     * @memberOf DateFormatPipe
     */
    transform(value: Date): string {
        let dateAsString = value.toString();
        if (dateAsString && dateAsString !== '') {
            return new Date(this.appendTimeZone(dateAsString))
                .toLocaleString('en-US', this.getFormartArgs());
        } else {
            return NotAvailable;
        }
    }

    /**
     * @desc Appends format specifier
     * 
     * @private
     * @param {string} value
     * @returns {string}
     * 
     * @memberOf DateFormatPipe
     */
    private appendTimeZone(value: string): string {
        let dateTimeString = value.trim();
        let formatSpecifier = value.charAt(dateTimeString.length - 1);
        if (this.isChar(formatSpecifier)) {
            return value;
        } else {
            return value + 'Z';
        }
    }

    /**
     * @desc Checks for aplphabets
     * 
     * @private
     * @param {string} str
     * @returns {boolean}
     * 
     * @memberOf DateFormatPipe
     */
    private isChar(str: string): boolean {
        return /^[a-zA-Z]+$/.test(str);
    }
    /**
     * @desc Format specifier for dataandtime
     * 
     * @private
     * @returns
     * 
     * @memberOf DateFormatPipe
     */
    private getFormartArgs() {
        return {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        };
    }

}
