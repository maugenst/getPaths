'use strict';
import 'jest-extended';
import * as fs from 'fs';
import * as p from 'path';
import {getPaths, getPathsByKey, getPathsByKeyValue, getPathsByValue} from '../lib/GetObjectPaths';

describe('Get-Object-Paths Core Tests', function () {
    let acmeInc = {};

    beforeAll(() => {
        acmeInc = JSON.parse(fs.readFileSync(p.resolve(__dirname, 'acmeInc.json'), 'utf-8'));
    });

    test('Get path to a single known key', async () => {
       /* const path = getPathsByKey(acmeInc, 'numberOfActors');
        expect(path).toEqual('company.numberOfActors');*/

        const distroPath = getPathsByKey(acmeInc, 'DVD');
        expect(distroPath).toEqual('distributionChannels[1][2]');
    });

    test('Get all paths to a key', async () => {
        const allPaths: string[] = getPathsByKey(acmeInc, 'actorId') as string[];
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });

    test('Get path to a single known value', async () => {
        const path = getPathsByValue(acmeInc, 'Bugs Bunny');
        expect(path).toEqual('actors[0].name');
    });

    test('Get all paths to a specific value', async () => {
        const allPaths: string[] = getPathsByValue(acmeInc, 'Space Jam') as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[1].movie');
    });

    test('Get path by key/value for string|boolean|number-values', async () => {
        const ceoPath = getPathsByKeyValue(acmeInc, 'isCEO', true);
        expect(ceoPath).toEqual('employees[0].isCEO');

        const assistantPath = getPathsByKeyValue(acmeInc, 'isCEO', false);
        expect(assistantPath).toEqual('employees[1].isCEO');

        let path = getPathsByKeyValue(acmeInc, 'name', 'Hugo Boss');
        expect(path).toEqual('employees[0].name');

        path = getPathsByKeyValue(acmeInc, 'employeeNumber', 1);
        expect(path).toEqual('employees[0].employeeNumber');

        path = getPathsByKeyValue(acmeInc, 'name', 'Herbert Assistant');
        expect(path).toEqual('employees[1].name');

        path = getPathsByKeyValue(acmeInc, 'isCEO', false);
        expect(path).toEqual('employees[1].isCEO');

        path = getPathsByKeyValue(acmeInc, 'employeeNumber', 2);
        expect(path).toEqual('employees[1].employeeNumber');
    });

    test('Get multiple paths by key/value for string|boolean|number-values', async () => {
        let allPaths: string[] = getPathsByKeyValue(acmeInc, 'movie', 'Who Framed Roger Rabbit') as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[0].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[0].movie');

        allPaths = getPathsByKeyValue(acmeInc, 'retired', true) as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[1].retired');
        expect(allPaths[1]).toEqual('actors[2].retired');

        allPaths = getPathsByKeyValue(acmeInc, 'started', 1996) as string[];
        expect(allPaths.length).toEqual(3);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].started');
        expect(allPaths[1]).toEqual('actors[2].playedIn[0].started');
        expect(allPaths[2]).toEqual('actors[3].playedIn[1].started');
    });

    test('Get path to a single known key', async () => {
        const path = getPaths(acmeInc, {key: 'numberOfActors'});
        expect(path).toEqual('company.numberOfActors');
    });

    test('Get all paths to a key', async () => {
        const allPaths: string[] = getPaths(acmeInc, {key: 'actorId'}) as string[];
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });

    test('Get path to a single known value', async () => {
        const path = getPaths(acmeInc, {value: 'Bugs Bunny'});
        expect(path).toEqual('actors[0].name');
    });
});
