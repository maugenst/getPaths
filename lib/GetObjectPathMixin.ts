import {getPaths} from './GetObjectPaths';
import * as _ from 'lodash';

interface GetObjectPathMixin extends _.LoDashStatic {
    getPaths<T>(object: T, {key, value}: {key?: string; value?: string | boolean | number}): string | string[] | void;
}

_.mixin({getPaths: getPaths});

export default <GetObjectPathMixin>_;
