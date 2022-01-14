'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require("jest-extended");
const fs = require("fs");
const p = require("path");
const GetPaths_1 = require("../lib/GetPaths");
const GetPathsMixin_1 = require("../lib/GetPathsMixin");
describe('Get-Object-Paths Tests', function () {
    let acmeInc = {};
    let rawFileContent;
    beforeAll(() => {
        rawFileContent = fs.readFileSync(p.resolve(__dirname, 'acmeInc.json'), 'utf-8');
        acmeInc = JSON.parse(rawFileContent);
    });
    test('getPaths: empty object should return undefined', async () => {
        const path = (0, GetPaths_1.getPaths)({}, { key: 'test' });
        expect(path).toBeUndefined();
    });
    test('getPaths: on a buffer should return undefined but not produce an error', async () => {
        const path = (0, GetPaths_1.getPaths)(rawFileContent, { key: 'test' });
        expect(path).toBeUndefined();
    });
    test('getPaths: path to a single known key', async () => {
        const path = (0, GetPaths_1.getPaths)(acmeInc, { key: 'numberOfActors' });
        expect(path).toEqual('company.numberOfActors');
    });
    test('getPaths: all paths to a key', async () => {
        const allPaths = (0, GetPaths_1.getPaths)(acmeInc, { key: 'actorId' });
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });
    test('getPaths: path to a single known value', async () => {
        let path = (0, GetPaths_1.getPaths)(acmeInc, { value: 'Bugs Bunny' });
        expect(path).toEqual('actors[0].name');
        path = (0, GetPaths_1.getPaths)(acmeInc, { value: 'DVD' });
        expect(path).toEqual('distributionChannels[1][2]');
        path = (0, GetPaths_1.getPaths)(acmeInc, { value: 12 });
        expect(path).toEqual('distributionChannels[2][1]');
        const paths = (0, GetPaths_1.getPaths)(acmeInc, { value: true });
        expect(paths.slice(-1)[0]).toEqual('distributionChannels[2][2]');
    });
    test('getPaths: path by key/value for string|boolean|number-values', async () => {
        const ceoPath = (0, GetPaths_1.getPaths)(acmeInc, { key: 'isCEO', value: true });
        expect(ceoPath).toEqual('employees[0].isCEO');
        const assistantPath = (0, GetPaths_1.getPaths)(acmeInc, { key: 'isCEO', value: false });
        expect(assistantPath).toEqual('employees[1].isCEO');
        let path = (0, GetPaths_1.getPaths)(acmeInc, { key: 'name', value: 'Hugo Boss' });
        expect(path).toEqual('employees[0].name');
        path = (0, GetPaths_1.getPaths)(acmeInc, { key: 'employeeNumber', value: 1 });
        expect(path).toEqual('employees[0].employeeNumber');
        path = (0, GetPaths_1.getPaths)(acmeInc, { key: 'name', value: 'Herbert Assistant' });
        expect(path).toEqual('employees[1].name');
        path = (0, GetPaths_1.getPaths)(acmeInc, { key: 'isCEO', value: false });
        expect(path).toEqual('employees[1].isCEO');
        path = (0, GetPaths_1.getPaths)(acmeInc, { key: 'employeeNumber', value: 2 });
        expect(path).toEqual('employees[1].employeeNumber');
    });
    test('getPaths: multiple paths by key/value for string|boolean|number-values', async () => {
        let allPaths = (0, GetPaths_1.getPaths)(acmeInc, { key: 'movie', value: 'Who Framed Roger Rabbit' });
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[0].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[0].movie');
        allPaths = (0, GetPaths_1.getPaths)(acmeInc, { key: 'retired', value: true });
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[1].retired');
        expect(allPaths[1]).toEqual('actors[2].retired');
        allPaths = (0, GetPaths_1.getPaths)(acmeInc, { key: 'started', value: 1996 });
        expect(allPaths.length).toEqual(3);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].started');
        expect(allPaths[1]).toEqual('actors[2].playedIn[0].started');
        expect(allPaths[2]).toEqual('actors[3].playedIn[1].started');
    });
    test('getPathsByKey: path to a single known key', async () => {
        const path = (0, GetPaths_1.getPathsByKey)(acmeInc, 'numberOfActors');
        expect(path).toEqual('company.numberOfActors');
    });
    test('getPathsByKey: all paths to a key', async () => {
        const allPaths = (0, GetPaths_1.getPathsByKey)(acmeInc, 'actorId');
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });
    test('getPathsByValue: path to a single known value', async () => {
        let path = (0, GetPaths_1.getPathsByValue)(acmeInc, 'Bugs Bunny');
        expect(path).toEqual('actors[0].name');
        path = (0, GetPaths_1.getPathsByValue)(acmeInc, 'DVD');
        expect(path).toEqual('distributionChannels[1][2]');
        path = (0, GetPaths_1.getPathsByValue)(acmeInc, 12);
        expect(path).toEqual('distributionChannels[2][1]');
        const paths = (0, GetPaths_1.getPathsByValue)(acmeInc, true);
        expect(paths.slice(-1)[0]).toEqual('distributionChannels[2][2]');
    });
    test('getPathsByValue: all paths to a specific value', async () => {
        const allPaths = (0, GetPaths_1.getPathsByValue)(acmeInc, 'Space Jam');
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[1].movie');
    });
    test('getPathsByKeyValue: path by key/value for string|boolean|number-values', async () => {
        const ceoPath = (0, GetPaths_1.getPathsByKeyValue)(acmeInc, 'isCEO', true);
        expect(ceoPath).toEqual('employees[0].isCEO');
        const assistantPath = (0, GetPaths_1.getPathsByKeyValue)(acmeInc, 'isCEO', false);
        expect(assistantPath).toEqual('employees[1].isCEO');
        let path = (0, GetPaths_1.getPathsByKeyValue)(acmeInc, 'name', 'Hugo Boss');
        expect(path).toEqual('employees[0].name');
        path = (0, GetPaths_1.getPathsByKeyValue)(acmeInc, 'employeeNumber', 1);
        expect(path).toEqual('employees[0].employeeNumber');
        path = (0, GetPaths_1.getPathsByKeyValue)(acmeInc, 'name', 'Herbert Assistant');
        expect(path).toEqual('employees[1].name');
        path = (0, GetPaths_1.getPathsByKeyValue)(acmeInc, 'isCEO', false);
        expect(path).toEqual('employees[1].isCEO');
        path = (0, GetPaths_1.getPathsByKeyValue)(acmeInc, 'employeeNumber', 2);
        expect(path).toEqual('employees[1].employeeNumber');
    });
    test('getPathsByKeyValue: multiple paths by key/value for string|boolean|number-values', async () => {
        let allPaths = (0, GetPaths_1.getPathsByKeyValue)(acmeInc, 'movie', 'Who Framed Roger Rabbit');
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[0].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[0].movie');
        allPaths = (0, GetPaths_1.getPathsByKeyValue)(acmeInc, 'retired', true);
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[1].retired');
        expect(allPaths[1]).toEqual('actors[2].retired');
        allPaths = (0, GetPaths_1.getPathsByKeyValue)(acmeInc, 'started', 1996);
        expect(allPaths.length).toEqual(3);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].started');
        expect(allPaths[1]).toEqual('actors[2].playedIn[0].started');
        expect(allPaths[2]).toEqual('actors[3].playedIn[1].started');
    });
    test('_.getPaths: path to a single known key', async () => {
        const path = GetPathsMixin_1.default.getPaths(acmeInc, { key: 'numberOfActors' });
        expect(path).toEqual('company.numberOfActors');
    });
    test('_.getPaths: all paths to a key', async () => {
        const allPaths = GetPathsMixin_1.default.getPaths(acmeInc, { key: 'actorId' });
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });
    test('_.getPaths: path to a single known value', async () => {
        let path = GetPathsMixin_1.default.getPaths(acmeInc, { value: 'Bugs Bunny' });
        expect(path).toEqual('actors[0].name');
        path = GetPathsMixin_1.default.getPaths(acmeInc, { value: 'DVD' });
        expect(path).toEqual('distributionChannels[1][2]');
        path = GetPathsMixin_1.default.getPaths(acmeInc, { value: 12 });
        expect(path).toEqual('distributionChannels[2][1]');
        const paths = GetPathsMixin_1.default.getPaths(acmeInc, { value: true });
        expect(paths.slice(-1)[0]).toEqual('distributionChannels[2][2]');
    });
    test('_.getPaths: all paths to a specific value', async () => {
        const allPaths = GetPathsMixin_1.default.getPaths(acmeInc, { value: 'Space Jam' });
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[1].movie');
    });
    test('_.getPaths: path by key/value for string|boolean|number-values', async () => {
        const ceoPath = GetPathsMixin_1.default.getPaths(acmeInc, { key: 'isCEO', value: true });
        expect(ceoPath).toEqual('employees[0].isCEO');
        const assistantPath = GetPathsMixin_1.default.getPaths(acmeInc, { key: 'isCEO', value: false });
        expect(assistantPath).toEqual('employees[1].isCEO');
        let path = GetPathsMixin_1.default.getPaths(acmeInc, { key: 'name', value: 'Hugo Boss' });
        expect(path).toEqual('employees[0].name');
        path = GetPathsMixin_1.default.getPaths(acmeInc, { key: 'employeeNumber', value: 1 });
        expect(path).toEqual('employees[0].employeeNumber');
        path = GetPathsMixin_1.default.getPaths(acmeInc, { key: 'name', value: 'Herbert Assistant' });
        expect(path).toEqual('employees[1].name');
        path = GetPathsMixin_1.default.getPaths(acmeInc, { key: 'isCEO', value: false });
        expect(path).toEqual('employees[1].isCEO');
        path = GetPathsMixin_1.default.getPaths(acmeInc, { key: 'employeeNumber', value: 2 });
        expect(path).toEqual('employees[1].employeeNumber');
    });
    test('_.getPaths: multiple paths by key/value for string|boolean|number-values', async () => {
        let allPaths = GetPathsMixin_1.default.getPaths(acmeInc, { key: 'movie', value: 'Who Framed Roger Rabbit' });
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[0].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[0].movie');
        allPaths = GetPathsMixin_1.default.getPaths(acmeInc, { key: 'retired', value: true });
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[1].retired');
        expect(allPaths[1]).toEqual('actors[2].retired');
        allPaths = GetPathsMixin_1.default.getPaths(acmeInc, { key: 'started', value: 1996 });
        expect(allPaths.length).toEqual(3);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].started');
        expect(allPaths[1]).toEqual('actors[2].playedIn[0].started');
        expect(allPaths[2]).toEqual('actors[3].playedIn[1].started');
    });
});
//# sourceMappingURL=tests-getPaths.js.map