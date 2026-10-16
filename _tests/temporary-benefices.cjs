// Browser regression checks against a built, locally served Jekyll site.
// Requires Playwright. Set SITE_URL and optionally BASELINE_URL for comparison
// with an unmodified build. CHROMIUM_EXECUTABLE_PATH can select installed Chrome.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const records = JSON.parse(fs.readFileSync(path.join(__dirname,
    '../_includes/metadata/temporary-benefices.json'), 'utf8'));
const url = process.env.SITE_URL || 'http://127.0.0.1:4000/';
const deadline = '2026-10-26T00:00:00Z';
const before = '2026-10-25T23:50:00Z';
let passed = 0;
function check(name, actual, expected) {
    assert.deepEqual(actual, expected, name);
    console.log(`PASS ${++passed}: ${name}`);
}

(async () => {
    const browser = await chromium.launch({ headless: true,
        ...(process.env.CHROMIUM_EXECUTABLE_PATH ?
            { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH } : {}) });
    const errors = [];
    async function open(site, time = before) {
        const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
        page.on('pageerror', e => errors.push(e.message));
        await page.clock.install({ time: new Date(time) });
        await page.clock.pauseAt(new Date(time));
        await page.goto(site, { waitUntil: 'networkidle' });
        await page.waitForFunction(() => typeof markers !== 'undefined' && markers.length > 0);
        return page;
    }
    try {
        const page = await open(url);
        const inventory = await page.evaluate(() => markers.filter(m => m.recordType === 'Benefice')
            .map(m => ({ id: m.beneficeID, location: m.locationid, key: m.eventid,
                record: m.sourceRecord, popup: m.marker.getPopup().getContent(),
                coords: m.marker.getLatLng(), style: Object.fromEntries(
                    ['radius', 'fillColor', 'color', 'weight', 'opacity', 'fillOpacity']
                        .map(k => [k, m.marker.options[k]])) })));
        check('13 unchanged Sheet records', [...new Set(inventory.map(m => m.id))].length, 13);
        check('26 unique location markers', inventory.length, 26);
        check('unique sidebar keys', new Set(inventory.map(m => m.key)).size, 26);
        const expected = records.flatMap(r => r['Location ID (LOC)'].split(';')
            .map(id => `${r.ID}@${id.trim()}`)).sort();
        check('every semicolon-separated location is represented', inventory.map(m => m.key).sort(), expected);
        for (const record of records) {
            for (const marker of inventory.filter(m => m.id === record.ID)) {
                assert.deepEqual(marker.record, record);
                assert.deepEqual(marker.style, { radius: 5, fillColor: '#e15759',
                    color: '#000000', weight: 1, opacity: 1, fillOpacity: 0.8 });
            }
        }
        check('all original metadata and fixed marker styles', true, true);
        check('all popup values survive HTML escaping', await page.evaluate(() => {
            return markers.filter(m => m.recordType === 'Benefice').every(m => {
                const div = document.createElement('div'); div.innerHTML = m.marker.getPopup().getContent();
                return Object.values(m.sourceRecord).filter(Boolean).every(v => div.textContent.includes(v));
            });
        }), true);
        check('bibliography references and pages resolved in popups', await page.evaluate(() => markers
            .filter(m => m.recordType === 'Benefice').every(m => {
                const div = document.createElement('div'); div.innerHTML = m.marker.getPopup().getContent();
                return m.sourceRecord['Bibliography ID (BIB)'].split(';').every(id => {
                    const bib = findInfo(id.trim(), 'Bibliography');
                    return bib && Object.values(bib).filter(Boolean).every(v => div.textContent.includes(v));
                });
            })), true);
        check('coordinates match original Locations', await page.evaluate(() => markers
            .filter(m => m.recordType === 'Benefice').every(m => {
                const [lat, lng] = findInfo(m.locationid, 'Locations').Coordinates.split(',').map(Number);
                return m.marker.getLatLng().lat === lat && m.marker.getLatLng().lng === lng;
            })), true);
        await page.evaluate(() => {
            document.querySelector('#input').value = 'Josquin';
            map.setView([47, 5], 5); filterAndSearchMarkers();
        });
        async function visibleBenefices() {
            return page.evaluate(() => markers.filter(m => m.recordType === 'Benefice' &&
                markerCluster.hasLayer(m.marker)).map(m => m.eventid).sort());
        }
        const josquin = await visibleBenefices();
        check('Josquin search includes Angers and Lamotte',
            ['BE:00005@LOC:Angers', 'BE:00004@LOC:Lamotte'].every(id => josquin.includes(id)), true);
        for (const name of ['Angers', 'Lamotte']) {
            await page.evaluate(name => { document.querySelector('#input').value = name;
                filterAndSearchMarkers(); showAutocompleteSuggestions(); }, name);
            check(`${name} search finds its benefice`, (await visibleBenefices()).some(id => id.endsWith(`LOC:${name}`)), true);
            check(`${name} appears in location suggestions`, await page.locator('#autocomplete-results').innerText()
                .then(text => text.includes(name)), true);
        }
        await page.evaluate(() => {
            document.querySelector('#input').value = '';
            selectPersonByName('Josquin des Prez'); filterAndSearchMarkers();
        });
        check('selected Josquin includes related-person records',
            (await visibleBenefices()).filter(id => id.startsWith('BE:00003@')).length, 2);
        check('person highlighting retains red fill and black border', await page.evaluate(() => markers
            .filter(m => m.recordType === 'Benefice').every(m => m.marker.options.fillColor === '#e15759' &&
                m.marker.options.color === '#000000' && m.marker.options.fillOpacity === .8)), true);
        check('sidebar has all 26 individual benefice rows', await page.locator('tr[id^="marker-BE_"]').count(), 26);
        for (const id of ['BE:00004@LOC:Lamotte', 'BE:00004@LOC:Puy-Sainte-Reparade']) {
            await page.evaluate(id => {
                document.getElementById(`marker-${sanitizeEventId(id)}`).click();
            }, id);
            check(`sidebar click opens exact location ${id}`, await page.evaluate(id =>
                markers.find(m => m.eventid === id).marker.isPopupOpen(), id), true);
        }
        for (const location of ['Angers', 'Lamotte']) {
            await page.evaluate(location => { map.closePopup(); selectLocationByName(location); }, location);
            check(`selected Josquin with selected ${location}`, (await visibleBenefices()).length, 1);
        }
        await page.evaluate(() => { removeSelectedLocation(); });
        await page.evaluate(() => { map.closePopup(); currentDateRange = [1476, 1476]; filterAndSearchMarkers(); });
        check('date filtering retains overlapping ranges', (await visibleBenefices()).some(id => id.startsWith('BE:00004@')), true);
        check('date filtering removes later records', (await visibleBenefices()).some(id => id.startsWith('BE:00012@')), false);
        await page.evaluate(() => { currentDateRange = [1500, 1500]; filterAndSearchMarkers(); });
        check('nonoverlapping dates hide all benefices', await visibleBenefices(), []);
        await page.evaluate(() => {
            currentDateRange = [1300, 1600]; filterAndSearchMarkers();
            document.querySelector('#certainty-select').checked = true; filterAndSearchMarkers();
        });
        check('certainty filter excludes uncertain Angers', (await visibleBenefices()).includes('BE:00005@LOC:Angers'), false);
        await page.evaluate(() => {
            document.querySelector('#certainty-select').checked = false;
            document.querySelector('#composer-select').checked = false; filterAndSearchMarkers();
        });
        check('person-type checkbox hides selected composer', await visibleBenefices(), []);
        await page.evaluate(() => {
            document.querySelector('#composer-select').checked = true;
            institutionFilter = 'INS:Chapel_Rene_Anjou'; filterAndSearchMarkers();
        });
        check('institution filter retains only linked benefices', (await visibleBenefices())
            .every(id => /^BE:0000[34]@/.test(id)), true);
        await page.evaluate(() => { institutionFilter = ''; filterAndSearchMarkers(); });
        check('benefices join real Leaflet marker clusters', await page.evaluate(() => markers
            .filter(m => m.recordType === 'Benefice').every(m => markerCluster.hasLayer(m.marker))), true);
        const baseline = process.env.BASELINE_URL && await open(process.env.BASELINE_URL);
        if (baseline) {
            const comparison = await open(url);
            async function eventSnapshot(target) {
                return target.evaluate(() => markers.filter(m => m.recordType !== 'Benefice').map(m => ({
                    id: m.eventid, person: m.personID, location: m.locationid,
                    coords: m.marker.getLatLng(), popup: m.marker.getPopup().getContent()
                })));
            }
            check('Event markers and popups match repository HEAD', await eventSnapshot(comparison), await eventSnapshot(baseline));
            async function eventResults(target, query, dates) {
                await target.evaluate(({ query, dates }) => {
                    map.closePopup();
                    selectedNames.clear(); document.querySelectorAll('.selected-item').forEach(e => e.remove());
                    for (const id of ['composer-active', 'musician-active', 'non-musician-active']) {
                        document.getElementById(id).innerHTML = '';
                    }
                    document.querySelector('#input').value = query;
                    currentDateRange = dates; map.setView([47, 5], 5, { animate: false }); filterAndSearchMarkers();
                }, { query, dates });
                await target.clock.runFor(1000);
                return target.evaluate(() => markers.filter(m => m.recordType !== 'Benefice' && markerCluster.hasLayer(m.marker))
                        .map(m => m.eventid).sort());
            }
            for (const [query, dates] of [['', [1300, 1600]], ['Josquin', [1300, 1600]],
                ['Angers', [1300, 1600]], ['Lamotte', [1300, 1600]], ['', [1475, 1480]]]) {
                check(`existing Event results: ${query || 'all'} ${dates}`, await eventResults(comparison, query, dates),
                    await eventResults(baseline, query, dates));
            }
            await comparison.close();
            await baseline.close();
        }
        await page.evaluate(() => { currentDateRange = [1300, 1600]; filterAndSearchMarkers();
            const entry = markers.find(m => m.beneficeID === 'BE:00005'); entry.marker.openPopup();
            window.expiryMarkers = markers.filter(m => m.recordType === 'Benefice').map(m => m.marker);
        });
        await page.clock.fastForward(Date.parse(deadline) - await page.evaluate(() => Date.now()));
        check('deadline removes markers, clusters, popups and sidebar rows', await page.evaluate(() => ({
            entries: markers.filter(m => m.recordType === 'Benefice').length,
            layers: window.expiryMarkers.filter(m => map.hasLayer(m) || markerCluster.hasLayer(m)).length,
            popups: window.expiryMarkers.filter(m => m.isPopupOpen()).length,
            rows: document.querySelectorAll('tr[id^="marker-BE_"]').length
        })), { entries: 0, layers: 0, popups: 0, rows: 0 });
        await page.evaluate(() => filterAndSearchMarkers());
        check('expired markers cannot be reintroduced by filtering', await visibleBenefices(), []);
        const after = await open(url, deadline);
        check('new visitors at the deadline get no benefices', await after.evaluate(() =>
            markers.filter(m => m.recordType === 'Benefice').length), 0);
        await after.close();
        for (const event of ['focus', 'pageshow', 'visibilitychange']) {
            const resumed = await open(url);
            await resumed.clock.setSystemTime(new Date(deadline));
            await resumed.evaluate(event => (event === 'visibilitychange' ? document : window)
                .dispatchEvent(new Event(event)), event);
            check(`resumed-tab cleanup: ${event}`, await resumed.evaluate(() =>
                markers.filter(m => m.recordType === 'Benefice').length), 0);
            await resumed.close();
        }
        check('no browser JavaScript errors', errors, []);
        console.log(`${passed} checks passed`);
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
