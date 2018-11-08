import { Pipe, PipeTransform } from '@angular/core';

import { Contact } from './../shared/message-page.model';

/**
 * A pipe for getting all the contacts who are selected
 * 
 * @export
 * @class SelectedContactPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'filterContact' })
export class FilterContact implements PipeTransform {
    /**
     * 
     * 
     * @param {Contact[]} allContacts
     * @returns
     * 
     * @memberOf FilterContact
     */
    transform(contacts: Contact[], term: string) {
        let selectedContacts = contacts.filter(contact => !contact.is_selected);
        // If there is no search term
        if (term === '') {
            return selectedContacts;

        } else {
            // if there is a search term
            return selectedContacts.filter(each =>
                each.name.trim().toLowerCase().replace(/\s/g, '').match(term.trim().toLowerCase().replace(/\s/g, ''))
            );

        }
    }
}
