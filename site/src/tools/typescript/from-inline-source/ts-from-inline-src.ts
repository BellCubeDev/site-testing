import hljs from '../../../assets/site/highlight_js/highlight.js';

// HLJS Language Definition
import typescript from '../../../assets/site/highlight_js/languages/typescript.js';
import { registerForEvents } from '../../../universal.js';
hljs.registerLanguage('typescript', typescript);

declare global {interface Window {
    fromInline: {
        ui: {
            dataUpdated: (evt:Event) => void
        }
    }
}}

window.bcd_init_functions.tsFromInline = function tsFromInline(){
    window.fromInline = {} as any;
    window.fromInline.ui = {
        dataUpdated(evt:Event) {
            console.debug('Data updated:', evt);
            if (!evt) throw new Error('There must be no hero, for there is no event.');
            const elem = (evt.target as HTMLTextAreaElement|undefined);
            if (!elem) throw new Error('no target');

            try {
                parseData(elem.value.trim());
            } catch (err) {
                console.info('Parser failed with error', err);
                setOutput({});
            }
        }
    };
};


function parseData(str: string){

    // Extract data url from the full file or, barring that, use the input as-is
    [,str] = str.match(/^\/\/# sourceMappingURL=(.*)/mi) ?? [undefined, str];

    console.debug('Parsing data:', str);

    try {
        const urlFrom = new URL(str);
        parseFromURL(urlFrom);
    }

    catch (err) {
        if (!(err instanceof TypeError)) throw err;
        console.debug('Input is not a URL', str, '\n', err);

        parseFromJSON(str);
    }
}

/** Parses an `application/json` Data URI into its raw JSON component and passes it on to ParseJSON */
async function parseFromURL(uri: URL){
    if (typeof uri === 'string') uri = new URL(uri);
    else if (!(uri instanceof URL)) throw new Error('Input is not a valid URI');

    if (uri.protocol !== 'data:') throw new Error('Only `data:` URIs are supported');

    const [,ext, data] = uri.pathname.trim().match(/^(.+?);(?:[^,]*?;)*base64,(.*)$/) ?? [];

    if (ext !== 'application/json' || !data) {
        console.error(uri);
        throw new Error('Invalid Data URI or incorrect MIME type - see the above output for the URI');
    }

    const str = atob(data);
    //const str = decodeURIComponent(escape(window.atob(data)));
    //const str = (await new Blob([data], {type: 'ext', endings: 'native'}).text()).toString();

    parseFromJSON(str);
}

type outs = {[file:string]: string}

function parseFromJSON(obj: any) {
    if (typeof obj === 'string') obj = JSON.parse(obj);
    else if (typeof obj !== 'object') throw new Error('Input is not a JSON object');

    console.debug('Working with object:\n', obj);

    const sources:outs = {};

    for (let i = 0; i < obj.sources.length; i++) {
        const file = obj.sources[i];

        // eslint-disable-next-line prefer-template
        const contents = (obj.sourcesContent[i] as string).trim().replace(/[^\n\S]+(?:\r\n?|\n)/g, '\n') + '\n';

        console.debug('Source', i, {[`${file}`]: contents});
        sources[file] = contents;
    }

    setOutput(sources);
}

async function setOutput(outs_: outs) {
    const prefabOutput = document.getElementById('prefab-output') as HTMLDivElement;
    const outputArea = document.getElementById('output-area') as HTMLDivElement;
    const outs = Object.entries(outs_);

    // NOTE: REQUIRES an opacity transition under 200ms!

    outputArea.style.opacity = '0';

    // Wait for the transition to finish
    await new Promise(resolve => {
        outputArea.addEventListener('transitionend', resolve, {once: true});
        setTimeout(() => {
            outputArea.removeEventListener('transitionend', resolve);
            resolve('timeout');
        }, 200);
    });

    outputArea.innerHTML = '';
    outputArea.style.opacity = '1'; // Don't worry, this isn't a race condition - thank you, Event Loop!

    for (let i = 0; i < outs.length; i++) {
        const [file, data] = outs[i]!;

        const output = prefabOutput.cloneNode(true) as HTMLDivElement;
        output.id = `output-${i}`;
        output.classList.remove('hidden');
        output.removeAttribute('aria-hidden');

        output.querySelector('h3')!.textContent = file.trim();

        const code = output.querySelector('pre > code')!;
        code.innerHTML = hljs.highlight(data.trim(), {language: 'typescript'}).value.replace(/^\s*/y, '');

        outputArea.appendChild(output);
    }

}
