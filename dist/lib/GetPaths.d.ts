export declare function getPaths(obj: object | string | number | [], { key, value }: {
    key?: string;
    value?: string | boolean | number;
}): string | string[] | void;
export declare function getPathsByKey(obj: object | string | number | [], key: string): string | string[] | void;
export declare function getPathsByValue(obj: object | string | number | [], value: string | boolean | number): string | string[] | void;
export declare function getPathsByKeyValue(obj: object | string | number | [], key?: string, value?: string | boolean | number): string | string[] | void;
