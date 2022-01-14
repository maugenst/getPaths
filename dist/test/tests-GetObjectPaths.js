'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require("jest-extended");
const fs = require("fs");
const p = require("path");
const GetObjectPaths_1 = require("../lib/GetObjectPaths");
describe('Get-Object-Paths Core Tests', function () {
    let acmeInc = {};
    beforeAll(() => {
        acmeInc = JSON.parse(fs.readFileSync(p.resolve(__dirname, 'acmeInc.json'), 'utf-8'));
    });
    test('Get path to a single known key', async () => {
        const path = (0, GetObjectPaths_1.getPathsByKey)(acmeInc, 'numberOfActors');
        expect(path).toEqual('company.numberOfActors');
    });
    test('Get all paths to a key', async () => {
        const allPaths = (0, GetObjectPaths_1.getPathsByKey)(acmeInc, 'actorId');
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });
    test('Get path to a single known value', async () => {
        const path = (0, GetObjectPaths_1.getPathsByValue)(acmeInc, 'Bugs Bunny');
        expect(path).toEqual('actors[0].name');
    });
    test('Get all paths to a specific value', async () => {
        const allPaths = (0, GetObjectPaths_1.getPathsByValue)(acmeInc, 'Space Jam');
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[1].movie');
    });
    test('Get path by key/value for string|boolean|number-values', async () => {
        const ceoPath = (0, GetObjectPaths_1.getPathsByKeyValue)(acmeInc, 'isCEO', true);
        expect(ceoPath).toEqual('employees[0].isCEO');
        const assistantPath = (0, GetObjectPaths_1.getPathsByKeyValue)(acmeInc, 'isCEO', false);
        expect(assistantPath).toEqual('employees[1].isCEO');
        let path = (0, GetObjectPaths_1.getPathsByKeyValue)(acmeInc, 'name', 'Hugo Boss');
        expect(path).toEqual('employees[0].name');
        path = (0, GetObjectPaths_1.getPathsByKeyValue)(acmeInc, 'employeeNumber', 1);
        expect(path).toEqual('employees[0].employeeNumber');
        path = (0, GetObjectPaths_1.getPathsByKeyValue)(acmeInc, 'name', 'Herbert Assistant');
        expect(path).toEqual('employees[1].name');
        path = (0, GetObjectPaths_1.getPathsByKeyValue)(acmeInc, 'isCEO', false);
        expect(path).toEqual('employees[1].isCEO');
        path = (0, GetObjectPaths_1.getPathsByKeyValue)(acmeInc, 'employeeNumber', 2);
        expect(path).toEqual('employees[1].employeeNumber');
    });
    test('Get multiple paths by key/value for string|boolean|number-values', async () => {
        let allPaths = (0, GetObjectPaths_1.getPathsByKeyValue)(acmeInc, 'movie', 'Who Framed Roger Rabbit');
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[0].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[0].movie');
        allPaths = (0, GetObjectPaths_1.getPathsByKeyValue)(acmeInc, 'retired', true);
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[1].retired');
        expect(allPaths[1]).toEqual('actors[2].retired');
        allPaths = (0, GetObjectPaths_1.getPathsByKeyValue)(acmeInc, 'started', 1996);
        expect(allPaths.length).toEqual(3);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].started');
        expect(allPaths[1]).toEqual('actors[2].playedIn[0].started');
        expect(allPaths[2]).toEqual('actors[3].playedIn[1].started');
    });
    test('Get path to a single known key', async () => {
        const path = (0, GetObjectPaths_1.getPaths)(acmeInc, { key: 'numberOfActors' });
        expect(path).toEqual('company.numberOfActors');
    });
    test('Get all paths to a key', async () => {
        const allPaths = (0, GetObjectPaths_1.getPaths)(acmeInc, { key: 'actorId' });
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });
    test('Get path to a single known value', async () => {
        const path = (0, GetObjectPaths_1.getPaths)(acmeInc, { value: 'Bugs Bunny' });
        expect(path).toEqual('actors[0].name');
    });
});
//# sourceMappingURL=tests-GetObjectPaths.js.map