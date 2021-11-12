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

;
(async() => {
    console.log('[test-init-fake-db] dropping db')
    await initDb.dropDb()
    console.log('[test-init-fake-db] creating db')
    await initDb.createDb()
    console.log('[test-init-fake-db] adding db schema')
    await initDb.addDbSchema(false)
    console.log('[test-init-fake-db] loading fake data')
    await faker.loadFakeData()
})()