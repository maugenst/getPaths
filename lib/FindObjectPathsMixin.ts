import {findObjectPaths} from './FindObjectPaths';
import _ from 'lodash';

interface FindObjectPathsMixin extends _.LoDashStatic {
    findObjectPaths<T>(
        object: T,
        {key, value}: {key?: string; value?: string | boolean | number},
    ): string | string[] | void;
}

_.mixin({findObjectPaths: findObjectPaths});

export default <FindObjectPathsMixin>_;
