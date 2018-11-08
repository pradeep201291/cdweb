import { Pipe, PipeTransform } from '@angular/core';
import { Message } from './message-page.model';
@Pipe({ name: 'sortByDate' })
export class SortPipe implements PipeTransform {
    /**
     * 
     * 
     * @param {Array<Message>} array
     * @returns {Array<Message>}
     * 
     * @memberOf SortPipe
     */
    transform(array: Array<Message>): Array<Message> {
        array.sort((first: Message, second: Message) => {
            if (first.date_sent < second.date_sent) {
                return -1;
            }
            if (first.date_sent > second.date_sent) {
                return 1;
            }
            return 0;
        });
        return array;
    }
}
