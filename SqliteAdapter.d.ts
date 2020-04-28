/**
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2014-2020, THEMOST LP
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */

export declare interface SqliteAdapterTable {
    create(fields:Array<any>, callback: (err: Error) => void): void;
    createAsync(fields:Array<any>): Promise<void>;
    exists(callback: (err: Error, result: boolean) => void): void;
    existsAsync(): Promise<boolean>;
    version(callback: (err: Error, result: string) => void): void;
    versionAsync(): Promise<string>;
    columns(callback: (err: Error, result: Array<any>) => void): void;
    columnsAsync(): Promise<Array<any>>;
    has_sequence(callback: (err: Error, result: boolean) => void): void;
    has_sequenceAsync(): Promise<boolean>;
    
}

export declare interface SqliteAdapterView {
    create(query: any, callback: (err: Error) => void): void;
    createAsync(query: any): Promise<void>;
    exists(callback: (err: Error, result: boolean) => void): void;
    existsAsync(): Promise<boolean>;
    drop(callback: (err: Error) => void): void;
    dropAsync(): Promise<void>;
}

export declare interface SqliteAdapterMigration {
    add: Array<any>;
    change?: Array<any>;
    appliesTo: string;
    version: string;
}

export declare class SqliteAdapter {
    static formatType(field: any): string;

    open(callback: (err: Error) => void): void;
    close(callback: (err: Error) => void): void;
    openAsync(): Promise<void>;
    closeAsync(): Promise<void>;
    prepare(query: any, values?: Array<any>): any;
    createView(name: string, query: any, callback: (err: Error) => void): void;
    executeInTransaction(func: any, callback: (err: Error) => void): void;
    executeInTransactionAsync(func: Promise<any>): Promise<any>;
    migrate(obj: SqliteAdapterMigration, callback: (err: Error) => void): void;
    migrateAsync(obj: SqliteAdapterMigration): Promise<void>;
    selectIdentity(entity: string, attribute: string, callback: (err: Error, value: any) => void): void;
    execute(query: any, values: any, callback: (err: Error, value: any) => void): void;
    executeAsync(query: any, values: any): Promise<any>;
    executeAsync<T>(query: any, values: any): Promise<Array<T>>;
    lastIdentity(callback: (err: Error, value: any) => void): void;
    table(name: string): SqliteAdapterTable;
    view(name: string): SqliteAdapterView;
}