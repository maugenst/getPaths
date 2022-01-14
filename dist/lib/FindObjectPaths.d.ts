export declare function findObjectPaths(obj: object | string | number | [], { key, value }: {
    key?: string;
    value?: string | boolean | number;
}): string | string[] | void;
export declare function findObjectPathsByKey(obj: object | string | number | [], key: string): string | string[] | void;
export declare function findObjectPathsByValue(obj: object | string | number | [], value: string | boolean | number): string | string[] | void;
export declare function findObjectPathsByKeyValue(obj: object | string | number | [], key?: string, value?: string | boolean | number): string | string[] | void;
