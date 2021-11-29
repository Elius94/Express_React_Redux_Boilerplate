const SessionManager = require('users-session-manager')
const { notifyClientToLogout, notifyAllClientsToLogout } = require('../servers/socketio_server')
const io = require('@pm2/io')
const SESSION_TIMEOUT = 3600 // Seconds of session elapsing time

const SM = new SessionManager()

let skIo = null // Reference to the socket IO http server
SM.setSessionTimeOut(SESSION_TIMEOUT)

// The PM2 IO metrics to monitor the number of connected users
const realtimeUser = io.counter({
    name: 'Realtime Users',
    id: 'app/realtime/users',
})

io.action('Log all clients out', (cb) => {
    notifyAllClientsToLogout(skIo)
    SM.deleteAllSessions()
    return cb({ result: 'ok' })
})

io.action('Get logged users', (cb) => {
    let ursersList = SM.getLoggedUsers()
    return cb({ ursersList })
})

SM.on('sessionCreated', (session) => {
    realtimeUser.inc()
})

SM.on('sessionDeleted', (session) => {
    realtimeUser.dec()
})

SM.on('notifyClientToLogout', (io, key) => {
    notifyClientToLogout(io, key)
})

SM.on('error', (err) => {
    console.error('Session Manager error: ', err)
})

module.exports = {
    SM
}