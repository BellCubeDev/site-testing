import * as mdl from '../../assets/site/mdl/material.js';
import * as fomodClasses from './fomod-builder-classifications.js';
import * as fomod from './fomod-builder.js';
import * as bcdUniversal from '../../universal.js';

export enum menuCorners {
    unaligned = 'mdl-menu--unaligned',
    topLeft = 'mdl-menu--bottom-left',
    topRight = 'mdl-menu--bottom-right',
    bottomLeft = 'mdl-menu--top-left',
    bottomRight = 'mdl-menu--top-right'
}

class bcdDropdown extends mdl.MaterialMenu {

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    options(): void | string[] {}

    options_: string[];

    unselectedOptions: string[] = [];
    selectedOption: string = '';

    element_: HTMLElement;

    selectionElements: undefined | HTMLCollectionOf<HTMLElement>;

    constructor(element?: Element, ripple?: boolean, corner: keyof typeof menuCorners = 'unaligned') {
        if (!element) {
            const element_temp = document.createElement('div');
            element_temp.classList.add('mdl-menu', menuCorners[corner]);
            element = element_temp;
            if (ripple) element.classList.add('mdl-js-ripple-effect');
                else element.classList.remove('mdl-js-ripple-effect');
        }
        super(element);
        this.element_ = element as HTMLElement;

        const tempOptions = this.options();
        if (!tempOptions) throw new TypeError('A BellCubic Dropdown cannot be created directly. It must be created through a subclass extending the `options` method past `void`.');
        this.options_ = tempOptions;

        this.unselectedOptions = this.options_.slice(1);
        this.selectedOption = this.options_[0];

        for (const option of this.options_) {
            this.element_.appendChild(this.createOption(option));
        }

        this.selectionElements = this.forElement_?.getElementsByClassName('bcd-dropdown_value') as HTMLCollectionOf<HTMLElement>;

        this.updateOptions();
    }

    updateOptions() {
        const children: HTMLLIElement[] = [];

        const ___temp_children = (this.element_ as HTMLElement).getElementsByTagName('li');
        for (const element of ___temp_children) children.push(element);

        const goldenChild = children.find((elm) => (elm as HTMLLIElement).innerText === this.selectedOption);
        if (!goldenChild) throw new Error('Could not find the selected option in the dropdown.');

        const demonChildren = children.filter((elm) => (elm as HTMLLIElement).innerText !== this.selectedOption);
        demonChildren.sort( (a, b) => this.options_.indexOf(a.innerText) - this.options_.indexOf(b.innerText) );

        this.makeSelected(goldenChild);

        for (const child of demonChildren) {
            this.element_.removeChild(child);
            bcdDropdown.makeNotSelected(child);
            this.element_.appendChild(child);
        }
    }

    createOption(option: string, addToList: boolean = false): HTMLLIElement {
        const li = document.createElement('li');
        li.innerText = option;
        li.classList.add('mdl-menu__item');
        this.registerItem(li);
        if (addToList) {
            this.element_.appendChild(li);
            this.options_.push(option);
        }
        this.onCreateOption(option);
        return li;
    }

    onItemSelected(option: HTMLLIElement) {
        this.selectedOption = option.innerText;
        this.updateOptions();
    }

    onCreateOption(option: string): void {return;}

    makeSelected(option: HTMLLIElement) {
        option.classList.add('mdl-menu__item--full-bleed-divider');

        for (const elm of this.selectionElements ?? []) {
            elm.innerText = option.innerText;
        }
    }

    static makeNotSelected(option: HTMLLIElement) {
        option.classList.remove('mdl-menu__item--full-bleed-divider');
    }
}

class bcdDropdownSortingOrder extends bcdDropdown {
    static asString = 'BCD - Sorting Order Dropdown';
    static cssClass = 'bcd-dropdown-sorting-order';

    options(): string[] {
        return ['Explicit', 'Ascending', 'Descending'];
    }

}

bcdUniversal.registerBCDComponent(bcdDropdownSortingOrder);
