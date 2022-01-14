import * as _ from 'lodash';
interface GetPathsMixin extends _.LoDashStatic {
    getPaths<T>(object: T, { key, value }: {
        key?: string;
        value?: string | boolean | number;
    }): string | string[] | void;
}
declare const _default: GetPathsMixin;
export default _default;
