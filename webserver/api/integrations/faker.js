require('dotenv').config()

const { Pool } = require('pg')
const fakeData = require('./fake-data/fake-data.js').fakeData
const md5 = require('md5')

const dbConnectionConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 5432
}

/**
 * @description Load fake data into the database
 * @param {Pool} pool - database connection pool
 * @returns {Promise} - promise of the database query
 * @example loadFakeDataset(pool)
 * @example loadFakeDataset(pool).then(res => console.log(res))
 * @example loadFakeDataset(pool).catch(err => console.error(err))
 * @example loadFakeDataset(pool).finally(() => pool.end())
 * @throws {Error} - if the database query fails
 */
async function loadFakeDataset(pool) {
    const dataset = fakeData.dataset
    const text = 'INSERT INTO dataset(nome, zona, altitudine) ' +
        'VALUES($1, $2, $3);'
    for (const datarow of dataset) {
        const query = { text, values: datarow }
        try {
            await pool.query(query)
                // console.log(`[sites] inserted ${site}`);
        } catch (err) {
            console.error('[fake] failed to load datasets')
            console.error(err)
            throw err
        }
    }
}

async function loadFakeUsers(pool) {
    const users = fakeData.users
    const newUserQueryText = 'INSERT INTO users ' +
        '(username, password, email, ' +
        'users_management, dataset_management, user_disabled) ' +
        'VALUES ($1, $2, $3, $4, $5, $6);'
    try {
        for (const user of users) {
            /* Add new fake user */
            await pool.query({
                text: newUserQueryText,
                values: [
                    user[0], md5(user[1]),
                    user[2], user[3], user[4], user[5]
                ]
            })
        }
    } catch (err) {
        console.error('[fake] failed to load users')
        console.error(err)
        throw err
    }
}

async function loadFakeData() {
    const pool = new Pool(dbConnectionConfig)
    try {
        // console.log('[fake] start loading fake data...')
        await loadFakeDataset(pool)
            // console.log('[fake] sites added')
        await loadFakeUsers(pool)
            // console.log('[fake] devices added')
    } catch (err) {
        console.error(err)
        throw err
    } finally {
        pool.end()
    }
}

module.exports = { loadFakeData }