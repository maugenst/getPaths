import {getPaths} from './GetPaths';
import * as _ from 'lodash';

interface GetPathsMixin extends _.LoDashStatic {
    getPaths<T>(object: T, {key, value}: {key?: string; value?: string | boolean | number}): string | string[] | void;
}

_.mixin({getPaths: getPaths});

export default <GetPathsMixin>_;
