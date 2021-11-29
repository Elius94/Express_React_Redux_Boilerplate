#!/usr/bin/env node

const initDb = require('./init-db.js')
const faker = require('./faker.js')

const pgConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'proto-webapp-db',
    password: 'database',
    port: process.env.DB_PORT || 5432
};

const pgtoolsConfig = {
    user: 'postgres',
    host: 'localhost',
    password: 'database',
    port: process.env.DB_PORT || 5432
};

/**
 * @description Initialize the database with fake data
 * comment dropDb() if the database does not exist
 * createDb() creates the database
 * addDbSchema(false) adds the schema to the database
 * loadFakeData() loads fake data into the database taken from ./fake-data/fake-data.js
 */
(async() => {
    try {
        //console.log('[test-init-fake-db] dropping db')
        //await initDb.dropDb()
        console.log('[test-init-fake-db] creating db')
        await initDb.createDb()
        console.log('[test-init-fake-db] adding db schema')
        await initDb.addDbSchema(false)
        console.log('[test-init-fake-db] loading fake data')
        await faker.loadFakeData()
    } catch (err) {
        console.error('[main]', err)
    }
})()