export declare type LazyCallback<T = any> = (flushed?: T) => Promise<T>;

export declare type LazyCallbacks<T = any> = LazyCallback<T>[];

export declare function parallel<T = any>(
  pool?: LazyCallbacks<T>,
  concurrency?: number,
  pipe?: boolean
): Promise<T | T[]>;

export declare function series(pool: LazyCallbacks): Promise<any>;

export declare function waterfall(pool: LazyCallbacks): Promise<any>;

export {};
