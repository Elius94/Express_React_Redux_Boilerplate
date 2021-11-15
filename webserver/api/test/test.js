var assert = require('assert');
const md5 = require('md5');
const db = require('../integrations/db')

// test the function tryLogin with chai and mocha (https://www.chaijs.com/api/bdd/)
describe('tryLogin', () => {
    it('should return the user data', async() => {
        const loginData = await db.tryLogin("mariolone", md5("mariolone"))
        assert.equal(loginData.username, "mariolone")
    })
    it('should return false because the user password is wrong', async() => {
        const loginData = await db.tryLogin("mariolone", md5("wrongpass"))
        assert.equal(loginData, false)
    })
    it("should return false because the user doesn't exists", async() => {
        const loginData = await db.tryLogin("gianni", md5("giannipass"))
        assert.equal(loginData, false)
    })
})