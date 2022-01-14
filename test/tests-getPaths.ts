'use strict';
import 'jest-extended';
import * as fs from 'fs';
import * as p from 'path';
import {getPaths, getPathsByKey, getPathsByKeyValue, getPathsByValue} from '../lib/GetPaths';
import _ from '../lib/GetPathsMixin';

describe('Get-Object-Paths Tests', function () {
    let acmeInc = {};
    let rawFileContent: string;

    beforeAll(() => {
        rawFileContent = fs.readFileSync(p.resolve(__dirname, 'acmeInc.json'), 'utf-8');
        acmeInc = JSON.parse(rawFileContent);
    });

    test('getPaths: empty object should return undefined', async () => {
        const path = getPaths({}, {key: 'test'});
        expect(path).toBeUndefined();
    });

    test('getPaths: on a buffer should return undefined but not produce an error', async () => {
        const path = getPaths(rawFileContent, {key: 'test'});
        expect(path).toBeUndefined();
    });

    test('getPaths: path to a single known key', async () => {
        const path = getPaths(acmeInc, {key: 'numberOfActors'});
        expect(path).toEqual('company.numberOfActors');
    });

    test('getPaths: all paths to a key', async () => {
        const allPaths: string[] = getPaths(acmeInc, {key: 'actorId'}) as string[];
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });

    test('getPaths: path to a single known value', async () => {
        let path = getPaths(acmeInc, {value: 'Bugs Bunny'});
        expect(path).toEqual('actors[0].name');

        path = getPaths(acmeInc, {value: 'DVD'});
        expect(path).toEqual('distributionChannels[1][2]');

        path = getPaths(acmeInc, {value: 12});
        expect(path).toEqual('distributionChannels[2][1]');

        const paths = getPaths(acmeInc, {value: true}) as string[];
        expect(paths.slice(-1)[0]).toEqual('distributionChannels[2][2]');
    });

    test('getPaths: path by key/value for string|boolean|number-values', async () => {
        const ceoPath = getPaths(acmeInc, {key: 'isCEO', value: true});
        expect(ceoPath).toEqual('employees[0].isCEO');

        const assistantPath = getPaths(acmeInc, {key: 'isCEO', value: false});
        expect(assistantPath).toEqual('employees[1].isCEO');

        let path = getPaths(acmeInc, {key: 'name', value: 'Hugo Boss'});
        expect(path).toEqual('employees[0].name');

        path = getPaths(acmeInc, {key: 'employeeNumber', value: 1});
        expect(path).toEqual('employees[0].employeeNumber');

        path = getPaths(acmeInc, {key: 'name', value: 'Herbert Assistant'});
        expect(path).toEqual('employees[1].name');

        path = getPaths(acmeInc, {key: 'isCEO', value: false});
        expect(path).toEqual('employees[1].isCEO');

        path = getPaths(acmeInc, {key: 'employeeNumber', value: 2});
        expect(path).toEqual('employees[1].employeeNumber');
    });

    test('getPaths: multiple paths by key/value for string|boolean|number-values', async () => {
        let allPaths: string[] = getPaths(acmeInc, {key: 'movie', value: 'Who Framed Roger Rabbit'}) as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[0].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[0].movie');

        allPaths = getPaths(acmeInc, {key: 'retired', value: true}) as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[1].retired');
        expect(allPaths[1]).toEqual('actors[2].retired');

        allPaths = getPaths(acmeInc, {key: 'started', value: 1996}) as string[];
        expect(allPaths.length).toEqual(3);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].started');
        expect(allPaths[1]).toEqual('actors[2].playedIn[0].started');
        expect(allPaths[2]).toEqual('actors[3].playedIn[1].started');
    });

    test('getPathsByKey: path to a single known key', async () => {
        const path = getPathsByKey(acmeInc, 'numberOfActors');
        expect(path).toEqual('company.numberOfActors');
    });

    test('getPathsByKey: all paths to a key', async () => {
        const allPaths: string[] = getPathsByKey(acmeInc, 'actorId') as string[];
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });

    test('getPathsByValue: path to a single known value', async () => {
        let path = getPathsByValue(acmeInc, 'Bugs Bunny');
        expect(path).toEqual('actors[0].name');

        path = getPathsByValue(acmeInc, 'DVD');
        expect(path).toEqual('distributionChannels[1][2]');

        path = getPathsByValue(acmeInc, 12);
        expect(path).toEqual('distributionChannels[2][1]');

        const paths = getPathsByValue(acmeInc, true) as string[];
        expect(paths.slice(-1)[0]).toEqual('distributionChannels[2][2]');
    });

    test('getPathsByValue: all paths to a specific value', async () => {
        const allPaths: string[] = getPathsByValue(acmeInc, 'Space Jam') as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[1].movie');
    });

    test('getPathsByKeyValue: path by key/value for string|boolean|number-values', async () => {
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

    test('getPathsByKeyValue: multiple paths by key/value for string|boolean|number-values', async () => {
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

    test('_.getPaths: path to a single known key', async () => {
        const path = _.getPaths(acmeInc, {key: 'numberOfActors'});
        expect(path).toEqual('company.numberOfActors');
    });

    test('_.getPaths: all paths to a key', async () => {
        const allPaths: string[] = _.getPaths(acmeInc, {key: 'actorId'}) as string[];
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });

    test('_.getPaths: path to a single known value', async () => {
        let path = _.getPaths(acmeInc, {value: 'Bugs Bunny'});
        expect(path).toEqual('actors[0].name');

        path = _.getPaths(acmeInc, {value: 'DVD'});
        expect(path).toEqual('distributionChannels[1][2]');

        path = _.getPaths(acmeInc, {value: 12});
        expect(path).toEqual('distributionChannels[2][1]');

        const paths = _.getPaths(acmeInc, {value: true}) as string[];
        expect(paths.slice(-1)[0]).toEqual('distributionChannels[2][2]');
    });

    test('_.getPaths: all paths to a specific value', async () => {
        const allPaths: string[] = _.getPaths(acmeInc, {value: 'Space Jam'}) as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[1].movie');
    });

    test('_.getPaths: path by key/value for string|boolean|number-values', async () => {
        const ceoPath = _.getPaths(acmeInc, {key: 'isCEO', value: true});
        expect(ceoPath).toEqual('employees[0].isCEO');

        const assistantPath = _.getPaths(acmeInc, {key: 'isCEO', value: false});
        expect(assistantPath).toEqual('employees[1].isCEO');

        let path = _.getPaths(acmeInc, {key: 'name', value: 'Hugo Boss'});
        expect(path).toEqual('employees[0].name');

        path = _.getPaths(acmeInc, {key: 'employeeNumber', value: 1});
        expect(path).toEqual('employees[0].employeeNumber');

        path = _.getPaths(acmeInc, {key: 'name', value: 'Herbert Assistant'});
        expect(path).toEqual('employees[1].name');

        path = _.getPaths(acmeInc, {key: 'isCEO', value: false});
        expect(path).toEqual('employees[1].isCEO');

        path = _.getPaths(acmeInc, {key: 'employeeNumber', value: 2});
        expect(path).toEqual('employees[1].employeeNumber');
    });

    test('_.getPaths: multiple paths by key/value for string|boolean|number-values', async () => {
        let allPaths: string[] = _.getPaths(acmeInc, {key: 'movie', value: 'Who Framed Roger Rabbit'}) as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[0].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[0].movie');

        allPaths = _.getPaths(acmeInc, {key: 'retired', value: true}) as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[1].retired');
        expect(allPaths[1]).toEqual('actors[2].retired');

        allPaths = _.getPaths(acmeInc, {key: 'started', value: 1996}) as string[];
        expect(allPaths.length).toEqual(3);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].started');
        expect(allPaths[1]).toEqual('actors[2].playedIn[0].started');
        expect(allPaths[2]).toEqual('actors[3].playedIn[1].started');
    });
});
