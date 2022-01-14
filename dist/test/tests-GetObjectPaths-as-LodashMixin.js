'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require("jest-extended");
const fs = require("fs");
const p = require("path");
const GetObjectPathMixin_1 = require("../lib/GetObjectPathMixin");
describe('Get-Object-Paths Lodash Mixin Tests', function () {
    let acmeInc = {};
    beforeAll(() => {
        acmeInc = JSON.parse(fs.readFileSync(p.resolve(__dirname, 'acmeInc.json'), 'utf-8'));
    });
    test('Get path to a single known key', async () => {
        const path = GetObjectPathMixin_1.default.getPaths(acmeInc, { key: 'numberOfActors' });
        expect(path).toEqual('company.numberOfActors');
    });
    test('Get all paths to a key', async () => {
        const allPaths = GetObjectPathMixin_1.default.getPaths(acmeInc, { key: 'actorId' });
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });
    test('Get path to a single known value', async () => {
        const path = GetObjectPathMixin_1.default.getPaths(acmeInc, { value: 'Bugs Bunny' });
        expect(path).toEqual('actors[0].name');
    });
    test('Get all paths to a specific value', async () => {
        const allPaths = GetObjectPathMixin_1.default.getPaths(acmeInc, { value: 'Space Jam' });
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[1].movie');
    });
    test('Get path by key/value for string|boolean|number-values', async () => {
        const ceoPath = GetObjectPathMixin_1.default.getPaths(acmeInc, { key: 'isCEO', value: true });
        expect(ceoPath).toEqual('employees[0].isCEO');
        const assistantPath = GetObjectPathMixin_1.default.getPaths(acmeInc, { key: 'isCEO', value: false });
        expect(assistantPath).toEqual('employees[1].isCEO');
        let path = GetObjectPathMixin_1.default.getPaths(acmeInc, { key: 'name', value: 'Hugo Boss' });
        expect(path).toEqual('employees[0].name');
        path = GetObjectPathMixin_1.default.getPaths(acmeInc, { key: 'employeeNumber', value: 1 });
        expect(path).toEqual('employees[0].employeeNumber');
        path = GetObjectPathMixin_1.default.getPaths(acmeInc, { key: 'name', value: 'Herbert Assistant' });
        expect(path).toEqual('employees[1].name');
        path = GetObjectPathMixin_1.default.getPaths(acmeInc, { key: 'isCEO', value: false });
        expect(path).toEqual('employees[1].isCEO');
        path = GetObjectPathMixin_1.default.getPaths(acmeInc, { key: 'employeeNumber', value: 2 });
        expect(path).toEqual('employees[1].employeeNumber');
    });
    test('Get multiple paths by key/value for string|boolean|number-values', async () => {
        let allPaths = GetObjectPathMixin_1.default.getPaths(acmeInc, { key: 'movie', value: 'Who Framed Roger Rabbit' });
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[0].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[0].movie');
        allPaths = GetObjectPathMixin_1.default.getPaths(acmeInc, { key: 'retired', value: true });
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[1].retired');
        expect(allPaths[1]).toEqual('actors[2].retired');
        allPaths = GetObjectPathMixin_1.default.getPaths(acmeInc, { key: 'started', value: 1996 });
        expect(allPaths.length).toEqual(3);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].started');
        expect(allPaths[1]).toEqual('actors[2].playedIn[0].started');
        expect(allPaths[2]).toEqual('actors[3].playedIn[1].started');
    });
});
//# sourceMappingURL=tests-GetObjectPaths-as-LodashMixin.js.map