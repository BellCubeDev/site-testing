import * as classes from './fomod-builder-classifications.js';

export function translateWhole(module: string, info: string, setWindowValues = false) : classes.Fomod {
    const parser = window.domParser;

    const moduleDoc = parser.parseFromString(module || '<config/>', 'text/xml');
    if (moduleDoc.documentElement.tagName !== 'config') throw new Error('ModuleConfig.xml is not valid!'); // TODO: Inform user of error and provide a way to fix it

    const infoDoc = parser.parseFromString(info || '<fomod/>', 'text/xml');
    if (infoDoc.documentElement.tagName !== 'fomod') throw new Error('Info.xml is not valid!'); // TODO: Inform user of error and provide a way to fix it

    console.log("Documents fetched!", {moduleDoc, infoDoc});

    const obj = new classes.Fomod(moduleDoc.getOrCreateChildByTag("config"), infoDoc.getOrCreateChildByTag("fomod"));

    if (setWindowValues) {
        if (window.FOMODBuilder.trackedFomod?.obj) window.FOMODBuilder.trackedFomod.obj.destroy();
        window.FOMODBuilder.trackedFomod = {
            obj,
            infoDoc,
            moduleDoc
        };
    }

    return obj;
}

declare global {
    interface Window {
        loadTestFOMOD: () => void;
    }
}

const testInfo = `
<fomod xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://testing.bellcube.dev/assets/site/misc/Info.xsd">
    <Name>Some Name™</Name>
    <Author>Best Author Ever!</Author>
    <Id>51238068465248570</Id>
    <Website>https://www.google.com/</Website>
    <Version>1.0.0</Version>
</fomod>
`;

const testModule = `
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://qconsulting.ca/fo3/ModConfig5.0.xsd">
    <moduleName>Some Name™</moduleName>
    <moduleImage path="fomod/WoodworkersWhim.png"/>
</config>
`;

window.loadTestFOMOD = () => {
    console.log("Loading test FOMOD...");
    const fomod = translateWhole(testModule, testInfo, true);
    console.log("FOMOD loaded!", fomod);
};
