"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findObjectPathsByKeyValue = exports.findObjectPathsByValue = exports.findObjectPathsByKey = exports.findObjectPaths = exports.has = void 0;
function has(obj, key, value) {
    if (typeof key === 'string') {
        return findPaths(obj, key, value) !== undefined;
    }
    else {
        return findPaths(obj, key.key, key.value) !== undefined;
    }
}
exports.has = has;
function findObjectPaths(obj, { key, value }) {
    return findPaths(obj, key, value);
}
exports.findObjectPaths = findObjectPaths;
function findObjectPathsByKey(obj, key) {
    return findPaths(obj, key);
}
exports.findObjectPathsByKey = findObjectPathsByKey;
function findObjectPathsByValue(obj, value) {
    return findPaths(obj, undefined, value);
}
exports.findObjectPathsByValue = findObjectPathsByValue;
function findObjectPathsByKeyValue(obj, key, value) {
    return findPaths(obj, key, value);
}
exports.findObjectPathsByKeyValue = findObjectPathsByKeyValue;
function findPaths(obj, key, value) {
    const results = [];
    const find = (data, searchKey, searchValue, pathToData) => {
        if (typeof data === 'string' || typeof data === 'boolean' || typeof data === 'number') {
            const keyTmp = pathToData.split('.').pop();
            if (searchKey && searchValue !== undefined && data === searchValue) {
                if (keyTmp && (keyTmp === searchKey || keyTmp.endsWith(`[${searchKey}]`))) {
                    results.push(pathToData);
                }
            }
            else if (searchKey && searchValue === undefined) {
                if (keyTmp && (keyTmp === searchKey || keyTmp.endsWith(`[${searchKey}]`))) {
                    results.push(pathToData);
                }
            }
            else if (searchKey === undefined && searchValue !== undefined && data === searchValue) {
                if (keyTmp) {
                    results.push(pathToData);
                }
            }
            return;
        }
        else if (Array.isArray(data)) {
            for (let j = 0; j < data.length; j++) {
                find(data[j], searchKey, searchValue, `${pathToData}[${j}]`);
            }
            return;
        }
        else if (typeof data === 'object') {
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
    }
    else if (results.length === 1) {
        return results[0];
    }
    return;
}
//# sourceMappingURL=FindObjectPaths.js.map