const http = require('http')
const debug = require('debug')('api:server')

/**
 * Call this function to force specific browser to log out
 *
 * @param {SocketIO.Server} io
 * SocketIO server to call this on
 * @param {string} key
 * session_key of the user
 */
function notifyClientToLogout(io, key) {
    console.debug(`Session is expired for key ${key}... Logging out now!`)
    io.in(key).emit('logout')
}

/**
 * Call this function to force all browsers to log out
 *
 * @param {SocketIO.Server} io
 * SocketIO server to call this on
 */
function notifyAllClientsToLogout(io) {
    console.debug(`Logging out now!`)
    io.emit('logout')
}

/**
 * Event listener for HTTP server "error" event.
 * @param {*} error
 * Error variable
 * @param {*} port
 * Port the HTTP server is listening on
 */
function onError(error, port) {
    if (error.syscall !== 'listen') {
        throw error
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
                // break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
                // break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 * @param {*} server
 * Server handle
 */
function onListening(server) {
    var addr = server.address()
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port
    debug('Listening on ' + bind)
}

/**
 * Create and start an ioSocket server
 * @param {*} app
 * "Express" handle
 * @param {*} port
 * Port the server should listen on
 * @returns {SocketIO.Server}
 * The newly created server
 */
function startServer(app, port) {
    // Create an http server
    const server = http.createServer(app)
    server.listen(port)
    server.on('error', function(error) { onError(error, port) })
    server.on('listening', function() { onListening(server) })

    // Create the socketIO server
    //const io = require('socket.io')(server)
    const ENDPOINT = `http${process.env.REACT_APP_USE_HTTPS === 'yes' ? "s" : ""}://${process.env.REACT_APP_BK_IPV4_ADDRESS}:3000`;
    const { Server } = require("socket.io");
    const io = new Server(server, {
        cors: {
            origin: ENDPOINT,
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (sk) => {
        console.log('Browser Connected!')
        sk.on('session_key', async function(data) {
            const key = data.session_key
            console.log(`User ${data.user} joined key ${key}`)
            sk.join(key)
        })
    })

    return io
}

module.exports = {
    startServer,
    notifyClientToLogout,
    notifyAllClientsToLogout
}