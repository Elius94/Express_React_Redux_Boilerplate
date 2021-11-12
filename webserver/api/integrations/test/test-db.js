/**
 * This module tests DB api functions by DROPPING existing database,
 * recreating it and populating it with fake data
 */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const expect = chai.expect

const md5 = require('md5')
const dbUtils = require('../db_utils.js')
const initDb = require('../init-db.js')
const faker = require('../faker.js')
const db = require('../db.js')

describe('Database public and private API tests', () => {
    /* Before running all tests */
    before(async function() {
        await initDb.dropDb()
        console.log('[test] DB dropped')
        await initDb.createDb()
        console.log('[test] DB created')
        await initDb.addDbSchema(false)
        console.log('[test] added DB schema')
        await faker.loadFakeData()
        console.log('[test] filled DB with fake data')
    })

    /* tryLogin */
    it('[tryLogin] should get "mariolone" credentials', async() => {
        const res = await db.tryLogin('mariolone', md5('mariolone'), true)
        console.log('[test] tryLogin res is', res)
    })

    it('[tryLogin] fail login with NON existing username', async() => {
        const res = await db.tryLogin('giacobbo', md5('andrea'), true)
            // console.log('[test] tryLogin res is', res)
        expect(res).to.be.false
    })

    it('[tryLogin] fail login with NON existing password', async() => {
        const res = await db.tryLogin('mariolone', md5('sgurzo'), true)
            // console.log('[test] tryLogin res is', res)
        expect(res).to.be.false
    })

    /* After running all tests */
    after(async function() {
        // await DevDb.dropDb();
        await db.closePool()
        console.log('[test] released all clients in pool')
    })
})