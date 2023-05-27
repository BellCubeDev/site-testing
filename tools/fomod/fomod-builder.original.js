import * as fomodUI from './fomod-builder-ui.js';
import * as fomodClasses from './fomod-builder-classifications.js';
import * as bcdUniversal from '../../universal.js';
const storageRevision = 1;
const defaultStorage = {
    storageRevision,
    settings: {
        autoSaveAfterChange: false,
        autoCleanSave: false,
        keepNamesSynced: true,
        includeInfoSchema: true,
        optimizationUsingFlags: true,
        saveConfigInXML: false,
        brandingComment: false,
        defaultSortingOrder: 'Explicit',
        defaultGroupSelectType: 'SelectAtLeastOne',
        formatXML: true,
    },
    preferences: {
        stepsBuilder: 'builder',
    }
};
function mergeObjects(obj1, obj2) {
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);
    const returnObj = {};
    for (let i = 0; i < obj1Keys.length; i++) {
        const key = obj1Keys[i];
        if (key in obj2) {
            if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object')
                returnObj[key] = mergeObjects(obj1[key], obj2[key]);
            else
                returnObj[key] = obj2[key] ?? obj1[key];
        }
        else
            returnObj[key] = obj1[key];
    }
    return returnObj;
}
const fetchedStorage = JSON.parse(localStorage.getItem('BellCubeDev_FOMOD_BUILDER_DATA') ?? '{}');
window.FOMODBuilder = {
    ui: {
        openFolder: fomodUI.openFolder,
        save: fomodUI.save,
        cleanSave: fomodUI.cleanSave,
        attemptRepair: () => { },
        setStepEditorType: fomodUI.setStepEditorType,
    },
    storage: mergeObjects(defaultStorage, fetchedStorage),
    fomodClass: fomodClasses.Fomod,
    trackedFomod: null
};
export const save = fomodUI.save;
function saveStorage() {
    bcdUniversal.updateSettings();
    try {
        localStorage.setItem('BellCubeDev_FOMOD_BUILDER_DATA', JSON.stringify(window.FOMODBuilder.storage));
    }
    catch {
        return false;
    }
    return true;
}
window.FOMODBuilder.storage = bcdUniversal.setProxies(window.FOMODBuilder.storage, {
    set() {
        return saveStorage();
    }
});
saveStorage();
let noSupportModal = null;
export function getNoSupportModal() {
    if (noSupportModal)
        return noSupportModal;
    const APIs = {
        '<a href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API" target="_blank" rel="noopener noreferrer">File System Access API</a>': window.showOpenFilePicker,
    };
    const unavailableAPIs = [];
    for (const [api, testFunct] of Object.entries(APIs)) {
        if (!testFunct)
            unavailableAPIs.push(api);
    }
    const noSupportModal_elem = document.getElementById('no-support-modal');
    if (!noSupportModal_elem) {
        noSupportModal = null;
        return null;
    }
    if (unavailableAPIs.length)
        noSupportModal_elem.setAttribute('open-by-default', '');
    const replaceMeElem = noSupportModal_elem.getElementsByClassName('js-bcd-modal-body')[0]?.getElementsByClassName('replace_me_txt')[0];
    if (replaceMeElem) {
        const lastAPITested = unavailableAPIs.pop();
        replaceMeElem.innerHTML = unavailableAPIs.join(', ');
        if (lastAPITested) {
            if (unavailableAPIs.length > 1)
                replaceMeElem.innerHTML += `, and ${lastAPITested}`;
            else if (unavailableAPIs.length)
                replaceMeElem.innerHTML += ` and ${lastAPITested}`;
            else
                replaceMeElem.innerHTML += lastAPITested;
        }
    }
    noSupportModal = noSupportModal_elem.upgrades?.getExtends(bcdUniversal.BCDModalDialog)?.[0] ?? null;
    return noSupportModal;
}
window.bcd_init_functions.fomodBuilder = function fomodBuilderInit() {
    console.debug('Initializing the FOMOD Builder!');
    getNoSupportModal();
    fomodUI.init();
    bcdUniversal.updateSettings();
    console.debug('FOMOD Builder initialized!');
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9tb2QtYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJ0b29scy9mb21vZC9mb21vZC1idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sS0FBSyxPQUFPLE1BQU0sdUJBQXVCLENBQUM7QUFDakQsT0FBTyxLQUFLLFlBQVksTUFBTyxvQ0FBb0MsQ0FBQztBQUNwRSxPQUFPLEtBQUssWUFBWSxNQUFNLG9CQUFvQixDQUFDO0FBK0RuRCxNQUFNLGVBQWUsR0FBRyxDQUFDLENBQUM7QUFDMUIsTUFBTSxjQUFjLEdBQW9CO0lBQ3BDLGVBQWU7SUFDZixRQUFRLEVBQUU7UUFDTixtQkFBbUIsRUFBRSxLQUFLO1FBQzFCLGFBQWEsRUFBRSxLQUFLO1FBRXBCLGVBQWUsRUFBRSxJQUFJO1FBRXJCLGlCQUFpQixFQUFFLElBQUk7UUFDdkIsc0JBQXNCLEVBQUUsSUFBSTtRQUU1QixlQUFlLEVBQUUsS0FBSztRQUN0QixlQUFlLEVBQUUsS0FBSztRQUV0QixtQkFBbUIsRUFBRSxVQUFVO1FBQy9CLHNCQUFzQixFQUFFLGtCQUFrQjtRQUUxQyxTQUFTLEVBQUUsSUFBSTtLQUNsQjtJQUNELFdBQVcsRUFBRTtRQUNULFlBQVksRUFBRSxTQUFTO0tBQzFCO0NBQ0osQ0FBQztBQUdGLFNBQVMsWUFBWSxDQUFDLElBQVksRUFBRSxJQUFZO0lBQzVDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUEwQixDQUFDO0lBQzVELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUEwQixDQUFDO0lBRTVELE1BQU0sU0FBUyxHQUF3QixFQUFFLENBQUM7SUFFMUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxN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QUM7QUFDaEQsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYmNkRlMgZnJvbSAnLi4vLi4vZmlsZXN5c3RlbS1pbnRlcmZhY2UuanMnO1xuaW1wb3J0ICogYXMgZm9tb2RVSSBmcm9tICcuL2ZvbW9kLWJ1aWxkZXItdWkuanMnO1xuaW1wb3J0ICogYXMgZm9tb2RDbGFzc2VzIGZyb20gICcuL2ZvbW9kLWJ1aWxkZXItY2xhc3NpZmljYXRpb25zLmpzJztcbmltcG9ydCAqIGFzIGJjZFVuaXZlcnNhbCBmcm9tICcuLi8uLi91bml2ZXJzYWwuanMnO1xuXG5kZWNsYXJlIGdsb2JhbCB7aW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgRk9NT0RCdWlsZGVyOiB7XG4gICAgICAgIHVpOiBmb21vZFVJLldpbmRvd1VJXG4gICAgICAgIGRpcmVjdG9yeT86IGJjZEZTLndyaXRlYWJsZUZvbGRlcjtcbiAgICAgICAgc3RvcmFnZTogYnVpbGRlclN0b3JhZ2U7XG4gICAgICAgIGZvbW9kQ2xhc3M6IHR5cGVvZiBmb21vZENsYXNzZXMuRm9tb2Q7XG4gICAgICAgIHRyYWNrZWRGb21vZDogbnVsbCB8IHtcbiAgICAgICAgICAgIG9iajogZm9tb2RDbGFzc2VzLkZvbW9kLFxuICAgICAgICAgICAgaW5mb0RvYzogWE1MRG9jdW1lbnQsXG4gICAgICAgICAgICBtb2R1bGVEb2M6IFhNTERvY3VtZW50LFxuICAgICAgICB9O1xuICAgIH07XG59fVxuXG5leHBvcnQgaW50ZXJmYWNlIGJ1aWxkZXJTdG9yYWdlIHtcbiAgICBzdG9yYWdlUmV2aXNpb246IG51bWJlcixcbiAgICAvKiogVmFsdWVzIHRoYXQgdGhlIHVzZXIgaGFzIGV4cGxpY2l0bHkgc2V0ICovXG4gICAgc2V0dGluZ3M6IHtcbiAgICAgICAgLyoqIFNhdmUgYWZ0ZXIgZWFjaCBjaGFuZ2U/XG4gICAgICAgICAgICBAZGVmYXVsdCBmYWxzZSAqL1xuICAgICAgICBhdXRvU2F2ZUFmdGVyQ2hhbmdlOiBib29sZWFuOyAvLyBmYWxzZVxuICAgICAgICAvKiogQUxXQVlTIG51a2UgdGhlIGRvY3VtZW50IGFuZCBzdGFydCBhbmV3P1xuICAgICAgICAgICAgQGRlZmF1bHQgZmFsc2UgKi9cbiAgICAgICAgYXV0b0NsZWFuU2F2ZTogYm9vbGVhbjsgLy8gZmFsc2VcblxuICAgICAgICAvKiogS2VlcCB0aGUgTmFtZSBpbiBJbmZvLnhtbCBhbmQgdGhlIE1vZHVsZSBOYW1lIGluIE1vZHVsZS54bWwgc3luY2VkP1xuICAgICAgICAgICBXaWxsIHByZWZlciB0aGUgbmFtZSBpbiBJbmZvLnhtbCBpZiB0aGV5IGFyZSBkaWZmZXJlbnRcbiAgICAgICAgICAgQGRlZmF1bHQgdHJ1ZSAqL1xuICAgICAgICBrZWVwTmFtZXNTeW5jZWQ6IGJvb2xlYW47IC8vIHRydWUgLSBkaXNhYmxlIHdoZW4gbG9hZGluZyBhIEZPTU9EIHdpdGggZGVzeW5jZWQgbmFtZXNcblxuICAgICAgICAvKiogSW5jbHVkZSBhIHNjaGVtYSBsaW5rIGluc2lkZSBJbmZvLnhtbD9cbiAgICAgICAgICAgIEBkZWZhdWx0IHRydWUgKi9cbiAgICAgICAgaW5jbHVkZUluZm9TY2hlbWE6IGJvb2xlYW47IC8vIHRydWVcbiAgICAgICAgLyoqIEF1dG9tYXRpY2FsbHkgb3B0aW1pemUgdGhlIEZPTU9EIGJ5IG1vdmluZyBmaWxlIGluc3RhbGxzIHRvIHRoZSBlbmQgcmF0aGVyIHRoYW4gYWZ0ZXIgZWFjaCBzdGVwXG4gICAgICAgICAgICBAZGVmYXVsdCB0cnVlICovXG4gICAgICAgIG9wdGltaXphdGlvblVzaW5nRmxhZ3M6IGJvb2xlYW47IC8vIHRydWVcblxuICAgICAgICAvKiogV2hldGhlciBvciBub3Qgd2Ugc2hvdWxkIHNhdmUgdGhlIEZPTU9EIEJ1aWxkZXIgc2V0dGluZ3MgaW5zaWRlIG9mIHRoZSBYTUwgZG9jdW1lbnQgcmF0aGVyIHRoYW4gdGhlIGJyb3dzZXJcbiAgICAgICAgICAgIEBkZWZhdWx0IGZhbHNlICovXG4gICAgICAgIHNhdmVDb25maWdJblhNTDogYm9vbGVhbjsgLy8gZmFsc2VcbiAgICAgICAgLyoqIFdoZXRoZXIgb3Igbm90IHdlIHNob3VsZCBpbmNsdWRlIGEgY29tbWVudCBkaXJlY3RpbmcgdXNlcnMgdG8gdGhlIEZPTU9EIEJ1aWxkZXJcbiAgICAgICAgICAgIEBkZWZhdWx0IGZhbHNlICovXG4gICAgICAgIGJyYW5kaW5nQ29tbWVudDogYm9vbGVhbjsgLy8gZmFsc2VcblxuICAgICAgICAvKiogV2hhdCBzaG91bGQgdGhlIGRlZmF1bHQgR3JvdXAgU29ydGluZyBPcmRlciBiZT9cbiAgICAgICAgICAgIEBkZWZhdWx0ICdFeHBsaWNpdCcgKi9cbiAgICAgICAgZGVmYXVsdFNvcnRpbmdPcmRlcjogZm9tb2RDbGFzc2VzLlNvcnRPcmRlcjsgLy8gJ0V4cGxpY2l0J1xuICAgICAgICAvKiogV2hhdCBzaG91bGQgdGhlIGRlZmF1bHQgR3JvdXAgU2VsZWN0aW9uIHR5cGUgYmU/XG4gICAgICAgICAgICBAZGVmYXVsdCAnU2VsZWN0QXRMZWFzdE9uZScgKi9cbiAgICAgICAgZGVmYXVsdEdyb3VwU2VsZWN0VHlwZTogZm9tb2RDbGFzc2VzLkdyb3VwU2VsZWN0VHlwZTsgLy8gJ1NlbGVjdEF0TGVhc3RPbmUnXG5cbiAgICAgICAgLyoqIFdoZXRoZXIgd2Ugc2hvdWxkIGZvcm1hdCBYTUwgZG9jdW1lbnRzIG9uIHNhdmVcbiAgICAgICAgICAgIEBkZWZhdWx0IHRydWUgKi9cbiAgICAgICAgZm9ybWF0WE1MOiBib29sZWFuOyAvLyB0cnVlXG4gICAgfVxuICAgIC8qKiBUaGluZ3MgdGhhdCB0aGUgY29kZSBoYXMgZGV0ZXJtaW5lZCB0aGF0IHRoZSB1c2VyIHByZWZlcnMgKi9cbiAgICBwcmVmZXJlbmNlczoge1xuICAgICAgICBzdGVwc0J1aWxkZXI6IGZvbW9kVUkuQkNEQnVpbGRlclR5cGUsIC8vICdidWlsZGVyJ1xuICAgIH1cbn1cblxuY29uc3Qgc3RvcmFnZVJldmlzaW9uID0gMTtcbmNvbnN0IGRlZmF1bHRTdG9yYWdlOiBidWlsZGVyU3RvcmFnZSA9ICB7XG4gICAgc3RvcmFnZVJldmlzaW9uLFxuICAgIHNldHRpbmdzOiB7XG4gICAgICAgIGF1dG9TYXZlQWZ0ZXJDaGFuZ2U6IGZhbHNlLFxuICAgICAgICBhdXRvQ2xlYW5TYXZlOiBmYWxzZSxcblxuICAgICAgICBrZWVwTmFtZXNTeW5jZWQ6IHRydWUsIC8vIGJlIHN1cmUgdG8gZGlzYWJsZSB3aGVuIGxvYWRpbmcgYSBGT01PRCB3aXRoIGRlc3luY2VkIG5hbWVzXG5cbiAgICAgICAgaW5jbHVkZUluZm9TY2hlbWE6IHRydWUsXG4gICAgICAgIG9wdGltaXphdGlvblVzaW5nRmxhZ3M6IHRydWUsXG5cbiAgICAgICAgc2F2ZUNvbmZpZ0luWE1MOiBmYWxzZSxcbiAgICAgICAgYnJhbmRpbmdDb21tZW50OiBmYWxzZSxcblxuICAgICAgICBkZWZhdWx0U29ydGluZ09yZGVyOiAnRXhwbGljaXQnLFxuICAgICAgICBkZWZhdWx0R3JvdXBTZWxlY3RUeXBlOiAnU2VsZWN0QXRMZWFzdE9uZScsXG5cbiAgICAgICAgZm9ybWF0WE1MOiB0cnVlLFxuICAgIH0sXG4gICAgcHJlZmVyZW5jZXM6IHtcbiAgICAgICAgc3RlcHNCdWlsZGVyOiAnYnVpbGRlcicsXG4gICAgfVxufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHlwZXNcbmZ1bmN0aW9uIG1lcmdlT2JqZWN0cyhvYmoxOiBPYmplY3QsIG9iajI6IE9iamVjdCk6IE9iamVjdCB7XG4gICAgY29uc3Qgb2JqMUtleXMgPSBPYmplY3Qua2V5cyhvYmoxKSBhcyAoa2V5b2YgdHlwZW9mIG9iajEpW107XG4gICAgY29uc3Qgb2JqMktleXMgPSBPYmplY3Qua2V5cyhvYmoyKSBhcyAoa2V5b2YgdHlwZW9mIG9iajIpW107XG5cbiAgICBjb25zdCByZXR1cm5PYmo6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqMUtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0gb2JqMUtleXNbaV0hO1xuXG4gICAgICAgIGlmIChrZXkgaW4gb2JqMikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmoxW2tleV0gPT09ICdvYmplY3QnICYmIHR5cGVvZiBvYmoyW2tleV0gPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5PYmpba2V5XSA9IG1lcmdlT2JqZWN0cyhvYmoxW2tleV0sIG9iajJba2V5XSk7XG4gICAgICAgICAgICBlbHNlIHJldHVybk9ialtrZXldID0gb2JqMltrZXldID8/IG9iajFba2V5XTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICByZXR1cm5PYmpba2V5XSA9IG9iajFba2V5XTtcblxuICAgIH1cblxuICAgIHJldHVybiByZXR1cm5PYmo7XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXR5cGVzXG5jb25zdCBmZXRjaGVkU3RvcmFnZSA9IEpTT04ucGFyc2UoICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0JlbGxDdWJlRGV2X0ZPTU9EX0JVSUxERVJfREFUQScpID8/ICd7fScgICApIGFzIGJ1aWxkZXJTdG9yYWdlIHwge307XG5cbndpbmRvdy5GT01PREJ1aWxkZXIgPSB7XG5cbiAgICB1aToge1xuICAgICAgICBvcGVuRm9sZGVyOiBmb21vZFVJLm9wZW5Gb2xkZXIsXG4gICAgICAgIHNhdmU6IGZvbW9kVUkuc2F2ZSxcbiAgICAgICAgY2xlYW5TYXZlOiBmb21vZFVJLmNsZWFuU2F2ZSxcbiAgICAgICAgYXR0ZW1wdFJlcGFpcjogKCkgPT4ge30sXG4gICAgICAgIHNldFN0ZXBFZGl0b3JUeXBlOiBmb21vZFVJLnNldFN0ZXBFZGl0b3JUeXBlLFxuICAgIH0sXG5cbiAgICAvLyBSZXRyaWV2ZXMgdGhlIGJyb3dzZXIgc3RvcmFnZSBlbnRyeSBpZiBhdmFpbGFibGUsIG90aGVyd2lzZSB1c2VzIHRoZSBkZWZhdWx0cy5cbiAgICBzdG9yYWdlOiBtZXJnZU9iamVjdHMoZGVmYXVsdFN0b3JhZ2UsIGZldGNoZWRTdG9yYWdlKSBhcyBidWlsZGVyU3RvcmFnZSxcblxuICAgIGZvbW9kQ2xhc3M6IGZvbW9kQ2xhc3Nlcy5Gb21vZCxcblxuICAgIHRyYWNrZWRGb21vZDogbnVsbFxufTtcblxuZXhwb3J0IGNvbnN0IHNhdmUgPSBmb21vZFVJLnNhdmU7XG5cbmZ1bmN0aW9uIHNhdmVTdG9yYWdlKCkge1xuICAgIGJjZFVuaXZlcnNhbC51cGRhdGVTZXR0aW5ncygpO1xuICAgIHRyeSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdCZWxsQ3ViZURldl9GT01PRF9CVUlMREVSX0RBVEEnLCBKU09OLnN0cmluZ2lmeSh3aW5kb3cuRk9NT0RCdWlsZGVyLnN0b3JhZ2UpKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxud2luZG93LkZPTU9EQnVpbGRlci5zdG9yYWdlID0gYmNkVW5pdmVyc2FsLnNldFByb3hpZXMod2luZG93LkZPTU9EQnVpbGRlci5zdG9yYWdlLCB7XG4gICAgc2V0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gc2F2ZVN0b3JhZ2UoKTtcbiAgICB9XG59KTtcbnNhdmVTdG9yYWdlKCk7XG5cbmxldCBub1N1cHBvcnRNb2RhbDogYmNkVW5pdmVyc2FsLkJDRE1vZGFsRGlhbG9nfG51bGwgPSBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5vU3VwcG9ydE1vZGFsKCk6IGJjZFVuaXZlcnNhbC5CQ0RNb2RhbERpYWxvZ3xudWxsIHtcbiAgICBpZiAobm9TdXBwb3J0TW9kYWwpIHJldHVybiBub1N1cHBvcnRNb2RhbDtcblxuICAgIGNvbnN0IEFQSXM6IFJlY29yZDxzdHJpbmcsIEZ1bmN0aW9uPiA9IHtcbiAgICAgICAgLyogRmlsZSBTeXN0ZW0gQWNjZXNzIEFQSSAqLyc8YSBocmVmPVwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVfU3lzdGVtX0FjY2Vzc19BUElcIiB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCI+RmlsZSBTeXN0ZW0gQWNjZXNzIEFQSTwvYT4nOiB3aW5kb3cuc2hvd09wZW5GaWxlUGlja2VyLFxuICAgIH07XG4gICAgY29uc3QgdW5hdmFpbGFibGVBUElzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgW2FwaSwgdGVzdEZ1bmN0XSBvZiBPYmplY3QuZW50cmllcyhBUElzKSkge1xuICAgICAgICBpZiAoIXRlc3RGdW5jdCkgdW5hdmFpbGFibGVBUElzLnB1c2goYXBpKTtcbiAgICB9XG5cbiAgICBjb25zdCBub1N1cHBvcnRNb2RhbF9lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vLXN1cHBvcnQtbW9kYWwnKSBhcyBIVE1MRGlhbG9nRWxlbWVudHxudWxsO1xuICAgIGlmICghbm9TdXBwb3J0TW9kYWxfZWxlbSkge1xuICAgICAgICBub1N1cHBvcnRNb2RhbCA9IG51bGw7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICh1bmF2YWlsYWJsZUFQSXMubGVuZ3RoKSBub1N1cHBvcnRNb2RhbF9lbGVtLnNldEF0dHJpYnV0ZSgnb3Blbi1ieS1kZWZhdWx0JywgJycpO1xuXG4gICAgY29uc3QgcmVwbGFjZU1lRWxlbSA9IG5vU3VwcG9ydE1vZGFsX2VsZW0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtYmNkLW1vZGFsLWJvZHknKVswXT8uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncmVwbGFjZV9tZV90eHQnKVswXSBhcyBIVE1MRWxlbWVudHx1bmRlZmluZWQ7XG5cbiAgICBpZiAocmVwbGFjZU1lRWxlbSkge1xuXG4gICAgICAgIGNvbnN0IGxhc3RBUElUZXN0ZWQgPSB1bmF2YWlsYWJsZUFQSXMucG9wKCk7XG4gICAgICAgIHJlcGxhY2VNZUVsZW0uaW5uZXJIVE1MID0gdW5hdmFpbGFibGVBUElzLmpvaW4oJywgJyk7XG5cbiAgICAgICAgaWYgKGxhc3RBUElUZXN0ZWQpIHtcbiAgICAgICAgICAgIGlmICh1bmF2YWlsYWJsZUFQSXMubGVuZ3RoID4gMSkgcmVwbGFjZU1lRWxlbS5pbm5lckhUTUwgKz0gYCwgYW5kICR7bGFzdEFQSVRlc3RlZH1gO1xuXG4gICAgICAgICAgICBlbHNlIGlmICh1bmF2YWlsYWJsZUFQSXMubGVuZ3RoKSByZXBsYWNlTWVFbGVtLmlubmVySFRNTCArPSBgIGFuZCAke2xhc3RBUElUZXN0ZWR9YDtcblxuICAgICAgICAgICAgZWxzZSByZXBsYWNlTWVFbGVtLmlubmVySFRNTCArPSBsYXN0QVBJVGVzdGVkO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBub1N1cHBvcnRNb2RhbCA9IG5vU3VwcG9ydE1vZGFsX2VsZW0udXBncmFkZXM/LmdldEV4dGVuZHMoYmNkVW5pdmVyc2FsLkJDRE1vZGFsRGlhbG9nKT8uWzBdID8/IG51bGw7XG4gICAgcmV0dXJuIG5vU3VwcG9ydE1vZGFsO1xufVxuXG53aW5kb3cuYmNkX2luaXRfZnVuY3Rpb25zLmZvbW9kQnVpbGRlciA9IGZ1bmN0aW9uIGZvbW9kQnVpbGRlckluaXQoKSB7XG4gICAgY29uc29sZS5kZWJ1ZygnSW5pdGlhbGl6aW5nIHRoZSBGT01PRCBCdWlsZGVyIScpO1xuXG4gICAgZ2V0Tm9TdXBwb3J0TW9kYWwoKTtcblxuICAgIGZvbW9kVUkuaW5pdCgpO1xuXG4gICAgYmNkVW5pdmVyc2FsLnVwZGF0ZVNldHRpbmdzKCk7XG5cbiAgICBjb25zb2xlLmRlYnVnKCdGT01PRCBCdWlsZGVyIGluaXRpYWxpemVkIScpO1xufTtcbiJdfQ==