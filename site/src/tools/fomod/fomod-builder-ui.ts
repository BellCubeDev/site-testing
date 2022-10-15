import * as mdl from '../../assets/site/mdl/material.js';
import * as fomodClasses from './fomod-builder-classifications.js';
import * as fomod from './fomod-builder.js';
import * as bcdUniversal from '../../universal.js';

export class bcdDropdownSortingOrder extends bcdUniversal.bcdDropdown {
    static asString = 'BCD - Sorting Order Dropdown';
    static cssClass = 'bcd-dropdown-sorting-order';

    override options(): bcdUniversal.objOf<Function|null> {
        return {'Explicit':null, 'Ascending':null, 'Descending':null};
    }
}


/*\    /$\                       /$\
$$ |   $$ |                      $$ |
$$ |   $$ | $$$$$$\   $$$$$$\  $$$$$$\    $$$$$$\  $$\   $$\
\$$\  $$  |$$  __$$\ $$  __$$\ \_$$  _|  $$  __$$\ \$$\ $$  |
 \$$\$$  / $$ /  $$ |$$ |  \__|  $$ |    $$$$$$$$ | \$$$$  /
  \$$$  /  $$ |  $$ |$$ |        $$ |$$\ $$   ____| $$  $$<
   \$  /   \$$$$$$  |$$ |        \$$$$  |\$$$$$$$\ $$  /\$$\
    \_/     \______/ \__|         \____/  \_______|\__/  \_*/
