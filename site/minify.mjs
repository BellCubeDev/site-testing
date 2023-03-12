/* eslint-disable i18n-text/no-en */
import * as path from 'path';
import * as afs from 'fs/promises';
import * as fs from 'fs';

import * as yaml from 'yaml';

import * as uglify from 'terser';
import convertToES6 from 'cjs-to-module';

import sass from 'sass';

import postcss_ from 'postcss';
import cssnano from 'cssnano';

import sourcemap from 'source-map-js';
import moduleDetector from 'js-module-formats';

import pathConfig from './minify-paths-config.json' assert {type: 'json'};

//process.env.logToFile = 'true';
//process.env.doDebug = 'true';

// If requested, redirect all console output to minify.log
if (process.env.logToFile?.trim().replace(/^"(.*)"$/, '$1') === 'true') {
    const dateDeclaration = `Minification log for ${new Date().toLocaleString()}`;

    fs.writeFileSync('minify.log', dateDeclaration);
    const access = fs.createWriteStream('minify.log');
    const writeFile = access.write.bind(access);

    process.stdout.write = writeFile;
    process.stderr.write = writeFile;

    console.log(dateDeclaration);
}

const postcss = postcss_([
    cssnano({
        plugins: [
            ['autoprefixer', {add: true}],
            ['css-declaration-sorter', {}],
            ['postcss-calc', {}],
            ['postcss-colormin', {}],
            ['postcss-convert-values', {precision: 2}],
            ['postcss-discard-duplicates', {}],
            ['postcss-discard-empty', {}],
            ['postcss-discard-overridden', {}],
            ['postcss-merge-longhand', {}],
            ['postcss-merge-rules', {}],
            ['postcss-minify-font-values', {}],
            ['postcss-minify-gradients', {}],
            ['postcss-minify-params', {}],
            ['postcss-minify-selectors', {}],
            ['postcss-normalize-charset', {}],
            ['postcss-normalize-display-values', {}],
            ['postcss-normalize-positions', {}],
            ['postcss-normalize-repeat-style', {}],
            ['postcss-normalize-string', {}],
            ['postcss-normalize-timing-functions', {}],
            ['postcss-normalize-unicode', {}],
            ['postcss-normalize-url', {defaultProtocol: 'https', forceHttps: true}],
            ['postcss-normalize-whitespace', {}],
            ['postcss-ordered-values', {}],
            ['postcss-reduce-initial', {}],
            ['postcss-reduce-transforms', {}],
            ['postcss-svgo', {}],
            ['postcss-unique-selectors', {}],
            ['postcss-zindex', {startIndex: 1}]
        ]
    })
]);

//console.log('environment:', JSON.stringify(process.env, undefined, 4));

console.log('\n====================\nMinifying files...\n');

let minifiedAnyFile = false;
process.on('exit', ()=>    console.log(`${minifiedAnyFile ? '\n' : ''}Minification complete.\n====================\n`)    );

let minifiedVarCache = {};

const minifyDir = process.env.minifyDir?.trim().replace(/^"(.*)"$/, '$1');
if (!minifyDir) throw new Error('No minifyDir environment variable was provided');

const doDebug = process.env.doDebug?.trim().replace(/^"(.*)"$/, '$1') === 'true';

const singleBuild = process.env.singleBuild?.trim().replace(/^"(.*)"$/, '$1') === 'true';

const doInlineSources = process.env.doInlineSources?.trim().replace(/^"(.*)"$/, '$1') === 'true';
//console.log('doInlineSources:', process.env.doInlineSources);
//console.log('doInlineSources:', process.env.doInlineSources?.trim().replace(/^"(.*)"$/, '$1'));
//console.log('doInlineSources:', process.env.doInlineSources?.trim().replace(/^"(.*)"$/, '$1') === 'true');

const absoluteMinifyDir = path.resolve(minifyDir);
const minifyDirURI = new URL(`file://${absoluteMinifyDir}/`);
const canonicalMinifyURI = doInlineSources ? minifyDirURI.href : `https://raw.githubusercontent.com/${process.env.repository || 'BellCubeDev/site-testing'}/deployment/`;

const config = yaml.parse(await afs.readFile('_config.yml', 'utf8'));

setTimeout(evalFilesInDir.bind(undefined, minifyDir), 100);

// Get font CSS packages
const fontLocations = [
    'https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en',
    {
        hrefs: [
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            'https://fonts.googleapis.com/css2?family=Material+Icons+Outlined',
        ],
        before: [[/material-icons-outlined/g, 'material-icons--outlined']],
        after: [[/font-display: swap;/g, 'font-display: block;']],
        append: `
        .material-icons, .material-icons--outlined {
            font-feature-settings: 'liga';
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        `
    },
];

/** @type string[] */
const fontStylesheets = await Promise.all(fontLocations.map(async url => {
    if (typeof url === 'string') {
        const res = await fetch(url);
        return cssReplaceFontSettings(await res.text());
    } else {
        const cssPromises = [];
        for (const href of url.hrefs) {
            // I've got reasons far beyond your comprehension... stupid static analysis tool.
            cssPromises.push(async function() {
                const res = await fetch(href);
                let css = await res.text();

                url.before?.forEach(([regex, replace]) => css = css.replace(regex, replace));
                css = cssReplaceFontSettings(css);
                url.after?.forEach(([regex, replace]) => css = css.replace(regex, replace));

                return css;
            }());
        }
        const cssArr = await Promise.all(cssPromises);
        return cssArr.join('\n') + (url.append ?? '');
    }
}));

function cssReplaceFontSettings(css) {
    return css.replace(/@font-face \{/g, '@font-face {font-display: swap;')
            .replace(/font-family: '(.*?)';.*?src:/gs, '$& local("$1"),');
}

const pageTemplate = await afs.readFile(`${minifyDir}/_layouts/page.html`, 'utf8');
const pageTemplateWithCSS = pageTemplate.replace('/* MINIFIER: REPLACE WITH FONT CSS */', await finishMinifyingCSS(false, fontStylesheets.join('\n')));
afs.writeFile(`${minifyDir}/_layouts/page.html`, pageTemplateWithCSS);

/** @param {string} dirPath Directory to traverse */
async function evalFilesInDir(dirPath) {
    const files = await afs.readdir(dirPath);

    for (let i = 0; i < files.length; i++) {
        evalFileOrDir(path.join(dirPath, files[i]));
    }
}

/** Evaluates a single file or directory asynchronously
    @param {string} thisPath the path of the file or directory to evaluate
*/
async function evalFileOrDir(thisPath) {
    thisPath = path.normalize(thisPath).replace(/\\/g, '/');
    if (doDebug) console.log('DEBUG: Evaluating file or directory:', thisPath);
    //console.log('Evaluating file or directory:', thisPath);
    if (path.basename(thisPath).startsWith('_')) {
        if (doDebug) console.log('Skipping path due to underscore:', thisPath);
        return;
    }

    const stat = await afs.lstat(thisPath);
    if (stat.isDirectory()) {
        if (doDebug) console.log('DEBUG: Evaluating directory:', thisPath);
        return evalFilesInDir(thisPath);
    }

    if (pathConfig.excluded.some(str => thisPath.includes(str))) {
        if (doDebug) console.log('Skipping path due to exclusion:', thisPath);
        return;
    }

    // eslint-disable-next-line prefer-const
    let [,isSassDir, isOriginal, isMinified, ext] = thisPath.match(/(sass_modules)|(?:\.(original))?(?:\.(min))?\.([^.]+)$/) || [];
    if (ext && !isOriginal && thisPath.includes('highlight_js')) isMinified = false;

    if (doDebug) console.log('DEBUG: Evaluating file with...', JSON.stringify({path: thisPath, isSassDir, isOriginal, isMinified, ext}, undefined, 2));

    if (isSassDir || isOriginal || isMinified || !ext) {
        if (doDebug) console.log('Skipping path due to extension or SASS dir:', thisPath);
        return;
    }

    switch (ext) {
        case 'js' : return minifyJSFile(thisPath);
        case 'scss': return minifySassFile(thisPath);
        case 'css': return minifyCSSFile(thisPath);
    }
}

/** Minify a single JavaScript file asynchronously
    @param {string} filePath
*/
async function minifyJSFile(filePath) {
    try {
        if (doDebug) console.log('DEBUG: Minifying JS file:', filePath);

        // Check if we've already processed this file
        const stat = await afs.stat(filePath);
        if (!singleBuild && stat.birthtime.getTime() > stat.mtime.getTime() + 8000) {
            if (doDebug) console.log('Skipping file due to birthtime:', filePath);
            return;
        }

        console.log('Minifying', filePath);
        minifiedAnyFile = true;

        let fileContents = await afs.readFile(filePath, 'utf8');
        afs.writeFile(filePath.replace(/\.js$/, '.very.original.js'), fileContents, {encoding: 'utf8'});

        // check if file name is pretty-data.js
        if (path.basename(filePath) === 'pretty-data.js')
            fileContents = fileContents.replace(/\bmaxdeep\b/g, 'this.maxdeep').replace(/\bix\b/g, 'this.ix').replace(/str = '', this\.ix = 0;/g, "str = ''; this.ix = 0;");

        const urlFilePath = filePath.replace(minifyDir, '').replace(/\\/g, '/');

        const hasTS = fileContents.includes('//# sourceMappingURL=');

        const tempCache = {...minifiedVarCache};

        let strToMinify = fileContents;
        const foundModuleType = Object.entries(pathConfig.moduleTypes).find(([pathExcerpt, moduleType]) => filePath.includes(pathExcerpt));
        /** @type string */ const moduleTye = foundModuleType?.[1] || moduleDetector.detect(fileContents) || 'es';
        if (doDebug) console.log(`DEBUG: Detected module type for ${filePath}:\n    "${moduleTye}"`);

        if (moduleTye !== 'es' && moduleTye !== 'COMPATIBLE') {
            console.log(JSON.stringify({filePath, minifyDir, absoluteMinifyDir}));
            strToMinify = convertToES6(strToMinify)
                // Handle module imports
                .replace(/^module ([^\s]+) from "/gm, 'import $1 from "')
                // Handle JSON imports
                .replace(/import (\w+) from ("|')(\.?)(\.?)((?:\\\2|["'](?<!\2)|[^"'])*\.[Jj][Ss][Oo][Nn])\2;?/g, (str, varName, quoteType, leadingDot01, leadingDot02, jsonPath) =>
                leadingDot01 ? `const ${varName} = await fetch(${quoteType}${leadingDot02}${path.normalize(path.join(config.baseurl || '', path.normalize(filePath).replace(/[\\/][^\\/]+$/, '').replace(path.normalize(minifyDir), ''), jsonPath)).replace(/\\/g, '/')}${quoteType}).then(r => r.json())`
                             : `const ${varName} = await fetch(${quoteType}${                                                                                jsonPath.replace(/^\//, '')                                                                               }${quoteType}).then(r => r.json())`
                );
        }
        //if (path.basename(filePath, '.js') === 'highlight') strToMinify += 'window.hljs = module.exports;';

        afs.writeFile(filePath.replace(/\.js$/, '.original.js'), strToMinify, {encoding: 'utf8'});

        const minified = await uglify.minify(strToMinify, { // https://terser.org/docs/api-reference
            mangle: {
                eval: true,
                keep_classnames: doInlineSources,
                keep_fnames: false,
                module: true,
                reserved: [],
                toplevel: true,
                safari10: true
            },
            sourceMap: {
                filename: `${path.basename(filePath, '.js')}.ts`,
                content: "inline",
                includeSources: doInlineSources,
                root:  doInlineSources ? '' : 'https://raw.githubusercontent.com/BellCubeDev/site-testing/deployment/',
                url: doInlineSources ? 'inline' : `https://raw.githubusercontent.com/BellCubeDev/site-testing/deployment/${urlFilePath}.map`
            },
            module: !pathConfig.notModule.some(str => filePath.includes(str)),
            toplevel: true,
            nameCache: tempCache,
            warnings: true,
            ecma: 2020,
            compress: {
                passes: 5,
                //defaults: we set every option manually

                arguments: true,
                arrows: true,
                booleans_as_integers: false,
                booleans: true,
                collapse_vars: true,
                comparisons: true,
                computed_props: true,
                conditionals: true,
                dead_code: true,
                directives: true,
                drop_console: false,
                drop_debugger: false,
                ecma: 2020,
                evaluate: true,
                expression: false,
                global_defs: {},
                hoist_funs: false,
                hoist_props: true,
                hoist_vars: true,
                ie8: false,
                if_return: true,
                inline: 3, // aka 'true'
                join_vars: true,
                keep_classnames: doInlineSources,
                keep_fargs: false,
                keep_fnames: doInlineSources,
                keep_infinity: true,
                loops: true,
                module: true,
                negate_iife: true,
                properties: true,
                pure_funcs: [],
                pure_getters: 'strict',
                //reduce_funcs:deprecated
                reduce_vars: true,
                sequences: true,
                side_effects: true,
                switches: true,
                //toplevel: set by `module`
                //top_retain: null | string | string[] | RegExp,
                typeofs: true,
                //unsafe: we set every option manually
                unsafe_arrows: false,
                unsafe_comps: false,
                unsafe_Function: true,
                unsafe_math: true,
                unsafe_symbols: false,
                unsafe_methods: true, // NOTE: If weird  "x is not a constructor" TypeErrors occur, look here first
                unsafe_proto: true,
                unsafe_regexp: false,
                unsafe_undefined: true,
                unused: true,
            },
            format: {
                ascii_only: false,
                beautify: false,
                braces: false,
                comments: false,
                ecma: 2020,
                indent_level: 0,
                indent_start: 0,
                keep_numbers: false,
                keep_quoted_props: false,
                max_line_len: false,
                preamble: null,
                quote_keys: false,
                quote_style: 0,
                safari10: true,
                semicolons: true,
                shebang: false,
                webkit: true,
                wrap_iife: false,
                wrap_func_args: false,
            }
        });

        if (minified.code) minified.code = minified.code.replace(/export;/g, '');

        if (minified.warnings) {
            const filteredWarnings = minified.warnings.filter(msg => !msg.match(/inline source map not found/)).map(msg => msg.trim().replace(/^WARN:\s*/, ''));

            if (filteredWarnings.length > 0)
                console.warn(`\nMinifying file "${filePath}" threw the warnings...\n- ${filteredWarnings.join('\n- ')}`);
        }
        if (minified.error?.name?.length > 2) throw new Error(`Minifying JS file "${filePath}" threw an error:\n${JSON.stringify(minified.error, null, 4)}`);

        minifiedVarCache = {...minifiedVarCache, ...tempCache};

        afs.writeFile(filePath, minified.code, {encoding: 'utf8'})
            // Change the dates of the file to allow us to check if it has been modified since last minification
            .then(() => {
                afs.utimes(path.join(filePath), new Date(Date.now()), new Date(stat.birthtime.getTime() - 1000000));
            });

        if (hasTS) afs.writeFile(`${filePath}.map`, minified.map.replace('"sources":["0"]', `"sources":["${hasTS ? urlFilePath.replace(/\.js$/, '.ts') : urlFilePath}"]`), {encoding: 'utf8'});
        else {
            afs.writeFile(`${filePath}.map`, minified.map.replace('"sources":["0"]', `"sources":["${urlFilePath.replace(/\.js$/, '.original.js')}"]`), {encoding: 'utf8'});
        }
    } catch (err) {
        console.error(`Minifying JS file "${filePath}" threw an error:\n${JSON.stringify(err, null, 4)}`, err);
        return;
    }
}

async function minifySassFile(filePath) {
    try {
        console.log('Minifying', filePath);
        //const rawFileStr = await afs.readFile(filePath, 'utf8');

        const sassCompiled = sass.compile(filePath, {
            alertAscii: true,
            alertColor: true,
            charset: 'utf8',
            loadPaths: [path.join(minifyDir, 'sass_modules')],
            sourceMap: true,
            sourceMapIncludeSources: doInlineSources,
            style: 'compressed',
            verbose: !doInlineSources
        });

        /** @type {typeof sassCompiled.sourceMap} */
        const sassMap = JSON.parse(JSON.stringify(sassCompiled.sourceMap));
        sassMap.sourceRoot = canonicalMinifyURI;
        sassMap.sources = sassMap.sources.map((src) => src.replace(minifyDirURI, ''));

        const filePath_Original = filePath.replace(/\.scss$/, '.original.css');

        afs.writeFile(filePath_Original, sassCompiled.css, {encoding: 'utf8'});
        afs.writeFile(`${filePath_Original}.map`, JSON.stringify(sassMap), {encoding: 'utf8'});
        await afs.writeFile(`${filePath_Original}.css.map`, JSON.stringify(sassCompiled.sourceMap), {encoding: 'utf8'});

        await finishMinifyingCSS(filePath, sassCompiled.css, sassMap);
    } catch (err) {
        if ('file' in err) delete err.file;
        if ('input' in err) delete err.input;
        if ('source' in err) delete err.source;
        if ('sourceMappingURL' in err) delete err.sourceMappingURL;
        console.error(`Minifying SASS file "${filePath}" threw an error:\n${JSON.stringify(err, null, 4)}`, err);
        return;
    }
}

async function minifyCSSFile(filePath) {
    try {

        // If there is a Sass version of this file, skip the CSS file
        try {
            await afs.access(filePath.replace(/\.css$/, '.scss'), fs.constants.R_OK);
            if (doDebug) console.log(`Skipping CSS file "${filePath}" because there is a Sass file`);
            return;
        } catch (err) {
            if (doDebug) console.log(`No Sass file found for "${filePath}"`);
        }

        console.log('Minifying', filePath);
        //const rawFileStr = await afs.readFile(filePath, 'utf8');

        const css = await afs.readFile(filePath, 'utf8');

        afs.writeFile(filePath.replace(/\.css$/, '.original.css'), css, {encoding: 'utf8'});

        await finishMinifyingCSS(filePath, css);
    } catch (err) {
        if ('file' in err) delete err.file;
        if ('input' in err) delete err.input;
        if ('source' in err) delete err.source;
        if ('sourceMappingURL' in err) delete err.sourceMappingURL;
        console.error(`Minifying CSS file "${filePath}" threw an error:\n${JSON.stringify(err, null, 4)}`, err);
        return;
    }
}
 
/** @returns {Promise<string|void>} */
async function finishMinifyingCSS(filePath, css, startMap) {
    css ??= '';

    const filePath_CSS = filePath ? filePath.replace(/\.s?css$/, '.css') : 'INTERNET';
    const filePath_Original = filePath ? filePath.replace(/\.s?css$/, '.original.css') : 'INTERNET';
    const originalURI = filePath ? canonicalMinifyURI + filePath.replace(minifyDir, '') : 'INTERNET';

    startMap ??= {version: 3, sources: [filePath], names: [], mappings: '', file: filePath_CSS};

    if (doDebug) console.log('Minifying CSS file', filePath, 'with original URI', originalURI);
    const processed = await postcss.process(css, {
        from: filePath_Original,
        to: filePath_CSS,
        map: {
            annotation: false,
            inline: false,
            absolute: false,
            prev: new sourcemap.SourceMapConsumer(startMap),
            from: originalURI,
        },
    });

    if (!filePath) return processed.css;

    processed.map.applySourceMap(new sourcemap.SourceMapConsumer(startMap), originalURI);
    const mapObj = processed.map.toJSON?.() || startMap || {};

    mapObj.sourceRoot = canonicalMinifyURI;
    mapObj.sources = mapObj.sources.map((src) => src.replace(minifyDirURI, ''));

    if (startMap.sourcesContent) {
        mapObj.sourcesContent = [];
        for (let i = 0; i < mapObj.sources.length; i++) {
            const posInSassSrc = startMap.sources.indexOf(mapObj.sources[i]);
            mapObj.sourcesContent.push(posInSassSrc < 0 ? null : startMap.sourcesContent[posInSassSrc]);
        }
    } else if (!mapObj.sourcesContent && css && doInlineSources)
        mapObj.sourcesContent = [css];

    const map = JSON.stringify(mapObj);

    // Write files

    afs.writeFile(`${filePath_CSS}.map`, map, {encoding: 'utf8'});

    const cssOut = doInlineSources ?   `${processed.css ?? ''}\n/*# sourceMappingURL=data:application/json;base64,${Buffer.from((map), 'utf8').toString('base64')}*/` :
                                       `${processed.css ?? ''}\n/*# sourceMappingURL=${canonicalMinifyURI}${filePath_CSS.replace(minifyDir, '')}.map*/`;
    afs.writeFile(filePath_CSS, cssOut, {encoding: 'utf8'});
}
