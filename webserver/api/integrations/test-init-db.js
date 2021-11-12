#!/usr/bin/env node

const initDb = require('./init-db.js')
console.log(initDb);
(async() => {
    try {
        console.log('[main] dropping db')
        await initDb.dropDb()
        console.log('[main] creating db')
        await initDb.createDb()
        console.log('[main] adding schema')
        await initDb.addDbSchema(false)
    } catch (err) {
        console.error('[main]', err)
    }
})()