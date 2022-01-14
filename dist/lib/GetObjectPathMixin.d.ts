import * as _ from 'lodash';
interface GetObjectPathMixin extends _.LoDashStatic {
    getPaths<T>(object: T, { key, value }: {
        key?: string;
        value?: string | boolean | number;
    }): string | string[] | void;
}
declare const _default: GetObjectPathMixin;
export default _default;
