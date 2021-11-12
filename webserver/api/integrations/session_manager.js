const generate = require('meaningful-string')
const { notifyClientToLogout, notifyAllClientsToLogout } = require('../servers/socketio_server')
const io = require('@pm2/io')
const SESSION_TIMEOUT = 3600 // Seconds of session elapsing time

// The PM2 IO metrics to monitor the number of connected users
const realtimeUser = io.counter({
    name: 'Realtime Users',
    id: 'app/realtime/users',
})

let options = {
    "min": 20,
    "max": 30,
    "capsWithNumbers": true
}
var m_options = {
    "numberUpto": 60,
    "joinBy": '-'
}

let sessions = [] // Sessions collection
let skIo = null // Reference to the socket IO http server

/**
 * Function used to copy the Socket IO http server reference
 *
 * @param {*} ioRef
 */
function initSocketReference(ioRef) {
    skIo = ioRef
}

io.action('Log all clients out', (cb) => {
    notifyAllClientsToLogout(skIo)
    return cb({ result: 'ok' })
})

io.action('Get logged users', (cb) => {
    let ursersList = Object.keys(sessions).map((k, i) => {
        return sessions[Object.keys(sessions)[i]].username
    })
    return cb({ ursersList })
})

/**
 * Function to add users sessions in this module. Use it at login
 *
 * @param {string} username The username provided on successful login
 * @return {string} user unique key
 */
function loadNewSession(username) { // Generate new session
    console.log('[Session Manager]: New session saved! 😉')
    const newSessionKey = `${generate.meaningful(m_options)}_${generate.random(options)}`
    sessions[newSessionKey] = {
        username,
        key: newSessionKey,
        timer: createNewSessionTimer(newSessionKey, username)
    }
    realtimeUser.inc();
    // console.log("[Session Manager]: Active sessions:", sessions)
    return newSessionKey
}

/**
 * Function to delete users sessions in this module. Use it at client logout
 *
 * @param {string} key The session_key provided on successful login
 * @return {boolean} true or false, true if ok
 */
function deleteSession(key) { // Generate new session
    console.log('[Session Manager]: Deleting session! 😉')
    let ret = false
    try {
        if (checkSessionStatus(key)) {
            clearTimeout(sessions[key].timer)
            delete sessions[key]
            ret = true
            realtimeUser.dec();
        }
    } catch (error) {
        console.log(error.message)
        io.notifyError(new Error(`[Session Manager]: Deleting session`), {
            // or anything that you can like an user id
            error
        })
        ret = false
    }
    return ret
}

/**
 * Use this to notify the client to logout with WebSocket
 *
 * @param {string} key The session_key
 */
function sendLogoutMessage(key) {
    notifyClientToLogout(skIo, key)
}

/**
 * Function to return a new setTimeout object and start it.
 *
 * @param {string} key The session_key
 * @param {string} username The username, only for logging features
 * @return {NodeJS.Timeout}
 */
function createNewSessionTimer(key, username) {
    return setTimeout((_key, _username) => {
        sendLogoutMessage(_key) // Session is expired... logging out
        delete sessions[_key]
        realtimeUser.dec();
        console.log('[Session Manager]: Removed user', _username)
    }, SESSION_TIMEOUT * 1000, key, username)
}

/**
 * Function to check if a key is valid and exists in the stored collection
 * Use this before every API.js function execution.
 *
 * @param {string} key the user key generated at login
 * @return {boolean} true or false: true if session is active
 */
function checkSessionStatus(key) {
    console.log(key)
    if (sessions[key]) {
        console.log('[Session Manager]: Session accepted! 👍')
        return true
    }
    console.log('[Session Manager]: ⚠ !Session rejected! ⚠')
    return false
}

/**
 * @description Function to return the username from a session key
 * @param {string} key the user key generated at login
 * @return {string|boolean} username or false if session is not active 
 * @throws {Error} if session key is not valid
 * @throws {Error} if session key is not found
 * @throws {Error} if session key is expired
 * @throws {Error} if session key is not found
 * 
 */
function getUsernameFromSessionKey(key) {
    if (sessions[key]) {
        return sessions[key].username
    }
    console.log('[Session Manager]: Session not found...')
    return false
}

module.exports = {
    initSocketReference,
    sendLogoutMessage,
    loadNewSession,
    deleteSession,
    checkSessionStatus,
    getUsernameFromSessionKey
}