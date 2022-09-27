import * as uglify from 'uglify-js';
import * as path from 'path';
import * as afs from 'fs/promises';

//console.log('environment:', JSON.stringify(process.env, undefined, 4));

console.log('Minifying files...');

const minifiedVarCache = {};

const doInlineSources = process.env.doInlineSources?.trim() === 'true';

minifyJSInDir(process.env.minifyDir);

/** @param {string} dirPath Directory to traverse */
async function minifyJSInDir(dirPath) {
    const files = await afs.readdir(dirPath);

    for (let i = 0; i < files.length; i++) {
        evalFileOrDir(path.join(dirPath, files[i]));
    }
}

/** Evaluates a single file or directory asynchronously
    @param {string} filePath the path of the file or directory to evaluate
*/
async function evalFileOrDir(path) {
    const stat = await afs.lstat(path);

    if (stat.isDirectory()) minifyJSInDir(path);
    else if (path.endsWith('.js')) minifyJSFile(path);
}

/** Minify a single JavaScript file asynchronously
    @param {string} filePath
*/
async function minifyJSFile(filePath) {
    if (filePath.endsWith('.min.js')) return;
    const fileContents = await afs.readFile(filePath, 'utf8');
    const urlFilePath = filePath.replace(process.env.minifyDir, '').replace(/\\/g, '/');

    const hasTS = fileContents.includes('//# sourceMappingURL=');

    const minified = uglify.minify(fileContents, {
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
            keep_fargs: false,
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
            top_retain: null,
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
            root: 'https://raw.githubusercontent.com/BellCubeDev/site-testing/deployment/',
            url: doInlineSources ? 'inline' : `https://raw.githubusercontent.com/BellCubeDev/site-testing/deployment/${urlFilePath}.map`
        },
        module: true,
        toplevel: true,
        nameCache: minifiedVarCache,
        warnings: true,
        webkit: true
    });

    if (minified.warnings) {
        const filteredWarnings = minified.warnings.filter(msg => !msg.match(/inline source map not found/)).map(msg => msg.trim().replace(/^WARN:\s*/, ''));

        if (filteredWarnings.length > 0)
            console.warn(`\nMinifying file "${filePath}" threw the warnings...\n- ${filteredWarnings.join('\n- ')}`);
    }
    if (minified.error?.name?.length > 2) throw new Error(`Minifying file "${filePath}" threw an error:\n${minified.error.name}\n${minified.error.message}\n${minified.error.stack}`);

    afs.writeFile(filePath, minified.code);

    if (hasTS) afs.writeFile(`${filePath}.map`, minified.map.replace('"sources":["0"]', `"sources":["${hasTS ? urlFilePath.replace(/\.js$/, '.ts') : urlFilePath}"]`));
    else {
        afs.writeFile(filePath.replace(/\.js$/, '.original.js'), fileContents);
        afs.writeFile(`${filePath}.map`, minified.map.replace('"sources":["0"]', `"sources":["${urlFilePath.replace(/\.js$/, '.original.js')}"]`));
    }
}
