import * as _ from 'lodash';
interface FindObjectPathsMixin extends _.LoDashStatic {
    findObjectPaths<T>(object: T, { key, value }: {
        key?: string;
        value?: string | boolean | number;
    }): string | string[] | void;
}
declare const _default: FindObjectPathsMixin;
export default _default;
