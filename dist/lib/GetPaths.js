"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathsByKeyValue = exports.getPathsByValue = exports.getPathsByKey = exports.getPaths = void 0;
function getPaths(obj, { key, value }) {
    return findPaths(obj, key, value);
}
exports.getPaths = getPaths;
function getPathsByKey(obj, key) {
    return findPaths(obj, key);
}
exports.getPathsByKey = getPathsByKey;
function getPathsByValue(obj, value) {
    return findPaths(obj, undefined, value);
}
exports.getPathsByValue = getPathsByValue;
function getPathsByKeyValue(obj, key, value) {
    return findPaths(obj, key, value);
}
exports.getPathsByKeyValue = getPathsByKeyValue;
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
//# sourceMappingURL=GetPaths.js.map