import {componentHandler} from '../assets/site/mdl/material.js';

interface jekyllPages {
    baseurl: string;
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
    }>
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
            <button class="js-bcd-summary_ adjacent is-open" type="button">
                <i class="material-icons open-icon-90CC">expand_more</i>
                <h3 class="sitemap-dir-name">DIRECTORY</h3>
            </button>

            <div class="js-bcd-details_ adjacent is-open"><ul class="sitemap-dir-items">
            </ul></div>
        </div>
    ```
*/
let prefabDir:HTMLDivElement;

async function sitemapInit(){

    const data = await fetch(`${window.location.href}sitemap.json`);
    const obj = await data.json() as jekyllPages;

    console.debug('Working with object:\n', obj);

    const sitemapContainer = document.getElementById('sitemap') as HTMLDivElement;

    prefabItem = document.getElementById('prefab-sitemap-item') as HTMLDivElement;
    prefabDir = document.getElementById('prefab-sitemap-dir') as HTMLDivElement;

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
        console.debug('======================================================');

        // Navigate down the tree to the correct directory
        let lastDir:HTMLDivElement|null = sitemapContainer;
        for (const dir of page.path) {
            lastDir = findOrCreateDir(dir, lastDir);
            console.debug('Dir', lastDir);
        }

        const item = prefabItem.cloneNode(true) as HTMLDivElement;
        item.removeAttribute('id');
        const a = item.querySelector('.sitemap-item') as HTMLAnchorElement;
        a.textContent = page.formatted_title ?? page.title ?? page.name;
        a.setAttribute('href', obj.baseurl + page.url);

        console.debug('===================');
        console.debug('Adding item', item, 'to', lastDir);
        console.debug('Appending to...', lastDir.querySelector('.js-bcd-details_'));

        const appendPoint = lastDir.id === 'sitemap' ? lastDir : lastDir.querySelector('.js-bcd-details_') ?? lastDir;
        appendPoint.appendChild(item);

        lastDir = null;
    }

    const tempDetails = sitemapContainer.querySelectorAll('.js-bcd-details_');
    tempDetails.forEach(d => {
        d.classList.remove('js-bcd-details_');
        d?.classList.add('js-bcd-details');
    });

    const tempSummaries = sitemapContainer.querySelectorAll('.js-bcd-summary_');
    tempSummaries.forEach(s => {
        s.classList.remove('js-bcd-summary_');
        s.classList.add('js-bcd-summary');
    });

    componentHandler.upgradeElements(elementsToUpgrade);
}

function findOrCreateDir(dir:string, entryPoint:Element):HTMLDivElement{
    console.debug('Looking for dir', dir);
    const children : Element[] = entryPoint.id === 'sitemap' ?
                                [ ...entryPoint.getElementsByClassName('sitemap-dir') ] :
                                [ ...(entryPoint.getElementsByClassName('js-bcd-details_')[0]?.getElementsByClassName('sitemap-dir') ??[]) ];

    const existingDir = children.find(e => [...e.children].find(c => c.classList.contains('js-bcd-summary_'))?.querySelector('.sitemap-dir-name')?.textContent === dir);
    console.debug('Existing dir:', existingDir);
    if (existingDir) return existingDir as HTMLDivElement;
    console.debug('Creating new dir:', dir);

    const newDir = prefabDir.cloneNode(true) as HTMLDivElement;
    newDir.removeAttribute('id');

    const thisSummary = newDir.querySelector('.js-bcd-summary_');
    (thisSummary ?? entryPoint).querySelector('.sitemap-dir-name')!.textContent = dir;

    const appendPoint = entryPoint.id === 'sitemap' ? entryPoint : entryPoint.querySelector('.js-bcd-details_') ?? entryPoint;
    appendPoint.appendChild(newDir);

    elementsToUpgrade.push(...newDir.children as HTMLCollectionOf<HTMLElement>);

    return newDir;
}
