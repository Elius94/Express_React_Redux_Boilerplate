const { Pool } = require('pg')
const pgtools = require('pgtools')

const md5 = require('md5')

require('dotenv').config({ path: '../.env' })

function badException(error) {
    return error.message.includes('already exists') === false
}

function getDbEntityName(str) {
    return str.split('(')[0].split('"')[1]
}

const dbConnectionConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 5432
}

const pgtoolsConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 5432
}

console.log(dbConnectionConfig);
console.log(pgtoolsConfig);

const pool = new Pool(dbConnectionConfig)

/**
 * @description Add the db extensions with the definition file
 * @returns {Promise<void>} Promise 
 * @memberof init-db 
 * @function addDbExtensions 
 *
 */
async function addDbExtensions() {
    const { extensions } =
    require('./db-definitions/extensions.js')
    let extensionQuery
    try {
        for (extensionQuery of extensions) {
            await pool.query(extensionQuery)
        }
    } catch (err) {
        if (badException(err)) {
            console.error('[init] failed to add extensions')
            console.error(err)
            throw err
        } else {
            console.log(`[init] ${extensionQuery} alredy exists.`)
        }
    }
}

/**
 * @description Add the db Enums with the definition file
 * @returns {Promise<void>} Promise 
 * @memberof init-db 
 * @function addDbEnums 
 *
 */
async function addDbEnums() {
    const { enums } =
    require('./db-definitions/enumerations.js')
    let enumName
    try {
        for (const enumQuery of enums) {
            enumName = getDbEntityName(enumQuery)
            await pool.query(enumQuery)
        }
    } catch (err) {
        console.log(err.message);
        if (badException(err)) {
            console.error('[init] failed to add enums')
            console.error(err)
            throw err
        } else {
            console.log(`[init] "${enumName}" already exists.`)
        }
    }
}

/**
 * @description Add the db Tables with the definition file
 * @returns {Promise<void>} Promise 
 * @memberof init-db 
 * @function addDbTables
 *
 */
async function addDbTables() {
    const { tables } = require('./db-definitions/tables.js')
    let tableName
    try {
        for (const tableQuery of tables) {
            tableName = getDbEntityName(tableQuery)
            await pool.query(tableQuery)
        }
    } catch (err) {
        if (badException(err)) {
            console.error('[init] failed to add table')
            console.error(err)
            throw err
        } else {
            console.log(`[init] "${tableName}" already exists.`)
        }
    }
}

/**
 * @description Add the Admin user
 * @returns {Promise<void>} Promise 
 * @memberof init-db 
 * @function addAdminUser
 *
 */
async function addAdminUser() {
    try {
        await pool.query({
            text: 'INSERT INTO users ' +
                '(username, password, email, ' +
                'users_management, dataset_management, user_disabled) ' +
                'VALUES ($1, $2, $3, $4, $5, $6);',
            values: ['admin', md5('admin'), 'admin@email.com', true, true, false]
        })
    } catch (err) {
        console.error('[init] failed to add first user (admin)')
        console.error(err)
        throw err
    }
}

/**
 * @description Initialize the database
 * @returns {Promise<void>} Promise 
 * @memberof init-db 
 * @function initDb
 *
 */
async function addDbSchema(emptyDb = false) {
    try {
        await addDbExtensions()
        await addDbEnums()
        await addDbTables()
        if (emptyDb === false) {
            await addAdminUser()
            console.log('added admin user')
        }
    } catch (err) {
        console.error('Init DB failed!')
        console.error(err)
        console.error('Throwing exception to caller...')
        throw err
    } finally {
        pool.end()
        console.log('pool: existing clients:', pool.totalCount)
        console.log('pool: idle clients:', pool.idleCount)
        console.log('pool: waiting clients:', pool.waitingCount)
    }
}

/**
 * @description Create the Db
 * @returns {Promise<void>} Promise
 * @memberof init-db
 * @function createDb
 *
 */
async function createDb() {
    try {
        await pgtools.createdb(pgtoolsConfig, dbConnectionConfig.database, function(err, res) {
            if (err) {
                console.error(err);
                process.exit(-1);
            }
            console.log(res);
        })
    } catch (err) {
        console.error(err)
    }
}

/**
 * @description Drop all database
 * @returns {Promise<void>} Promise
 * @memberof init-db
 * @function dropDb
 * 
 */
async function dropDb() {
    try {
        console.log('lo faccio')
        await pgtools.dropdb(pgtoolsConfig, dbConnectionConfig.database, function(err, res) {
            if (err) {
                console.error(err);
                process.exit(-1);
            }
            console.log(res);
        })
        console.log('fatto')
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    addDbSchema,
    createDb,
    dropDb,
}