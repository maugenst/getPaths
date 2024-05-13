export type KeyValue = {
    key?: string;
    value?: Value;
};

export type Value = string | boolean | number;

export type Searchable = object | string | [];

/**
 * Check if an object has a particular key / value combination
 * @param obj <Searchable> the object or array
 * @param {string | <KeyValue>} key Key can be either an object or a string
 * @param {Value} value the value (optional)
 */
export function has(obj: Searchable, key: KeyValue | string, value?: Value): boolean {
    if (typeof key === 'string') {
        return findPaths(obj, key, value) !== undefined;
    } else {
        return findPaths(obj, key.key, key.value) !== undefined;
    }
}

/**
 * Find a single or all path(s) matching to a key or a value passed in an object
 * @param obj <Searchable> the object
 * @param {object} <KeyValue> key string | value Value
 */
export function findObjectPaths(obj: Searchable, {key, value}: KeyValue): string | string[] | void {
    return findPaths(obj, key, value);
}

/**
 * Find a single or all path(s) matching to a key in an object
 * @param obj <Searchable> the object
 * @param key <string> the key to search for
 */
export function findObjectPathsByKey(obj: Searchable, key: string): string | string[] | void {
    return findPaths(obj, key);
}

/**
 * Find a single or all path(s) to a value in an object
 * @param obj <Searchable> the object
 * @param value <Value> the value to search for
 */
export function findObjectPathsByValue(obj: Searchable, value: Value): string | string[] | void {
    return findPaths(obj, undefined, value);
}

/**
 * Find a or all path(s) to a key with a given value in an object
 * @param obj <Searchable> the object
 * @param key <string> the key to search for
 * @param value <Value> the value to search for
 */
export function findObjectPathsByKeyValue(obj: Searchable, key?: string, value?: Value): string | string[] | void {
    return findPaths(obj, key, value);
}

/**
 * Find a or all path(s) to a key with a given value in an object
 * @param obj <Searchable> the object
 * @param key <string> the key to search for
 * @param value <Value> the value to search for
 */
function findPaths(obj: Searchable, key?: string, value?: Value): string | string[] | void {
    const results: string[] = [];

    const find = (
        data: any,
        searchKey: string | undefined,
        searchValue: Value | undefined,
        pathToData: string,
    ): string | void => {
        if (typeof data === 'string' || typeof data === 'boolean' || typeof data === 'number') {
            const keyTmp = pathToData.split('.').pop();
            if (searchKey && searchValue !== undefined && data === searchValue) {
                if (keyTmp && (keyTmp === searchKey || keyTmp.endsWith(`[${searchKey}]`))) {
                    results.push(pathToData);
                }
            } else if (searchKey && searchValue === undefined) {
                if (keyTmp && (keyTmp === searchKey || keyTmp.endsWith(`[${searchKey}]`))) {
                    results.push(pathToData);
                }
            } else if (searchKey === undefined && searchValue !== undefined && data === searchValue) {
                if (keyTmp) {
                    results.push(pathToData);
                }
            }
            return;
        } else if (Array.isArray(data)) {
            for (let j = 0; j < data.length; j++) {
                find(data[j], searchKey, searchValue, `${pathToData}[${j}]`);
            }
            return;
        } else if (typeof data === 'object') {
            for (const k in data) {
                if (data.hasOwnProperty(k)) {
                    find(data[k], searchKey, searchValue, `${pathToData ? pathToData + '.' : ''}${k}`);
                }
            }
            return;
        }
    };

    find(obj, key, value, '');
    if (results.length > 1) {
        return results;
    } else if (results.length === 1) {
        return results[0];
    }
    return;
}
