import { Pipe, PipeTransform } from '@angular/core';

/**
 * date Filter to UTC formate
 * 
 * @export
 * @class UTCDatePipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'UTCDatePipe' })
export class UTCDatePipe implements PipeTransform {
    transform(value: string): Date {
        let date = new Date(value);
        if ((navigator.userAgent.includes('Edge'))) {
            return date;
        }
        if ((navigator.userAgent.includes('Chrome'))) {
            let _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            return _utc;
        }
        if ((navigator.userAgent.includes('Firefox'))) {
            let _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            return _utc;
        }
        if ((navigator.userAgent.includes('Safari'))) {
            let _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            return _utc;
        }
        return date;
    }
}
