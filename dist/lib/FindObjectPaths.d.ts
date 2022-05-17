export declare type KeyValue = {
    key?: string;
    value?: Value;
};
export declare type Value = string | boolean | number;
export declare type Searchable = object | string | [];
export declare function has(obj: Searchable, key: KeyValue | string, value?: Value): boolean;
export declare function findObjectPaths(obj: Searchable, { key, value }: KeyValue): string | string[] | void;
export declare function findObjectPathsByKey(obj: Searchable, key: string): string | string[] | void;
export declare function findObjectPathsByValue(obj: Searchable, value: Value): string | string[] | void;
export declare function findObjectPathsByKeyValue(obj: Searchable, key?: string, value?: Value): string | string[] | void;
