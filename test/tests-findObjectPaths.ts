'use strict';
import 'jest-extended';
import * as fs from 'fs';
import * as p from 'path';
import {
    has,
    findObjectPaths,
    findObjectPathsByKey,
    findObjectPathsByKeyValue,
    findObjectPathsByValue,
} from '../lib/FindObjectPaths';
import _ from '../lib/FindObjectPathsMixin';

describe('Find-Object-Paths Tests', function () {
    let acmeInc: any = {};
    let rawFileContent: string;

    beforeAll(() => {
        rawFileContent = fs.readFileSync(p.resolve(__dirname, 'acmeInc.json'), 'utf-8');
        acmeInc = JSON.parse(rawFileContent);
    });

    test('findObjectPaths: has', async () => {
        expect(has(acmeInc.employees, {key: 'name'})).toBeTruthy();
        expect(has(acmeInc.employees, {key: 'foo'})).toBeFalsy();
        expect(has(acmeInc.employees, {key: 'name', value: 'Hugo Boss'})).toBeTruthy();
        expect(has(acmeInc.employees, {value: 'Hugo Boss'})).toBeTruthy();
        expect(has(acmeInc.employees, {value: 'William Shakespeare'})).toBeFalsy();
        expect(has(acmeInc.employees, 'name')).toBeTruthy();
        expect(has(acmeInc.employees, 'foo')).toBeFalsy();
        expect(has(acmeInc.employees, 'name', 'Hugo Boss')).toBeTruthy();
        expect(has(acmeInc.employees, 'name', 'William Shakespeare')).toBeFalsy();
        expect(has(acmeInc.employees, 'foo', 'bar')).toBeFalsy();
    });

    test('findObjectPaths: empty object should return undefined', async () => {
        const path = findObjectPaths({}, {key: 'test'});
        expect(path).toBeUndefined();
    });

    test('findObjectPaths: on a buffer should return undefined but not produce an error', async () => {
        const path = findObjectPaths(rawFileContent, {key: 'test'});
        expect(path).toBeUndefined();
    });

    test('findObjectPaths: path to a single known key', async () => {
        const path = findObjectPaths(acmeInc, {key: 'numberOfActors'});
        expect(path).toEqual('company.numberOfActors');
    });

    test('findObjectPaths: all paths to a key', async () => {
        const allPaths: string[] = findObjectPaths(acmeInc, {key: 'actorId'}) as string[];
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });

    test('findObjectPaths: path to a single known value', async () => {
        let path = findObjectPaths(acmeInc, {value: 'Bugs Bunny'});
        expect(path).toEqual('actors[0].name');

        path = findObjectPaths(acmeInc, {value: 'DVD'});
        expect(path).toEqual('distributionChannels[1][2]');

        path = findObjectPaths(acmeInc, {value: 12});
        expect(path).toEqual('distributionChannels[2][1]');

        const paths = findObjectPaths(acmeInc, {value: true}) as string[];
        expect(paths.slice(-1)[0]).toEqual('distributionChannels[2][2]');
    });

    test('findObjectPaths: path by key/value for string|boolean|number-values', async () => {
        const ceoPath = findObjectPaths(acmeInc, {key: 'isCEO', value: true});
        expect(ceoPath).toEqual('employees[0].isCEO');

        const assistantPath = findObjectPaths(acmeInc, {key: 'isCEO', value: false});
        expect(assistantPath).toEqual('employees[1].isCEO');

        let path = findObjectPaths(acmeInc, {key: 'name', value: 'Hugo Boss'});
        expect(path).toEqual('employees[0].name');

        path = findObjectPaths(acmeInc, {key: 'employeeNumber', value: 1});
        expect(path).toEqual('employees[0].employeeNumber');

        path = findObjectPaths(acmeInc, {key: 'name', value: 'Herbert Assistant'});
        expect(path).toEqual('employees[1].name');

        path = findObjectPaths(acmeInc, {key: 'isCEO', value: false});
        expect(path).toEqual('employees[1].isCEO');

        path = findObjectPaths(acmeInc, {key: 'employeeNumber', value: 2});
        expect(path).toEqual('employees[1].employeeNumber');
    });

    test('findObjectPaths: multiple paths by key/value for string|boolean|number-values', async () => {
        let allPaths: string[] = findObjectPaths(acmeInc, {key: 'movie', value: 'Who Framed Roger Rabbit'}) as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[0].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[0].movie');

        allPaths = findObjectPaths(acmeInc, {key: 'retired', value: true}) as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[1].retired');
        expect(allPaths[1]).toEqual('actors[2].retired');

        allPaths = findObjectPaths(acmeInc, {key: 'started', value: 1996}) as string[];
        expect(allPaths.length).toEqual(3);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].started');
        expect(allPaths[1]).toEqual('actors[2].playedIn[0].started');
        expect(allPaths[2]).toEqual('actors[3].playedIn[1].started');
    });

    test('findObjectPathsByKey: path to a single known key', async () => {
        const path = findObjectPathsByKey(acmeInc, 'numberOfActors');
        expect(path).toEqual('company.numberOfActors');
    });

    test('findObjectPathsByKey: all paths to a key', async () => {
        const allPaths: string[] = findObjectPathsByKey(acmeInc, 'actorId') as string[];
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });

    test('findObjectPathsByValue: path to a single known value', async () => {
        let path = findObjectPathsByValue(acmeInc, 'Bugs Bunny');
        expect(path).toEqual('actors[0].name');

        path = findObjectPathsByValue(acmeInc, 'DVD');
        expect(path).toEqual('distributionChannels[1][2]');

        path = findObjectPathsByValue(acmeInc, 12);
        expect(path).toEqual('distributionChannels[2][1]');

        const paths = findObjectPathsByValue(acmeInc, true) as string[];
        expect(paths.slice(-1)[0]).toEqual('distributionChannels[2][2]');
    });

    test('findObjectPathsByValue: all paths to a specific value', async () => {
        const allPaths: string[] = findObjectPathsByValue(acmeInc, 'Space Jam') as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[1].movie');
    });

    test('findObjectPathsByKeyValue: path by key/value for string|boolean|number-values', async () => {
        const ceoPath = findObjectPathsByKeyValue(acmeInc, 'isCEO', true);
        expect(ceoPath).toEqual('employees[0].isCEO');

        const assistantPath = findObjectPathsByKeyValue(acmeInc, 'isCEO', false);
        expect(assistantPath).toEqual('employees[1].isCEO');

        let path = findObjectPathsByKeyValue(acmeInc, 'name', 'Hugo Boss');
        expect(path).toEqual('employees[0].name');

        path = findObjectPathsByKeyValue(acmeInc, 'employeeNumber', 1);
        expect(path).toEqual('employees[0].employeeNumber');

        path = findObjectPathsByKeyValue(acmeInc, 'name', 'Herbert Assistant');
        expect(path).toEqual('employees[1].name');

        path = findObjectPathsByKeyValue(acmeInc, 'isCEO', false);
        expect(path).toEqual('employees[1].isCEO');

        path = findObjectPathsByKeyValue(acmeInc, 'employeeNumber', 2);
        expect(path).toEqual('employees[1].employeeNumber');
    });

    test('findObjectPathsByKeyValue: multiple paths by key/value for string|boolean|number-values', async () => {
        let allPaths: string[] = findObjectPathsByKeyValue(acmeInc, 'movie', 'Who Framed Roger Rabbit') as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[0].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[0].movie');

        allPaths = findObjectPathsByKeyValue(acmeInc, 'retired', true) as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[1].retired');
        expect(allPaths[1]).toEqual('actors[2].retired');

        allPaths = findObjectPathsByKeyValue(acmeInc, 'started', 1996) as string[];
        expect(allPaths.length).toEqual(3);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].started');
        expect(allPaths[1]).toEqual('actors[2].playedIn[0].started');
        expect(allPaths[2]).toEqual('actors[3].playedIn[1].started');
    });

    test('_.findObjectPaths: path to a single known key', async () => {
        const path = _.findObjectPaths(acmeInc, {key: 'numberOfActors'});
        expect(path).toEqual('company.numberOfActors');
    });

    test('_.findObjectPaths: all paths to a key', async () => {
        const allPaths: string[] = _.findObjectPaths(acmeInc, {key: 'actorId'}) as string[];
        expect(allPaths.length).toEqual(4);
        expect(allPaths[0]).toEqual('actors[0].actorId');
        expect(allPaths[1]).toEqual('actors[1].actorId');
        expect(allPaths[2]).toEqual('actors[2].actorId');
        expect(allPaths[3]).toEqual('actors[3].actorId');
    });

    test('_.findObjectPaths: path to a single known value', async () => {
        let path = _.findObjectPaths(acmeInc, {value: 'Bugs Bunny'});
        expect(path).toEqual('actors[0].name');

        path = _.findObjectPaths(acmeInc, {value: 'DVD'});
        expect(path).toEqual('distributionChannels[1][2]');

        path = _.findObjectPaths(acmeInc, {value: 12});
        expect(path).toEqual('distributionChannels[2][1]');

        const paths = _.findObjectPaths(acmeInc, {value: true}) as string[];
        expect(paths.slice(-1)[0]).toEqual('distributionChannels[2][2]');
    });

    test('_.findObjectPaths: all paths to a specific value', async () => {
        const allPaths: string[] = _.findObjectPaths(acmeInc, {value: 'Space Jam'}) as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[1].movie');
    });

    test('_.findObjectPaths: path by key/value for string|boolean|number-values', async () => {
        const ceoPath = _.findObjectPaths(acmeInc, {key: 'isCEO', value: true});
        expect(ceoPath).toEqual('employees[0].isCEO');

        const assistantPath = _.findObjectPaths(acmeInc, {key: 'isCEO', value: false});
        expect(assistantPath).toEqual('employees[1].isCEO');

        let path = _.findObjectPaths(acmeInc, {key: 'name', value: 'Hugo Boss'});
        expect(path).toEqual('employees[0].name');

        path = _.findObjectPaths(acmeInc, {key: 'employeeNumber', value: 1});
        expect(path).toEqual('employees[0].employeeNumber');

        path = _.findObjectPaths(acmeInc, {key: 'name', value: 'Herbert Assistant'});
        expect(path).toEqual('employees[1].name');

        path = _.findObjectPaths(acmeInc, {key: 'isCEO', value: false});
        expect(path).toEqual('employees[1].isCEO');

        path = _.findObjectPaths(acmeInc, {key: 'employeeNumber', value: 2});
        expect(path).toEqual('employees[1].employeeNumber');
    });

    test('_.findObjectPaths: multiple paths by key/value for string|boolean|number-values', async () => {
        let allPaths: string[] = _.findObjectPaths(acmeInc, {
            key: 'movie',
            value: 'Who Framed Roger Rabbit',
        }) as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[0].playedIn[0].movie');
        expect(allPaths[1]).toEqual('actors[3].playedIn[0].movie');

        allPaths = _.findObjectPaths(acmeInc, {key: 'retired', value: true}) as string[];
        expect(allPaths.length).toEqual(2);
        expect(allPaths[0]).toEqual('actors[1].retired');
        expect(allPaths[1]).toEqual('actors[2].retired');

        allPaths = _.findObjectPaths(acmeInc, {key: 'started', value: 1996}) as string[];
        expect(allPaths.length).toEqual(3);
        expect(allPaths[0]).toEqual('actors[0].playedIn[1].started');
        expect(allPaths[1]).toEqual('actors[2].playedIn[0].started');
        expect(allPaths[2]).toEqual('actors[3].playedIn[1].started');
    });
});
