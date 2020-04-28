/**
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2014-2020, THEMOST LP
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
const { SqliteAdapter } = require('./SqliteAdapter');
const { SqliteFormatter } = require('./SqliteFormatter');

/**
 * Creates an instance of SqliteAdapter object that represents a SQLite database connection.
 * @param {*} options An object that represents the properties of the underlying database connection.
 * @returns {*}
 */
function createInstance(options) {
    return new SqliteAdapter(options);
}

export {
    SqliteAdapter,
    SqliteFormatter,
    createInstance
};