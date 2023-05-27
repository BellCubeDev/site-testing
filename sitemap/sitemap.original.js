import { componentHandler } from '../assets/site/mdl/material.js';
const cssDetails_ = 'js-bcd-details_';
const cssSummary_ = 'js-bcd-summary_';
window.bcd_init_functions.sitemap = sitemapInit;
const elementsToUpgrade = [];
let prefabItem;
let prefabDir;
let prefabParent;
let obj;
async function sitemapInit() {
    const data = await fetch(`${window.location.href}sitemap.json`);
    obj = await data.json();
    console.debug('Working with object:\n', obj);
    const sitemapContainer = document.getElementById('sitemap');
    prefabParent = document.getElementById('prefabs');
    prefabItem = prefabParent.content.getElementById('prefab-sitemap-item');
    prefabDir = prefabParent.content.getElementById('prefab-sitemap-dir');
    const filteredPages = obj.pages.filter(page => page.layout && page.layout !== 'compress_html' && page.sitemap !== false);
    const splitPagePaths = filteredPages.map(page => {
        return {
            ...page,
            path: page.path.split('/')
        };
    });
    const sortedPages = splitPagePaths.sort((a, b) => {
        const [aPath, bPath] = [[...a.path], [...b.path]];
        const [lastA, lastB] = [aPath.pop(), bPath.pop()];
        while (aPath.length || bPath.length) {
            const [aDir, bDir] = [aPath.shift(), bPath.shift()];
            if (aDir === bDir)
                continue;
            if (!aDir)
                return 1;
            if (!bDir)
                return -1;
            if (aDir !== bDir)
                return aDir.localeCompare(bDir);
        }
        if (lastA === lastB)
            return 0;
        else
            return lastA.localeCompare(lastB) ? 1 : -1;
    });
    for (const page of sortedPages) {
        page.path.pop();
        console.debug('======================================================');
        console.debug('Current file:', page.name);
        console.debug('Working with path:\n', JSON.stringify(page.path));
        let lastDir = sitemapContainer;
        for (const dir of page.path) {
            lastDir = findOrCreateDir(dir, lastDir);
            console.debug('Dir', lastDir);
        }
        const item = prefabItem.cloneNode(true);
        item.removeAttribute('id');
        const a = item.querySelector('.sitemap-item');
        const tempTextCont = (page.formatted_title ?? page.title ?? page.name).trim();
        if (tempTextCont in obj.translation)
            a.textContent = obj.translation[tempTextCont];
        else
            a.textContent = tempTextCont;
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
    setTimeout(componentHandler.upgradeElements.bind(undefined, elementsToUpgrade));
}
function findOrCreateDir(dir, entryPoint) {
    console.debug('Looking for dir', dir);
    const existingDir = entryPoint.querySelector(entryPoint.id === 'sitemap' ?
        `:scope                    > .sitemap-dir > .js-bcd-summary_ > .sitemap-dir-name[data-dir="${dir}"]`
        : `:scope > .js-bcd-details_ > .sitemap-dir > .js-bcd-summary_ > .sitemap-dir-name[data-dir="${dir}"]`)?.parentElement.parentElement;
    console.debug('Existing dir:', existingDir);
    if (existingDir)
        return existingDir;
    console.debug('Creating new dir:', dir);
    const newDir = prefabDir.cloneNode(true);
    newDir.removeAttribute('id');
    const thisSummary = newDir.querySelector(':scope > .js-bcd-summary_');
    let tempTextCont = dir.trim();
    if (tempTextCont in obj.translation)
        tempTextCont = obj.translation[tempTextCont];
    const thisName = thisSummary.querySelector(':scope > .sitemap-dir-name');
    thisName.textContent = tempTextCont;
    thisName.setAttribute('data-dir', dir);
    const appendPoint = entryPoint.querySelector(':scope > .js-bcd-details_') ?? entryPoint;
    const existingItems = appendPoint.querySelector(':scope > .sitemap-dir-items');
    if (existingItems)
        appendPoint.insertBefore(newDir, existingItems);
    else
        appendPoint.appendChild(newDir);
    elementsToUpgrade.push(...newDir.children);
    return newDir;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0ZW1hcC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vQmVsbEN1YmVEZXYvc2l0ZS10ZXN0aW5nL2RlcGxveW1lbnQvIiwic291cmNlcyI6WyJzaXRlbWFwL3NpdGVtYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFFaEUsTUFBTSxXQUFXLEdBQUcsaUJBQWlCLENBQUM7QUFDdEMsTUFBTSxXQUFXLEdBQUcsaUJBQWlCLENBQUM7QUFtQnRDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDO0FBR2hELE1BQU0saUJBQWlCLEdBQWlCLEVBQUUsQ0FBQztBQVUzQyxJQUFJLFVBQXlCLENBQUM7QUFlOUIsSUFBSSxTQUF3QixDQUFDO0FBRTdCLElBQUksWUFBZ0MsQ0FBQztBQUVyQyxJQUFJLEdBQWUsQ0FBQztBQUVwQixLQUFLLFVBQVUsV0FBVztJQUV0QixNQUFNLElBQUksR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQztJQUNoRSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFpQixDQUFDO0lBRXZDLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFN0MsTUFBTSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBbUIsQ0FBQztJQUU5RSxZQUFZLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQXdCLENBQUM7SUFFekUsVUFBVSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFtQixDQUFDO0lBQzFGLFNBQVMsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBbUIsQ0FBQztJQUV4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R0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBRSxDQUFDO0lBRW5GLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsNEJBQTRCLENBQXVCLENBQUM7SUFDL0YsUUFBUSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUM7SUFDcEMsUUFBUSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFdkMsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLFVBQVUsQ0FBQztJQUV4RixNQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLDZCQUE2QixDQUFDLENBQUM7SUFDL0UsSUFBSSxhQUFhO1FBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7O1FBQ2hELFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFcEQsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQXlDLENBQUMsQ0FBQztJQUU1RSxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjb21wb25lbnRIYW5kbGVyfSBmcm9tICcuLi9hc3NldHMvc2l0ZS9tZGwvbWF0ZXJpYWwuanMnO1xuXG5jb25zdCBjc3NEZXRhaWxzXyA9ICdqcy1iY2QtZGV0YWlsc18nO1xuY29uc3QgY3NzU3VtbWFyeV8gPSAnanMtYmNkLXN1bW1hcnlfJztcblxuaW50ZXJmYWNlIGpla3lsbFBhZ2VzIHtcbiAgICBwYWdlczogQXJyYXk8e1xuICAgICAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgICAgIGRpcjogc3RyaW5nO1xuICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgIHBhdGg6IHN0cmluZztcbiAgICAgICAgdXJsOiBzdHJpbmc7XG4gICAgICAgIFtrZXk6IHN0cmluZ106IHN0cmluZ3xib29sZWFufHVuZGVmaW5lZDtcbiAgICAgICAgbGF5b3V0Pzogc3RyaW5nO1xuICAgICAgICBwZXJtYWxpbms/OiBzdHJpbmc7XG4gICAgICAgIHNpdGVtYXA/OiBib29sZWFuO1xuICAgICAgICBmb3JtYXR0ZWRfdGl0bGU/OiBzdHJpbmc7XG4gICAgICAgIHRpdGxlPzogc3RyaW5nO1xuICAgIH0+LFxuICAgIHRyYW5zbGF0aW9uOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xufVxuXG53aW5kb3cuYmNkX2luaXRfZnVuY3Rpb25zLnNpdGVtYXAgPSBzaXRlbWFwSW5pdDtcblxuXG5jb25zdCBlbGVtZW50c1RvVXBncmFkZTpIVE1MRWxlbWVudFtdID0gW107XG5cblxuLyoqIFByZWZhYnJpY2F0ZWQgdGVtcGxhdGUgZm9yIGEgc2luZ2xlIHNpdGVtYXAgZW50cnlcbiAgICBgYGBodG1sXG4gICAgICAgIDxsaSBpZD1cInByZWZhYi1zaXRlbWFwLWl0ZW1cIj5cbiAgICAgICAgICAgIDxhIGNsYXNzPVwic2l0ZW1hcC1pdGVtXCIgaHJlZj1cIlwiIGNsYXNzPVwiXCI+VElUTEU8L2E+XG4gICAgICAgIDwvbGk+XG4gICAgYGBgXG4qL1xubGV0IHByZWZhYkl0ZW06SFRNTERpdkVsZW1lbnQ7XG5cbi8qKiBQcmVmYWJyaWNhdGVkIHRlbXBsYXRlIGZvciBhIGRpcmVjdG9yeSBpbiB0aGUgc2l0ZW1hcFxuICAgIGBgYGh0bWxcbiAgICAgICAgPGRpdiBpZD1cInByZWZhYi1zaXRlbWFwLWRpclwiIGNsYXNzPVwic2l0ZW1hcC1kaXJcIj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjc3NTdW1tYXJ5XyBhZGphY2VudCBpcy1vcGVuXCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgb3Blbi1pY29uLTkwQ0NcIj5leHBhbmRfbW9yZTwvaT5cbiAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJzaXRlbWFwLWRpci1uYW1lXCI+RElSRUNUT1JZPC9oMz5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY3NzRGV0YWlsc18gYWRqYWNlbnQgaXMtb3BlblwiPjx1bCBjbGFzcz1cInNpdGVtYXAtZGlyLWl0ZW1zXCI+XG4gICAgICAgICAgICA8L3VsPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgYGBcbiovXG5sZXQgcHJlZmFiRGlyOkhUTUxEaXZFbGVtZW50O1xuXG5sZXQgcHJlZmFiUGFyZW50OkhUTUxUZW1wbGF0ZUVsZW1lbnQ7XG5cbmxldCBvYmo6amVreWxsUGFnZXM7XG5cbmFzeW5jIGZ1bmN0aW9uIHNpdGVtYXBJbml0KCl7XG5cbiAgICBjb25zdCBkYXRhID0gYXdhaXQgZmV0Y2goYCR7d2luZG93LmxvY2F0aW9uLmhyZWZ9c2l0ZW1hcC5qc29uYCk7XG4gICAgb2JqID0gYXdhaXQgZGF0YS5qc29uKCkgYXMgamVreWxsUGFnZXM7XG5cbiAgICBjb25zb2xlLmRlYnVnKCdXb3JraW5nIHdpdGggb2JqZWN0OlxcbicsIG9iaik7XG5cbiAgICBjb25zdCBzaXRlbWFwQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpdGVtYXAnKSBhcyBIVE1MRGl2RWxlbWVudDtcblxuICAgIHByZWZhYlBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcmVmYWJzJykgYXMgSFRNTFRlbXBsYXRlRWxlbWVudDtcblxuICAgIHByZWZhYkl0ZW0gPSBwcmVmYWJQYXJlbnQuY29udGVudC5nZXRFbGVtZW50QnlJZCgncHJlZmFiLXNpdGVtYXAtaXRlbScpIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgIHByZWZhYkRpciA9IHByZWZhYlBhcmVudC5jb250ZW50LmdldEVsZW1lbnRCeUlkKCdwcmVmYWItc2l0ZW1hcC1kaXInKSBhcyBIVE1MRGl2RWxlbWVudDtcblxuICAgIGNvbnN0IGZpbHRlcmVkUGFnZXMgPSBvYmoucGFnZXMuZmlsdGVyKHBhZ2UgPT4gcGFnZS5sYXlvdXQgJiYgcGFnZS5sYXlvdXQgIT09ICdjb21wcmVzc19odG1sJyAmJiBwYWdlLnNpdGVtYXAgIT09IGZhbHNlKTtcblxuICAgIGNvbnN0IHNwbGl0UGFnZVBhdGhzID0gZmlsdGVyZWRQYWdlcy5tYXAocGFnZSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5wYWdlLFxuICAgICAgICAgICAgcGF0aDogcGFnZS5wYXRoLnNwbGl0KCcvJylcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8vIFNvcnQgcGFnZXMgYnkgcGF0aCAtIGZvbGRlcnMgc2hvdWxkIGJlIGJlZm9yZSBmaWxlcyBhbmQgc29ydGVkIGFscGhhYmV0aWNhbGx5XG5cbiAgICBjb25zdCBzb3J0ZWRQYWdlcyA9IHNwbGl0UGFnZVBhdGhzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgW2FQYXRoLCBiUGF0aF0gPSBbWy4uLmEucGF0aF0sIFsuLi5iLnBhdGhdXTtcbiAgICAgICAgY29uc3QgW2xhc3RBLCBsYXN0Ql0gPSBbYVBhdGgucG9wKCkhLCBiUGF0aC5wb3AoKSFdO1xuXG4gICAgICAgIHdoaWxlIChhUGF0aC5sZW5ndGggfHwgYlBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBbYURpciwgYkRpcl0gPSBbYVBhdGguc2hpZnQoKSEsIGJQYXRoLnNoaWZ0KCkhXTtcblxuICAgICAgICAgICAgaWYgKGFEaXIgPT09IGJEaXIpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAoIWFEaXIpIHJldHVybiAxO1xuICAgICAgICAgICAgaWYgKCFiRGlyKSByZXR1cm4gLTE7XG5cbiAgICAgICAgICAgIGlmIChhRGlyICE9PSBiRGlyKSByZXR1cm4gYURpci5sb2NhbGVDb21wYXJlKGJEaXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxhc3RBID09PSBsYXN0QikgcmV0dXJuIDA7XG4gICAgICAgIGVsc2UgcmV0dXJuIGxhc3RBLmxvY2FsZUNvbXBhcmUobGFzdEIpID8gMSA6IC0xO1xuICAgIH0pO1xuXG4gICAgZm9yIChjb25zdCBwYWdlIG9mIHNvcnRlZFBhZ2VzKSB7XG4gICAgICAgIHBhZ2UucGF0aC5wb3AoKTsgLy8gUmVtb3ZlIGZpbGVuYW1lXG5cbiAgICAgICAgY29uc29sZS5kZWJ1ZygnPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Jyk7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ0N1cnJlbnQgZmlsZTonLCBwYWdlLm5hbWUpO1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdXb3JraW5nIHdpdGggcGF0aDpcXG4nLCBKU09OLnN0cmluZ2lmeShwYWdlLnBhdGgpKTtcblxuICAgICAgICAvLyBOYXZpZ2F0ZSBkb3duIHRoZSB0cmVlIHRvIHRoZSBjb3JyZWN0IGRpcmVjdG9yeVxuICAgICAgICBsZXQgbGFzdERpcjpIVE1MRGl2RWxlbWVudHxudWxsID0gc2l0ZW1hcENvbnRhaW5lcjtcbiAgICAgICAgZm9yIChjb25zdCBkaXIgb2YgcGFnZS5wYXRoKSB7XG4gICAgICAgICAgICBsYXN0RGlyID0gZmluZE9yQ3JlYXRlRGlyKGRpciwgbGFzdERpcik7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdEaXInLCBsYXN0RGlyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBwcmVmYWJJdGVtLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgICAgaXRlbS5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgICAgICAgY29uc3QgYSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLnNpdGVtYXAtaXRlbScpIGFzIEhUTUxBbmNob3JFbGVtZW50O1xuXG4gICAgICAgIGNvbnN0IHRlbXBUZXh0Q29udCA9IChwYWdlLmZvcm1hdHRlZF90aXRsZSA/PyBwYWdlLnRpdGxlID8/IHBhZ2UubmFtZSkudHJpbSgpO1xuICAgICAgICBpZiAodGVtcFRleHRDb250IGluIG9iai50cmFuc2xhdGlvbikgYS50ZXh0Q29udGVudCA9IG9iai50cmFuc2xhdGlvblt0ZW1wVGV4dENvbnRdITtcbiAgICAgICAgZWxzZSBhLnRleHRDb250ZW50ID0gdGVtcFRleHRDb250O1xuXG4gICAgICAgIGEuc2V0QXR0cmlidXRlKCdocmVmJywgcGFnZS51cmwpO1xuXG5cbiAgICAgICAgY29uc29sZS5kZWJ1ZygnRGlyZWN0b3J5IHRvIGFwcGVuZCB3aXRoaW46JywgbGFzdERpcik7XG4gICAgICAgIGNvbnN0IGFwcGVuZFBvaW50ID0gbGFzdERpci5xdWVyeVNlbGVjdG9yKCc6c2NvcGUgPiAuanMtYmNkLWRldGFpbHNfID4gLnNpdGVtYXAtZGlyLWl0ZW1zJykgPz8gbGFzdERpcjtcblxuICAgICAgICBjb25zb2xlLmRlYnVnKCdBZGRpbmcgaXRlbScsIGl0ZW0sICd0bycsIGxhc3REaXIpO1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdBcHBlbmRpbmcgdG8uLi4nLCBhcHBlbmRQb2ludCk7XG5cbiAgICAgICAgYXBwZW5kUG9pbnQuYXBwZW5kQ2hpbGQoaXRlbSk7XG5cbiAgICAgICAgbGFzdERpciA9IG51bGw7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PScpO1xuICAgIH1cblxuICAgIGNvbnN0IHRlbXBEZXRhaWxzID0gc2l0ZW1hcENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKGAuJHtjc3NEZXRhaWxzX31gKTtcbiAgICB0ZW1wRGV0YWlscy5mb3JFYWNoKGQgPT4ge1xuICAgICAgICBkLmNsYXNzTGlzdC5yZW1vdmUoJ2pzLWJjZC1kZXRhaWxzXycpO1xuICAgICAgICBkPy5jbGFzc0xpc3QuYWRkKCdqcy1iY2QtZGV0YWlscycpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdGVtcFN1bW1hcmllcyA9IHNpdGVtYXBDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChgLiR7Y3NzU3VtbWFyeV99YCk7XG4gICAgdGVtcFN1bW1hcmllcy5mb3JFYWNoKHMgPT4ge1xuICAgICAgICBzLmNsYXNzTGlzdC5yZW1vdmUoY3NzU3VtbWFyeV8pO1xuICAgICAgICBzLmNsYXNzTGlzdC5hZGQoJ2pzLWJjZC1zdW1tYXJ5Jyk7XG4gICAgfSk7XG5cbiAgICBzZXRUaW1lb3V0KChjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50cyBhcyBGdW5jdGlvbikuYmluZCh1bmRlZmluZWQsIGVsZW1lbnRzVG9VcGdyYWRlKSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRPckNyZWF0ZURpcihkaXI6c3RyaW5nLCBlbnRyeVBvaW50OkVsZW1lbnQpOkhUTUxEaXZFbGVtZW50e1xuICAgIGNvbnNvbGUuZGVidWcoJ0xvb2tpbmcgZm9yIGRpcicsIGRpcik7XG5cbiAgICBjb25zdCBleGlzdGluZ0RpciA9IGVudHJ5UG9pbnQucXVlcnlTZWxlY3RvcihlbnRyeVBvaW50LmlkID09PSAnc2l0ZW1hcCcgP1xuICAgICAgICAgICAgICBgOnNjb3BlICAgICAgICAgICAgICAgICAgICA+IC5zaXRlbWFwLWRpciA+IC5qcy1iY2Qtc3VtbWFyeV8gPiAuc2l0ZW1hcC1kaXItbmFtZVtkYXRhLWRpcj1cIiR7ZGlyfVwiXWBcbiAgICAgICAgICAgIDogYDpzY29wZSA+IC5qcy1iY2QtZGV0YWlsc18gPiAuc2l0ZW1hcC1kaXIgPiAuanMtYmNkLXN1bW1hcnlfID4gLnNpdGVtYXAtZGlyLW5hbWVbZGF0YS1kaXI9XCIke2Rpcn1cIl1gXG4gICAgKT8ucGFyZW50RWxlbWVudCEucGFyZW50RWxlbWVudCBhcyBIVE1MRGl2RWxlbWVudDtcblxuXG4gICAgY29uc29sZS5kZWJ1ZygnRXhpc3RpbmcgZGlyOicsIGV4aXN0aW5nRGlyKTtcbiAgICBpZiAoZXhpc3RpbmdEaXIpIHJldHVybiBleGlzdGluZ0RpcjtcblxuICAgIGNvbnNvbGUuZGVidWcoJ0NyZWF0aW5nIG5ldyBkaXI6JywgZGlyKTtcblxuICAgIGNvbnN0IG5ld0RpciA9IHByZWZhYkRpci5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgbmV3RGlyLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcblxuICAgIGNvbnN0IHRoaXNTdW1tYXJ5ID0gbmV3RGlyLnF1ZXJ5U2VsZWN0b3IoJzpzY29wZSA+IC5qcy1iY2Qtc3VtbWFyeV8nKSE7XG5cbiAgICBsZXQgdGVtcFRleHRDb250ID0gZGlyLnRyaW0oKTtcbiAgICBpZiAodGVtcFRleHRDb250IGluIG9iai50cmFuc2xhdGlvbikgdGVtcFRleHRDb250ID0gb2JqLnRyYW5zbGF0aW9uW3RlbXBUZXh0Q29udF0hO1xuXG4gICAgY29uc3QgdGhpc05hbWUgPSB0aGlzU3VtbWFyeS5xdWVyeVNlbGVjdG9yKCc6c2NvcGUgPiAuc2l0ZW1hcC1kaXItbmFtZScpIGFzIEhUTUxIZWFkaW5nRWxlbWVudDtcbiAgICB0aGlzTmFtZS50ZXh0Q29udGVudCA9IHRlbXBUZXh0Q29udDtcbiAgICB0aGlzTmFtZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZGlyJywgZGlyKTtcblxuICAgIGNvbnN0IGFwcGVuZFBvaW50ID0gZW50cnlQb2ludC5xdWVyeVNlbGVjdG9yKCc6c2NvcGUgPiAuanMtYmNkLWRldGFpbHNfJykgPz8gZW50cnlQb2ludDtcblxuICAgIGNvbnN0IGV4aXN0aW5nSXRlbXMgPSBhcHBlbmRQb2ludC5xdWVyeVNlbGVjdG9yKCc6c2NvcGUgPiAuc2l0ZW1hcC1kaXItaXRlbXMnKTtcbiAgICBpZiAoZXhpc3RpbmdJdGVtcykgIGFwcGVuZFBvaW50Lmluc2VydEJlZm9yZShuZXdEaXIsIGV4aXN0aW5nSXRlbXMpO1xuICAgIGVsc2UgICAgICAgICAgICAgICAgYXBwZW5kUG9pbnQuYXBwZW5kQ2hpbGQobmV3RGlyKTtcblxuICAgIGVsZW1lbnRzVG9VcGdyYWRlLnB1c2goLi4ubmV3RGlyLmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8SFRNTEVsZW1lbnQ+KTtcblxuICAgIHJldHVybiBuZXdEaXI7XG59XG4iXX0=