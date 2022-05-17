[![NPM](https://nodei.co/npm/find-object-paths.png)](https://nodei.co/npm/find-object-paths/)

[![CircleCI](https://circleci.com/gh/maugenst/getPaths.svg?style=shield)](https://circleci.com/gh/maugenst/getPaths)
[![Coverage Status](https://coveralls.io/repos/github/maugenst/getPaths/badge.svg?branch=main)](https://coveralls.io/github/maugenst/getPaths?branch=main)

# find-object-paths

Easy to use zero dependency get or find paths in objects to given key('s), value('s) or key/value 
combinations. It is meant to interact nicely with lodash to quickly access or test values in objects, 
but can be used standalone as well.

Despite other projects you also can specify values to be searched for.

## Installation


Install via npm

```
npm install find-object-paths
```

## Example data (see test-folder)

acmeInc.json

```json
{
  "company": {
    "name": "ACME INC",
    "address": "1st Street, Toontown, TT",
    "founded": "December 31st 1969",
    "hasStocks": true,
    "numberOfEmployees": 2,
    "numberOfActors": 3
  }
  // see full content on github
}
```
[Full Source of acmeInc](https://github.com/maugenst/getPaths/blob/main/test/acmeInc.json)

## Basic usage

```ts
import { has, findObjectPaths } from 'find-object-paths';

class TestMe {

    static async main() {
        let acmeInc = {};
        rawFileContent = fs.readFileSync(p.resolve(__dirname, 'acmeInc.json'), 'utf-8');
        acmeInc = JSON.parse(rawFileContent);

        let path = findObjectPaths(acmeInc, {key: 'founded'});
        // company.founded
        path = findObjectPaths(acmeInc, {value: 'December 31st 1969'});
        // company.founded

        const allPaths: string[] = findObjectPaths(acmeInc, {key: 'actorId'}) as string[];
        /* [ 'actors[0].actorId',
             'actors[1].actorId',
             'actors[2].actorId',
             'actors[3].actorId' ]
         */

        const ceoPath = findObjectPaths(acmeInc, {key: 'isCEO', value: true});
         // employees[0].isCEO

        has(acmeInc, 'name', 'Hugo Boss');
        // true

        has(acmeInc, {value: 'Hugo Boss'});
        // true

    }
}

TestMe.main();
```

See more examples implemented in [tests-findObjectPaths](https://github.com/maugenst/getPaths/blob/main/test/tests-findObjectPaths.ts).

## Convenient Methods
+ **has** Checks if a key / value combination is available in an object
+ **findObjectPathsByKey** Find a single or all path(s) matching to a key in an object
+ **findObjectPathsByValue** Find a single or all path(s) to a value in an object.
+ **findObjectPathsByKeyValue** Find a or all path(s) to a key with a given value in an object

## Lodash Mixin
findObjectPaths can be used as a lodash mixin.
```ts
import _ from '../lib/FindObjectPathsMixin';
.
.
.
const path = _.findObjectPaths(acmeInc, {key: 'numberOfActors'});
// company.numberOfActors

path = _.findObjectPaths(acmeInc, {value: 'DVD'});
// distributionChannels[1][2]

if (_.has(acmeInc, _.findObjectPaths(acmeInc, {value: 'DVD'}))) {
    const dvd = _.get(acmeInc, _.findObjectPaths(acmeInc, {value: 'DVD'}));
    // do something
}
```

### Tests

Tests can be found in `/test` and run by jest. To run the tests call ``npm test``.

### Changes

+ added `has` function to check availability of keys / values in objects or arrays
