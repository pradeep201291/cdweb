import { Component, Input } from '@angular/core';

import { Menu } from './menu-item.typedef';

/**
 * Component for Menu item
 */
@Component({
    selector: 'sl-menu-item',
    templateUrl: 'menu-item.component.html',
})
export class MenuItemComponent  {
     @Input() menu: Menu;
}
