import * as path from 'path';
import * as afs from 'fs/promises';

import * as uglify from 'uglify-js';
import convertToES6 from 'cjs-to-module';

import sass from 'sass';

import postcss_ from 'postcss';
import cssnano from 'cssnano';

import sourcemap from 'source-map-js';
import moduleDetector from 'js-module-formats';

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
            //['postcss-normalize-whitespace', {}],
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

const doInlineSources = process.env.doInlineSources?.trim().replace(/^"(.*)"$/, '$1') === 'true';
//console.log('doInlineSources:', process.env.doInlineSources);
//console.log('doInlineSources:', process.env.doInlineSources?.trim().replace(/^"(.*)"$/, '$1'));
//console.log('doInlineSources:', process.env.doInlineSources?.trim().replace(/^"(.*)"$/, '$1') === 'true');

const absoluteMinifyDir = path.resolve(minifyDir);
const minifyDirURI = new URL(`file://${absoluteMinifyDir}/`);
const canonicalMinifyURI = doInlineSources ? minifyDirURI.href : 'https://raw.githubusercontent.com/BellCubeDev/site-testing/deployment/';

// Code mostly taken from `minifyJSInDir()`
setTimeout(async () => {
        const files = await afs.readdir(minifyDir);

        for (let i = 0; i < files.length; i++) {
            evalFileOrDir(path.join(minifyDir, files[i]));
        }
    },
    100
);
// End self-piracy

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
    console.log('DEBUG: Evaluating file or directory:', thisPath);
    //console.log('Evaluating file or directory:', thisPath);
    if (path.basename(thisPath).startsWith('_')) return;

    const stat = await afs.lstat(thisPath);
    if (stat.isDirectory()) {
        console.log('DEBUG: Evaluating directory:', thisPath);
        return evalFilesInDir(thisPath);
    }

    const [,isSassDir,isOriginal, isMinified, ext] = thisPath.match(/(sass_modules)|(?:\.(original))?(?:\.(min))?\.([^.]+)$/) || [];
    //console.log('original:', original, 'minified:', minified, 'ext:', ext);
    console.log('DEBUG: Evaluating file with...', JSON.stringify({path: thisPath, isSassDir, isOriginal, isMinified, ext}, undefined, 2));
    if (isSassDir || isOriginal || isMinified || !ext) return;

    switch (ext) {
        case 'js' : return minifyJSFile(thisPath);
        case 'scss': return minifySassFile(thisPath);
    }
}

/** Minify a single JavaScript file asynchronously
    @param {string} filePath
*/
async function minifyJSFile(filePath) {
    console.log('DEBUG: Minifying JS file:', filePath);
    if ((filePath.endsWith('.min.js') && !filePath.includes('highlight_js')) || filePath.endsWith('.original.js')) return;

    // Check if we've already processed this file
    const stat = await afs.stat(filePath);
    if (stat.birthtime.getTime() > stat.mtime.getTime() + 4000) return;

    console.log('Minifying', filePath);
    minifiedAnyFile = true;

    const fileContents = await afs.readFile(filePath, 'utf8');
    afs.writeFile(filePath.replace(/\.js$/, '.very.original.js'), fileContents, {encoding: 'utf8'});

    const urlFilePath = filePath.replace(minifyDir, '').replace(/\\/g, '/');

    const hasTS = fileContents.includes('//# sourceMappingURL=');

    const tempCache = {...minifiedVarCache};

    let strToMinify = fileContents;
    if (moduleDetector.detect(fileContents) === 'cjs') strToMinify = convertToES6(strToMinify);
    //if (path.basename(filePath, '.js') === 'highlight') strToMinify += 'window.hljs = module.exports;';

    afs.writeFile(filePath.replace(/\.js$/, '.original.js'), strToMinify, {encoding: 'utf8'});

    const minified = uglify.minify(strToMinify, {
        compress: {
            passes: 5,

            arguments: true,
            assignments: true,
            booleans: true,
            collapse_vars: true,
            comparisons: true,
            conditionals: true,
            dead_code: false,
            drop_console: false,
            drop_debugger: false,
            directives: true,
            evaluate: true,
            expression: false,
            functions: true,
            hoist_exports: true,
            hoist_funs: true,
            hoist_props: true,
            hoist_vars: false,
            if_return: true,
            inline: true,
            join_vars: true,
            imports: true,
            keep_fargs: true,
            keep_fnames: false,
            keep_infinity: true, // Most target runners will likely be using Chromium or otherwise implementing V8, so let's not bork its performance
            loops: true,
            negate_iife: true,
            merge_vars: true,
            module: true,
            objects: true,
            properties: true,
            pure_funcs: null,
            pure_getters: false,
            reduce_funcs: true,
            reduce_vars: true,
            sequences: true,
            side_effects: true,
            strings: true,
            switches: true,
            toplevel: false,
            top_retain: false,
            typeofs: true,
            unsafe_regexp: true,
            varify: false,
            webkit: true,
        },
        mangle: {
            eval: true,
            keep_fnames: false,
            properties: false, // Yup, it broke my code 😊
            toplevel: true
        },
        output: {}, // Keep defaults
        sourceMap: {
            filename: `${path.basename(filePath, '.js')}.ts`,
            content: "inline",
            includeSources: doInlineSources,
            root:  doInlineSources ? '' : 'https://raw.githubusercontent.com/BellCubeDev/site-testing/deployment/',
            url: doInlineSources ? 'inline' : `https://raw.githubusercontent.com/BellCubeDev/site-testing/deployment/${urlFilePath}.map`
        },
        module: true,
        toplevel: true,
        nameCache: tempCache,
        warnings: true,
        webkit: true
    });

    if (minified.warnings) {
        const filteredWarnings = minified.warnings.filter(msg => !msg.match(/inline source map not found/)).map(msg => msg.trim().replace(/^WARN:\s*/, ''));

        if (filteredWarnings.length > 0)
            console.warn(`\nMinifying file "${filePath}" threw the warnings...\n- ${filteredWarnings.join('\n- ')}`);
    }
    if (minified.error?.name?.length > 2) throw new Error(`Minifying file "${filePath}" threw an error:\n${minified.error.name}\n${minified.error.message}\n${minified.error.stack}`);

    minifiedVarCache = {...minifiedVarCache, ...tempCache};

    afs.writeFile(filePath, minified.code, {encoding: 'utf8'})

        // Change the dates of the file to allow us to check if it has been modified since last minification
        .then(() => {
            afs.utimes(path.join(filePath), new Date(Date.now()), new Date(stat.birthtime.getTime() - 5000));
        });

    if (hasTS) afs.writeFile(`${filePath}.map`, minified.map.replace('"sources":["0"]', `"sources":["${hasTS ? urlFilePath.replace(/\.js$/, '.ts') : urlFilePath}"]`), {encoding: 'utf8'});
    else {
        afs.writeFile(`${filePath}.map`, minified.map.replace('"sources":["0"]', `"sources":["${urlFilePath.replace(/\.js$/, '.original.js')}"]`), {encoding: 'utf8'});
    }
}

async function minifySassFile(filePath) {
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
    const filePath_CSS = filePath.replace(/\.scss$/, '.css');

    afs.writeFile(filePath_Original, sassCompiled.css, {encoding: 'utf8'});
    afs.writeFile(`${filePath_Original}.map`, JSON.stringify(sassMap), {encoding: 'utf8'});
    await afs.writeFile(`${filePath_Original}.css.map`, JSON.stringify(sassCompiled.sourceMap), {encoding: 'utf8'});

    const originalSassFileURI = canonicalMinifyURI + filePath.replace(minifyDir, '');
    const css = await postcss.process(sassCompiled.css, {
        from: filePath_Original,
        to: filePath_CSS,
        map: {
            annotation: false,
            inline: false,
            absolute: false,
            prev: new sourcemap.SourceMapConsumer(sassMap),
            from: originalSassFileURI,
        },
    });

    css.map.applySourceMap(new sourcemap.SourceMapConsumer(sassMap), originalSassFileURI);
    const mapObj = css.map.toJSON?.() || sassMap || {};

    mapObj.sourceRoot = canonicalMinifyURI;
    mapObj.sources = mapObj.sources.map((src) => src.replace(minifyDirURI, ''));

    if (sassMap.sourcesContent) {
        mapObj.sourcesContent = [];
        for (let i = 0; i < mapObj.sources.length; i++) {
            const posInSassSrc = sassMap.sources.indexOf(mapObj.sources[i]);
            mapObj.sourcesContent.push(posInSassSrc < 0 ? null : sassMap.sourcesContent[posInSassSrc]);
        }
    } else
        mapObj.sourcesContent = null;

    const map = JSON.stringify(mapObj);

    // Write files

    afs.writeFile(`${filePath_CSS}.map`, map, {encoding: 'utf8'});

    const cssOut = doInlineSources ?   `${css.css ?? ''}\n/*# sourceMappingURL=data:application/json;base64,${Buffer.from((map), 'utf8').toString('base64')}*/` :
                                       `${css.css ?? ''}\n/*# sourceMappingURL=${canonicalMinifyURI}${filePath_CSS.replace(minifyDir, '')}.map*/`;
    afs.writeFile(filePath_CSS, cssOut, {encoding: 'utf8'});
}
