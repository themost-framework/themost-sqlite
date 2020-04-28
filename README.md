![test](https://github.com/themost-framework/themost-sqlite/workflows/test/badge.svg)
[![npm](https://img.shields.io/npm/v/@themost%2Fsqlite.svg)](https://www.npmjs.com/package/@themost%2Fsqlite)
![](https://img.shields.io/david/themost-framework/themost-sqlite?path=.)

# @themost/sqlite
MOST Web Framework SQLite Data Adapter

## Install

    npm install @themost/sqlite

## Usage

Register SQLite adapter on app.json as follows:

    "adapterTypes": [
        ...
          { "name":"SQLite Data Adapter", "invariantName": "sqlite", "type":"@themost/sqlite" }
        ...
        ],
    adapters: [
        ...
        { 
            "name":"local-db", "invariantName":"sqlite", "default":true,
            "options": {
                database:"db/local.db"
            }
        }
        ...
    ]
}

If you are intended to use SQLite adapter as the default database adapter set the property "default" to true. 

#### Post Installation Note:
SQLite Data Adapter comes with a regular expression extension for SQLite (regexp.c). You have to compile this extension as follows:

##### Using GCC/MinGW on Windows and Linux
gcc -shared -fPIC -Isqlite3 -o regexp.0.dylib regexp.c

##### Using GCC on Mac OSX
gcc -dynamiclib -fPIC -Isqlite3 -o regexp.0.dylib regexp.c

##### Microsoft Tools on Windows
cl /Gd regexp.c /I sqlite3 /DDLL /LD /link /export:sqlite3_extension_init /out:regexp.0.dylib

