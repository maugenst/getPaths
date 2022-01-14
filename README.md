[![NPM](https://nodei.co/npm/getPaths.png)](https://nodei.co/npm/getPaths/)

[![CircleCI](https://circleci.com/gh/maugenst/getPaths.svg?style=shield)](https://circleci.com/gh/maugenst/getPaths)
[![Coverage Status](https://coveralls.io/repos/github/maugenst/getPaths/badge.svg?branch=master)](https://coveralls.io/github/maugenst/getPaths?branch=master)


# getPaths

Easy to use zero dependency get or find paths in objects to given key('s), value('s) or key/value 
combinations. It is meant to interact nicely with lodash to quickly access or test values in objects, 
but can be used standalone as well.

## Installation

Install via npm

```
npm install getPaths
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
  },
  .
  .
  .
  // see full content on github
}
```
https://github.com/maugenst/getPaths/blob/main/test/acmeInc.json

## Basic usage

```ts
import { getPaths } from 'getPaths';

class TestMe {

    static async main() {
        let acmeInc = {};
        rawFileContent = fs.readFileSync(p.resolve(__dirname, 'acmeInc.json'), 'utf-8');
        acmeInc = JSON.parse(rawFileContent);

        let path = getPaths(acmeInc, {key: 'founded'});
        // company.founded
        path = getPaths(acmeInc, {value: 'December 31st 1969'});
        // company.founded

        const allPaths: string[] = getPaths(acmeInc, {key: 'actorId'}) as string[];
        /* [ 'actors[0].actorId',
             'actors[1].actorId',
             'actors[2].actorId',
             'actors[3].actorId' ]
         */

        const ceoPath = getPaths(acmeInc, {key: 'isCEO', value: true});
         // employees[0].isCEO
    }
}

TestMe.main();
```

See more examples implemented in [tests-getPaths](https://github.com/maugenst/getPaths/blob/main/test/tests-getPaths.ts).

## Convenient Methods

+ **getPathsByKey** Find a single or all path(s) matching to a key in an object
+ **getPathsByValue** Find a single or all path(s) to a value in an object.
+ **getPathsByKeyValue** Find a or all path(s) to a key with a given value in an object

## Lodash Mixin
getPaths can be used as a lodash mixin.
```ts
import _ from '../lib/GetPathsMixin';
.
.
.
const path = _.getPaths(acmeInc, {key: 'numberOfActors'});
// company.numberOfActors

path = _.getPaths(acmeInc, {value: 'DVD'});
// distributionChannels[1][2]

if (_.has(acmeInc, _.getPaths(acmeInc, {value: 'DVD'}))) {
    const dvd = _.get(acmeInc, _.getPaths(acmeInc, {value: 'DVD'}));
    // do something
}
```

### Tests

Tests can be found in `/test` and run by jest. To run the tests call ``npm test``.
