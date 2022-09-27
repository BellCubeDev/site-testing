import * as uglify from 'uglify-js';
import * as path from 'path';
import * as fs from 'fs';

//console.log('environment:', JSON.stringify(process.env, undefined, 4));

const minifiedVarCache = {};

const mapBase = process.env.sourceMapBase ?? 'https://raw.githubusercontent.com/BellCubeDev/site-testing/deployment/';

minifyJSInDir(process.env.minifyDir);

/** @param {fs.Dirent[]} dir Directory to traverse */
function minifyJSInDir(dir) {
    const files = fs.readdirSync(dir);

    for (let i = 0; i < files.length; i++) {

        const filePath = path.join(dir, files[i]);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) minifyJSInDir(filePath);
        else if (filePath.endsWith('.js')) minifyFile(filePath);

    }
}

/** @param {string} filePath */
function minifyFile(filePath) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
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
            includeSources: false,
            root: `${mapBase}`,
            url: `${mapBase}${urlFilePath}.map`
        },
        module: true,
        toplevel: true,
        nameCache: minifiedVarCache,
        warnings: true,
        webkit: true
    });

    if (minified.warnings) console.warn(`Minifying file "${filePath}" threw the warnings...\n${JSON.stringify(minified.warnings)}`);
    if (minified.error?.name?.length > 2) throw new Error(`Minifying file "${filePath}" threw an error:\n${minified.error.name}\n${minified.error.message}\n${minified.error.stack}`);

    fs.writeFileSync(filePath, minified.code);

    if (hasTS) fs.writeFileSync(`${filePath}.map`, minified.map.replace('"sources":["0"]', `"sources":["${hasTS ? urlFilePath.replace(/\.js$/, '.ts') : urlFilePath}"]`));
    else {
        fs.writeFileSync(filePath.replace(/\.js$/, '.original.js'), fileContents);
        fs.writeFileSync(`${filePath}.map`, minified.map.replace('"sources":["0"]', `"sources":["${urlFilePath.replace(/\.js$/, '.original.js')}"]`));
    }
}
