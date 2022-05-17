'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require("jest-extended");
const fs = require("fs");
const p = require("path");
const FindObjectPaths_1 = require("../lib/FindObjectPaths");
const FindObjectPathsMixin_1 = require("../lib/FindObjectPathsMixin");
describe('Find-Object-Paths Tests', function () {
    let acmeInc = {};
    let rawFileContent;
    beforeAll(() => {
        rawFileContent = fs.readFileSync(p.resolve(__dirname, 'acmeInc.json'), 'utf-8');
        acmeInc = JSON.parse(rawFileContent);
    });
    test('findObjectPaths: has', async () => {
        expect((0, FindObjectPaths_1.has)(acmeInc.employees, { key: 'name' })).toBeTruthy();
        expect((0, FindObjectPaths_1.has)(acmeInc.employees, { key: 'foo' })).toBeFalsy();
        expect((0, FindObjectPaths_1.has)(acmeInc.employees, { key: 'name', value: 'Hugo Boss' })).toBeTruthy();
        expect((0, FindObjectPaths_1.has)(acmeInc.employees, { value: 'Hugo Boss' })).toBeTruthy();
        expect((0, FindObjectPaths_1.has)(acmeInc.employees, { value: 'William Shakespeare' })).toBeFalsy();
        expect((0, FindObjectPaths_1.has)(acmeInc.employees, 'name')).toBeTruthy();
        expect((0, FindObjectPaths_1.has)(acmeInc.employees, 'foo')).toBeFalsy();
        expect((0, FindObjectPaths_1.has)(acmeInc.employees, 'name', 'Hugo Boss')).toBeTruthy();
        expect((0, FindObjectPaths_1.has)(acmeInc.employees, 'name', 'William Shakespeare')).toBeFalsy();
        expect((0, FindObjectPaths_1.has)(acmeInc.employees, 'foo', 'bar')).toBeFalsy();
    });
    test('findObjectPaths: empty object should return undefined', async () => {
        const path = (0, FindObjectPaths_1.findObjectPaths)({}, { key: 'test' });
        expect(path).toBeUndefined();
    });
    test('findObjectPaths: on a buffer should return undefined but not produce an error', async () => {
        const path = (0, FindObjectPaths_1.findObjectPaths)(rawFileContent, { key: 'test' });
        expect(path).toBeUndefined();
    });
    test('findObjectPaths: path to a single known key', async () => {
        const path = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { key: 'numberOfActors' });
        expect(path).toEqual('company.numberOfActors');
    });
    test('findObjectPaths: all paths to a key', async () => {
        const allPaths = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { key: 'actorId' });
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });
    test('findObjectPaths: path to a single known value', async () => {
        let path = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { value: 'Bugs Bunny' });
        expect(path).toEqual('actors[0].name');
        path = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { value: 'DVD' });
        expect(path).toEqual('distributionChannels[1][2]');
        path = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { value: 12 });
        expect(path).toEqual('distributionChannels[2][1]');
        const paths = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { value: true });
        expect(paths.slice(-1)[0]).toEqual('distributionChannels[2][2]');
    });
    test('findObjectPaths: path by key/value for string|boolean|number-values', async () => {
        const ceoPath = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { key: 'isCEO', value: true });
        expect(ceoPath).toEqual('employees[0].isCEO');
        const assistantPath = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { key: 'isCEO', value: false });
        expect(assistantPath).toEqual('employees[1].isCEO');
        let path = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { key: 'name', value: 'Hugo Boss' });
        expect(path).toEqual('employees[0].name');
        path = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { key: 'employeeNumber', value: 1 });
        expect(path).toEqual('employees[0].employeeNumber');
        path = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { key: 'name', value: 'Herbert Assistant' });
        expect(path).toEqual('employees[1].name');
        path = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { key: 'isCEO', value: false });
        expect(path).toEqual('employees[1].isCEO');
        path = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { key: 'employeeNumber', value: 2 });
        expect(path).toEqual('employees[1].employeeNumber');
    });
    test('findObjectPaths: multiple paths by key/value for string|boolean|number-values', async () => {
        let allPaths = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { key: 'movie', value: 'Who Framed Roger Rabbit' });
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[0].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[0].movie');
        allPaths = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { key: 'retired', value: true });
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[1].retired');
        expect(allPaths[1]).toEqual('actors[2].retired');
        allPaths = (0, FindObjectPaths_1.findObjectPaths)(acmeInc, { key: 'started', value: 1996 });
        expect(allPaths.length).toEqual(3);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].started');
        expect(allPaths[1]).toEqual('actors[2].playedIn[0].started');
        expect(allPaths[2]).toEqual('actors[3].playedIn[1].started');
    });
    test('findObjectPathsByKey: path to a single known key', async () => {
        const path = (0, FindObjectPaths_1.findObjectPathsByKey)(acmeInc, 'numberOfActors');
        expect(path).toEqual('company.numberOfActors');
    });
    test('findObjectPathsByKey: all paths to a key', async () => {
        const allPaths = (0, FindObjectPaths_1.findObjectPathsByKey)(acmeInc, 'actorId');
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });
    test('findObjectPathsByValue: path to a single known value', async () => {
        let path = (0, FindObjectPaths_1.findObjectPathsByValue)(acmeInc, 'Bugs Bunny');
        expect(path).toEqual('actors[0].name');
        path = (0, FindObjectPaths_1.findObjectPathsByValue)(acmeInc, 'DVD');
        expect(path).toEqual('distributionChannels[1][2]');
        path = (0, FindObjectPaths_1.findObjectPathsByValue)(acmeInc, 12);
        expect(path).toEqual('distributionChannels[2][1]');
        const paths = (0, FindObjectPaths_1.findObjectPathsByValue)(acmeInc, true);
        expect(paths.slice(-1)[0]).toEqual('distributionChannels[2][2]');
    });
    test('findObjectPathsByValue: all paths to a specific value', async () => {
        const allPaths = (0, FindObjectPaths_1.findObjectPathsByValue)(acmeInc, 'Space Jam');
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[1].movie');
    });
    test('findObjectPathsByKeyValue: path by key/value for string|boolean|number-values', async () => {
        const ceoPath = (0, FindObjectPaths_1.findObjectPathsByKeyValue)(acmeInc, 'isCEO', true);
        expect(ceoPath).toEqual('employees[0].isCEO');
        const assistantPath = (0, FindObjectPaths_1.findObjectPathsByKeyValue)(acmeInc, 'isCEO', false);
        expect(assistantPath).toEqual('employees[1].isCEO');
        let path = (0, FindObjectPaths_1.findObjectPathsByKeyValue)(acmeInc, 'name', 'Hugo Boss');
        expect(path).toEqual('employees[0].name');
        path = (0, FindObjectPaths_1.findObjectPathsByKeyValue)(acmeInc, 'employeeNumber', 1);
        expect(path).toEqual('employees[0].employeeNumber');
        path = (0, FindObjectPaths_1.findObjectPathsByKeyValue)(acmeInc, 'name', 'Herbert Assistant');
        expect(path).toEqual('employees[1].name');
        path = (0, FindObjectPaths_1.findObjectPathsByKeyValue)(acmeInc, 'isCEO', false);
        expect(path).toEqual('employees[1].isCEO');
        path = (0, FindObjectPaths_1.findObjectPathsByKeyValue)(acmeInc, 'employeeNumber', 2);
        expect(path).toEqual('employees[1].employeeNumber');
    });
    test('findObjectPathsByKeyValue: multiple paths by key/value for string|boolean|number-values', async () => {
        let allPaths = (0, FindObjectPaths_1.findObjectPathsByKeyValue)(acmeInc, 'movie', 'Who Framed Roger Rabbit');
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[0].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[0].movie');
        allPaths = (0, FindObjectPaths_1.findObjectPathsByKeyValue)(acmeInc, 'retired', true);
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[1].retired');
        expect(allPaths[1]).toEqual('actors[2].retired');
        allPaths = (0, FindObjectPaths_1.findObjectPathsByKeyValue)(acmeInc, 'started', 1996);
        expect(allPaths.length).toEqual(3);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].started');
        expect(allPaths[1]).toEqual('actors[2].playedIn[0].started');
        expect(allPaths[2]).toEqual('actors[3].playedIn[1].started');
    });
    test('_.findObjectPaths: path to a single known key', async () => {
        const path = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { key: 'numberOfActors' });
        expect(path).toEqual('company.numberOfActors');
    });
    test('_.findObjectPaths: all paths to a key', async () => {
        const allPaths = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { key: 'actorId' });
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });
    test('_.findObjectPaths: path to a single known value', async () => {
        let path = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { value: 'Bugs Bunny' });
        expect(path).toEqual('actors[0].name');
        path = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { value: 'DVD' });
        expect(path).toEqual('distributionChannels[1][2]');
        path = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { value: 12 });
        expect(path).toEqual('distributionChannels[2][1]');
        const paths = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { value: true });
        expect(paths.slice(-1)[0]).toEqual('distributionChannels[2][2]');
    });
    test('_.findObjectPaths: all paths to a specific value', async () => {
        const allPaths = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { value: 'Space Jam' });
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[1].movie');
    });
    test('_.findObjectPaths: path by key/value for string|boolean|number-values', async () => {
        const ceoPath = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { key: 'isCEO', value: true });
        expect(ceoPath).toEqual('employees[0].isCEO');
        const assistantPath = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { key: 'isCEO', value: false });
        expect(assistantPath).toEqual('employees[1].isCEO');
        let path = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { key: 'name', value: 'Hugo Boss' });
        expect(path).toEqual('employees[0].name');
        path = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { key: 'employeeNumber', value: 1 });
        expect(path).toEqual('employees[0].employeeNumber');
        path = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { key: 'name', value: 'Herbert Assistant' });
        expect(path).toEqual('employees[1].name');
        path = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { key: 'isCEO', value: false });
        expect(path).toEqual('employees[1].isCEO');
        path = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { key: 'employeeNumber', value: 2 });
        expect(path).toEqual('employees[1].employeeNumber');
    });
    test('_.findObjectPaths: multiple paths by key/value for string|boolean|number-values', async () => {
        let allPaths = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, {
            key: 'movie',
            value: 'Who Framed Roger Rabbit',
        });
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[0].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[0].movie');
        allPaths = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { key: 'retired', value: true });
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[1].retired');
        expect(allPaths[1]).toEqual('actors[2].retired');
        allPaths = FindObjectPathsMixin_1.default.findObjectPaths(acmeInc, { key: 'started', value: 1996 });
        expect(allPaths.length).toEqual(3);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].started');
        expect(allPaths[1]).toEqual('actors[2].playedIn[0].started');
        expect(allPaths[2]).toEqual('actors[3].playedIn[1].started');
    });
});
//# sourceMappingURL=tests-findObjectPaths.js.map