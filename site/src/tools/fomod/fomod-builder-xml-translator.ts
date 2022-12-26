import * as classes from './fomod-builder-classifications.js';

export function translateWhole(module: string, info: string, setWindowValues = false) : classes.Fomod {
    const parser = window.domParser;

    const moduleDoc = parser.parseFromString(module || '<config/>', 'text/xml');
    if (moduleDoc.documentElement.tagName !== 'config') throw new Error('ModuleConfig.xml is not valid!'); // TODO: Inform user of error and provide a way to fix it

    const infoDoc = parser.parseFromString(info || '<fomod/>', 'text/xml');
    if (infoDoc.documentElement.tagName !== 'fomod') throw new Error('Info.xml is not valid!'); // TODO: Inform user of error and provide a way to fix it

    console.log("Documents fetched!", {moduleDoc, infoDoc});

    const obj = new classes.Fomod(moduleDoc.getOrCreateChild("config"), infoDoc.getOrCreateChild("fomod"));

    if (setWindowValues) {
        window.FOMODBuilder.trackedFomod = {
            obj,
            infoDoc,
            moduleDoc
        };
    }

    return obj;
}
