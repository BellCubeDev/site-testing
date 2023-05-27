import {componentHandler} from '../assets/site/mdl/material.js';

const cssDetails_ = 'js-bcd-details_';
const cssSummary_ = 'js-bcd-summary_';

interface jekyllPages {
    pages: Array<{
        content: string;
        dir: string;
        name: string;
        path: string;
        url: string;
        [key: string]: string|boolean|undefined;
        layout?: string;
        permalink?: string;
        sitemap?: boolean;
        formatted_title?: string;
        title?: string;
    }>,
    translation: Record<string, string>;
}

window.bcd_init_functions.sitemap = sitemapInit;


const elementsToUpgrade:HTMLElement[] = [];


/** Prefabricated template for a single sitemap entry
    ```html
        <li id="prefab-sitemap-item">
            <a class="sitemap-item" href="" class="">TITLE</a>
        </li>
    ```
*/
let prefabItem:HTMLDivElement;

/** Prefabricated template for a directory in the sitemap
    ```html
        <div id="prefab-sitemap-dir" class="sitemap-dir">
            <button class="cssSummary_ adjacent is-open" type="button">
                <i class="material-icons open-icon-90CC">expand_more</i>
                <h3 class="sitemap-dir-name">DIRECTORY</h3>
            </button>

            <div class="cssDetails_ adjacent is-open"><ul class="sitemap-dir-items">
            </ul></div>
        </div>
    ```
*/
let prefabDir:HTMLDivElement;

let prefabParent:HTMLTemplateElement;

let obj:jekyllPages;

async function sitemapInit(){

    const data = await fetch(`${window.location.href}sitemap.json`);
    obj = await data.json() as jekyllPages;

    console.debug('Working with object:\n', obj);

    const sitemapContainer = document.getElementById('sitemap') as HTMLDivElement;

    prefabParent = document.getElementById('prefabs') as HTMLTemplateElement;

    prefabItem = prefabParent.content.getElementById('prefab-sitemap-item') as HTMLDivElement;
    prefabDir = prefabParent.content.getElementById('prefab-sitemap-dir') as HTMLDivElement;

    const filteredPages = obj.pages.filter(page => page.layout && page.layout !== 'compress_html' && page.sitemap !== false);

    const splitPagePaths = filteredPages.map(page => {
        return {
            ...page,
            path: page.path.split('/')
        };
    });

    // Sort pages by path - folders should be before files and sorted alphabetically

    const sortedPages = splitPagePaths.sort((a, b) => {
        const [aPath, bPath] = [[...a.path], [...b.path]];
        const [lastA, lastB] = [aPath.pop()!, bPath.pop()!];

        while (aPath.length || bPath.length) {
            const [aDir, bDir] = [aPath.shift()!, bPath.shift()!];

            if (aDir === bDir) continue;

            if (!aDir) return 1;
            if (!bDir) return -1;

            if (aDir !== bDir) return aDir.localeCompare(bDir);
        }

        if (lastA === lastB) return 0;
        else return lastA.localeCompare(lastB) ? 1 : -1;
    });

    for (const page of sortedPages) {
        page.path.pop(); // Remove filename

        console.debug('======================================================');
        console.debug('Current file:', page.name);
        console.debug('Working with path:\n', JSON.stringify(page.path));

        // Navigate down the tree to the correct directory
        let lastDir:HTMLDivElement|null = sitemapContainer;
        for (const dir of page.path) {
            lastDir = findOrCreateDir(dir, lastDir);
            console.debug('Dir', lastDir);
        }

        const item = prefabItem.cloneNode(true) as HTMLDivElement;
        item.removeAttribute('id');

        const a = item.querySelector('.sitemap-item') as HTMLAnchorElement;

        const tempTextCont = (page.formatted_title ?? page.title ?? page.name).trim();
        if (tempTextCont in obj.translation) a.textContent = obj.translation[tempTextCont]!;
        else a.textContent = tempTextCont;

        a.setAttribute('href', page.url);


        console.debug('Directory to append within:', lastDir);
        const appendPoint = lastDir.querySelector(':scope > .js-bcd-details_ > .sitemap-dir-items') ?? lastDir;

        console.debug('Adding item', item, 'to', lastDir);
        console.debug('Appending to...', appendPoint);

        appendPoint.appendChild(item);

        lastDir = null;
        console.debug('======================================================');
    }

    const tempDetails = sitemapContainer.querySelectorAll(`.${cssDetails_}`);
    tempDetails.forEach(d => {
        d.classList.remove('js-bcd-details_');
        d?.classList.add('js-bcd-details');
    });

    const tempSummaries = sitemapContainer.querySelectorAll(`.${cssSummary_}`);
    tempSummaries.forEach(s => {
        s.classList.remove(cssSummary_);
        s.classList.add('js-bcd-summary');
    });

    setTimeout((componentHandler.upgradeElements as Function).bind(undefined, elementsToUpgrade));
}

function findOrCreateDir(dir:string, entryPoint:Element):HTMLDivElement{
    console.debug('Looking for dir', dir);

    const existingDir = entryPoint.querySelector(entryPoint.id === 'sitemap' ?
              `:scope                    > .sitemap-dir > .js-bcd-summary_ > .sitemap-dir-name[data-dir="${dir}"]`
            : `:scope > .js-bcd-details_ > .sitemap-dir > .js-bcd-summary_ > .sitemap-dir-name[data-dir="${dir}"]`
    )?.parentElement!.parentElement as HTMLDivElement;


    console.debug('Existing dir:', existingDir);
    if (existingDir) return existingDir;

    console.debug('Creating new dir:', dir);

    const newDir = prefabDir.cloneNode(true) as HTMLDivElement;
    newDir.removeAttribute('id');

    const thisSummary = newDir.querySelector(':scope > .js-bcd-summary_')!;

    let tempTextCont = dir.trim();
    if (tempTextCont in obj.translation) tempTextCont = obj.translation[tempTextCont]!;

    const thisName = thisSummary.querySelector(':scope > .sitemap-dir-name') as HTMLHeadingElement;
    thisName.textContent = tempTextCont;
    thisName.setAttribute('data-dir', dir);

    const appendPoint = entryPoint.querySelector(':scope > .js-bcd-details_') ?? entryPoint;

    const existingItems = appendPoint.querySelector(':scope > .sitemap-dir-items');
    if (existingItems)  appendPoint.insertBefore(newDir, existingItems);
    else                appendPoint.appendChild(newDir);

    elementsToUpgrade.push(...newDir.children as HTMLCollectionOf<HTMLElement>);

    return newDir;
}
