/**
 * Find a single or all path(s) matching to a key or a value passed in an object
 * @param obj <object | string | number | []> the object
 * @param {object} key string | value string | boolean | number
 */
export function findObjectPaths(
    obj: object | string | number | [],
    {key, value}: {key?: string; value?: string | boolean | number}
): string | string[] | void {
    return findPaths(obj, key, value);
}

/**
 * Find a single or all path(s) matching to a key in an object
 * @param obj <object | string | number | []> the object
 * @param key <string> the key to search for
 */
export function findObjectPathsByKey(obj: object | string | number | [], key: string): string | string[] | void {
    return findPaths(obj, key);
}

/**
 * Find a single or all path(s) to a value in an object
 * @param obj <object | string | number | []> the object
 * @param value <string | boolean | number> the value to search for
 */
export function findObjectPathsByValue(
    obj: object | string | number | [],
    value: string | boolean | number
): string | string[] | void {
    return findPaths(obj, undefined, value);
}

/**
 * Find a or all path(s) to a key with a given value in an object
 * @param obj <object | string | number | []> the object
 * @param key <string> the key to search for
 * @param value <string | boolean | number> the value to search for
 */
export function findObjectPathsByKeyValue(
    obj: object | string | number | [],
    key?: string,
    value?: string | boolean | number
): string | string[] | void {
    return findPaths(obj, key, value);
}

/**
 * Find a or all path(s) to a key with a given value in an object
 * @param obj <object | string | number | []> the object
 * @param key <string> the key to search for
 * @param value <string | boolean | number> the value to search for
 */
function findPaths(
    obj: object | string | number | [],
    key?: string,
    value?: string | boolean | number
): string | string[] | void {
    const results: string[] = [];

    const find = (
        data: any,
        searchKey: string | undefined,
        searchValue: string | boolean | number | undefined,
        pathToData: string
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
