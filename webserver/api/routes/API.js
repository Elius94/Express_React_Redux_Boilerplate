var express = require('express')
var router = express.Router()
const db = require('../integrations/db.js')
const fs = require('fs')
const { SM } = require('../integrations/session_manager')
const io = require('@pm2/io')

/** @const {number} - the version of the API */
const apiVersion = 1

/** @const {PMX.Meter} */
const api_post_req_meter = io.meter({
    name: 'API POST Frequency',
    id: 'app/requests/apipostfreq'
});

/** @const {PMX.Counter} */
const api_post_req_counter = io.counter({
    name: 'API POST Counter',
    id: 'app/realtime/apipostcount'
});

/** @const {PMX.Meter} */
const api_get_req_meter = io.meter({
    name: 'API GET Frequency',
    id: 'app/requests/apigetfreq'
});

/** @const {PMX.Counter} */
const api_get_req_counter = io.counter({
    name: 'API GET Counter',
    id: 'app/realtime/apigetcount'
});

/** @const {PMX.Meter} */
const api_put_req_meter = io.meter({
    name: 'API PUT Frequency',
    id: 'app/requests/apiputfreq'
});

/** @const {PMX.Counter} */
const api_put_req_counter = io.counter({
    name: 'API PUT Counter',
    id: 'app/realtime/apiputcount'
});

/** @const {PMX.Meter} */
const api_delete_req_meter = io.meter({
    name: 'API DELETE Frequency',
    id: 'app/requests/apideletefreq'
});

/** @const {PMX.Counter} */
const api_delete_req_counter = io.counter({
    name: 'API DELETE Counter',
    id: 'app/realtime/apideletecount'
});

/** 
 * @description Parses the Post request and returns the data in the body and in the header of the request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Object} - Returns the data in the body and in the header of the request as an object
 * @throws {Error} - Throws an error if the request is not a POST request or if the request body is not a JSON object or if the request header is not a JSON object
 * 
 * @info req.headers.api_name is the name of the API that is being called (e.g. 'try_login')
 * 
 */
async function apiPostParser(req, res, next) {
    if (typeof(req.headers.api_name) !== 'undefined') {
        let response = {}

        // Update the PM2 Meter
        api_post_req_meter.mark()
            // And Counter
        api_post_req_counter.inc()

        const api_name = req.headers.api_name
        if (api_name !== 'try_login') {
            const session_key = req.headers.session_key
            if (session_key !== 'guest' && !SM.checkSessionStatus(session_key)) {
                // Session is expired! Logging out
                console.log("[routes/api] Session key is expired, Logging out...")
                response = {
                    accepted: false,
                    logout: true,
                }
                res.status(200)
                res.send(JSON.stringify(response))
                res.end()
                return
            }
        }
        console.log("[routes/api] Received a client call of type POST - action '" + api_name + "' API...")
        switch (api_name) {
            case 'try_login':
                response = {
                    accepted: false,
                    message: '',
                    user_data: {}
                }
                if (typeof(req.body) === 'object') {
                    try {
                        const body = req.body
                        const db_response = await db.tryLogin(body.username, body.password, true)
                            // console.log('[routes/api/try_login]', db_response)
                        if (db_response !== false) {
                            response.accepted = true
                            response.message = 'Welcome! 😘'
                            response.user_data = db_response
                            response.user_data.session_key = SM.loadNewSession(body.username)
                            res.status(201)
                        } else {
                            res.status(404)
                            response.accepted = false
                            response.message = 'Wrong username or password... Are you a f**ing HACKER? 💩💩💩'
                        }
                    } catch (error) {
                        /**
                         * If you want to get error cause, log 'error': it is already
                         * a string error message
                         */
                        res.status(404)
                        response.accepted = false
                        response.message = 'Error in API call!'
                        response.user_data = null
                    } finally {
                        /**
                         * Send
                         */
                        res.send(JSON.stringify(response))
                    }
                }
                break
            case 'create_profile':
                response = {
                    accepted: false,
                    message: ''
                }
                if (typeof(req.body) === 'object') {
                    try {
                        const body = req.body
                        if (await db.validateApiRequest(req.headers.session_key, "manage_users")) {
                            const db_response = await db.createUser(body)
                            console.log(db_response)
                            if (db_response) {
                                response.accepted = true
                                response.message = 'OK'
                                res.status(201)
                            } else {
                                response.accepted = false
                                response.message = 'Error in API call!'
                                res.status(404)
                            }
                        } else {
                            response.accepted = false
                            response.message = 'Action not allowed!'
                            console.warn('Action not allowed! api_name:', api_name)
                            res.status(404)
                        }
                    } catch (error) {
                        response.accepted = false
                        response.message = 'Error in API call!'
                        response.analytics = null
                        res.status(404)
                    } finally {
                        res.send(JSON.stringify(response))
                    }
                }
                break
            case 'upload_image':
                response = {
                    accepted: false,
                    message: ''
                }
                if (typeof(req.body) === 'object') {
                    const block = req.body.file.split(';')
                    const imageData = block[1].split(',')[1]
                        // Save Planimetry file to uploads/planimetries folder
                    const imageBuffer = new Buffer.from(imageData, 'base64')
                    try {
                        if (req.headers.type === 'profilePic') {
                            fs.writeFileSync(`./uploads/users_profile_pics/${req.headers.file_name}`, imageBuffer)
                        }
                        response.accepted = true
                        response.message = 'OK'
                        res.status(201)
                        res.send(JSON.stringify(response))
                    } catch (e) {
                        console.error(e)
                        response.accepted = false
                        response.message = 'Error in API call!'
                        res.status(404)
                        res.send(JSON.stringify(response))
                        return
                    }
                }
                break
            default:
                break
        }
    } else {
        console.log(req.headers.api_name)
        const response = {
            accepted: false,
            message: 'Error in API call!'
        }
        res.status(404)
        res.send(JSON.stringify(response))
    }
    res.end()
}

/** 
 * @description Parses the Get request and returns the data in the body and in the header of the request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Object} - Returns the data in the body and in the header of the request as an object
 * @throws {Error} - Throws an error if the request is not a GET request or if the request body is not a JSON object or if the request header is not a JSON object
 * 
 * @info req.headers.api_name is the name of the API that is being called (e.g. 'try_login')
 * 
 */
async function apiGetParser(req, res, next) {
    if (typeof(req.headers.api_name) !== 'undefined') {
        let response = {}

        // Update the PM2 Meter
        api_get_req_meter.mark()
            // And Counter
        api_get_req_counter.inc()

        const api_name = req.headers.api_name
        const session_key = req.headers.session_key
        if (session_key !== 'guest' && !SM.checkSessionStatus(session_key)) {
            // Session is expired! Logging out
            console.log("[routes/api] Session key is expired, Logging out...")
            response = {
                accepted: false,
                logout: true,
            }
            res.status(200)
            res.send(JSON.stringify(response))
            res.end()
            return
        }
        console.log("[routes/api] Received a client call of type GET - action '" + api_name + "' API...")
        switch (api_name) {
            // Replace the following with your own API calls
            case 'get_table_data':
                response = {
                    accepted: false,
                    message: '',
                    table_data: {}
                }
                if (typeof(req.body) === 'object') {
                    try {
                        const body = req.query
                        if (await db.validateApiRequest(req.headers.session_key, "get_data")) {
                            const dbResponse = await db.getTableData(body.table)
                            if (dbResponse !== false) {
                                response.accepted = true
                                response.message = 'OK'
                                response.table_data = dbResponse
                                res.status(200)
                            } else {
                                response.accepted = false
                                response.message = 'Error in API call!'
                                response.table_data = null
                                res.status(404)
                            }
                        } else {
                            response.accepted = false
                            response.message = 'Action not allowed!'
                            console.warn('Action not allowed! api_name:', api_name)
                            res.status(404)
                        }
                    } catch (error) {
                        response.accepted = false
                        response.message = 'Error in API call!'
                        response.analytics = null
                        res.status(404)
                    } finally {
                        res.send(JSON.stringify(response))
                    }
                }
                break
            case 'get_userprofile_pic':
                if (typeof(req.body) === 'object') {
                    let response = undefined
                    try {
                        const body = req.query
                        if (await db.validateApiRequest(req.headers.session_key)) {
                            const db_response = await db.getUserProfilePic(body.username)
                                // console.log('[routes/api/get_userprofile_pic]', db_response)
                            let buff
                            if (db_response === null) { // Se è undefined restituisce l'icona generica
                                buff = fs.readFileSync('./uploads/users_profile_pics/default.png', { encoding: 'base64' })
                            } else if (typeof db_response === 'string') { // Altrimenti restituisce l'immagine del profilo
                                buff = fs.readFileSync(`./uploads/users_profile_pics/${db_response}`, { encoding: 'base64' })
                            }
                            response = buff
                            res.status(200)
                        } else {
                            response.accepted = false
                            response.message = 'Action not allowed!'
                            console.warn('Action not allowed! api_name:', api_name)
                            res.status(404)
                        }
                    } catch (err) {
                        response = {}
                        response.accepted = false
                        response.message = `Error in API call! ${err}`
                        response = JSON.stringify(response)
                        res.status(404)
                    } finally {
                        res.send(response)
                    }
                }
                break
            case 'get_users_list':
                response = {
                    accepted: false,
                    message: '',
                    users_list: {}
                }
                if (typeof(req.body) === 'object') {
                    try {
                        const body = req.query
                        if (await db.validateApiRequest(req.headers.session_key, "manage_users")) {
                            const db_response = await db.getUsersList(req.headers.session_key)
                                // console.log('[routes/api/get_alert_table]', db_response)
                                /**
                                 * Check getUsersList() return values: it always return
                                 * an array of DB records from 'users' table, never a boolean
                                 */
                            if (db_response !== false) {
                                response.accepted = true
                                response.message = 'OK'
                                response.users_list = db_response
                                res.status(200)
                            } else {
                                response.accepted = false
                                response.message = 'Error in API call!'
                                response.users_list = null
                                res.status(404)
                            }
                        } else {
                            response.accepted = false
                            response.message = 'Action not allowed!'
                            console.warn('Action not allowed! api_name:', api_name)
                            res.status(404)
                        }
                    } catch (error) {
                        response.accepted = false
                        response.message = 'Error in API call!'
                        response.users_list = null
                        res.status(404)
                    } finally {
                        res.send(JSON.stringify(response))
                    }
                }
                break
            default:
                break
        }
    } else {
        console.log(req.headers.api_name)
        const response = {
            accepted: false,
            message: 'Error in API call!'
        }
        res.status(404)
        res.send(JSON.stringify(response))
    }
    res.end()
}

/** 
 * @description Parses the Put request and returns the data in the body and in the header of the request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Object} - Returns the data in the body and in the header of the request as an object
 * @throws {Error} - Throws an error if the request is not a PUT request or if the request body is not a JSON object or if the request header is not a JSON object
 * 
 * @info req.headers.api_name is the name of the API that is being called (e.g. 'try_login')
 * 
 */
async function apiPutParser(req, res, next) {
    if (typeof(req.headers.api_name) !== 'undefined') {
        let response = {}

        // Update the PM2 Meter
        api_put_req_meter.mark()
            // And Counter
        api_put_req_counter.inc()

        const api_name = req.headers.api_name
        const session_key = req.headers.session_key
        if (session_key !== 'guest' && !SM.checkSessionStatus(session_key)) {
            // Session is expired! Logging out
            console.log("[routes/api] Session key is expired, Logging out...")
            response = {
                accepted: false,
                logout: true,
            }
            res.status(200)
            res.send(JSON.stringify(response))
            res.end()
            return
        }
        console.log("[routes/api] Received a client call of type PUT - action '" + api_name + "' API...")
        switch (api_name) {
            case 'update_selected_user':
                response = {
                    accepted: false,
                    message: ''
                }
                if (typeof(req.body) === 'object') {
                    try {
                        const body = req.body
                        if (await db.validateApiRequest(req.headers.session_key, "manage_users")) {
                            const db_response = await db.updateSelectedUser(body.myusername, body.myPassword, body.username, body.settings)
                                // console.log(db_response)
                            if (db_response !== false) {
                                response.accepted = true
                                response.message = 'OK'
                            } else {
                                response.accepted = false
                                response.message = 'Old password is wrong!'
                            }
                        } else {
                            response.accepted = false
                            response.message = 'Action not allowed!'
                            console.warn('Action not allowed! api_name:', api_name)
                        }
                    } catch (error) {
                        response.accepted = false
                        response.message = 'Error in API call!'
                        response.analytics = null
                    } finally {
                        res.send(JSON.stringify(response))
                    }
                }
                break
            case 'update_profile':
                response = {
                    accepted: false,
                    message: ''
                }
                if (typeof(req.body) === 'object') {
                    try {
                        const body = req.body
                        if (await db.validateApiRequest(req.headers.session_key)) {
                            const db_response = await db.updateUserProfile(body.username, body.email, body.filename, body.newPassword, body.oldPassword)
                                // console.log(db_response)
                            if (db_response !== false) {
                                response.accepted = true
                                response.message = 'OK'
                            } else {
                                response.accepted = false
                                response.message = 'Old password is wrong!'
                            }
                        } else {
                            response.accepted = false
                            response.message = 'Action not allowed!'
                            console.warn('Action not allowed! api_name:', api_name)
                        }
                    } catch (error) {
                        response.accepted = false
                        response.message = 'Error in API call!'
                        response.analytics = null
                    } finally {
                        res.send(JSON.stringify(response))
                    }
                }
                break
            default:
                break
        }
    } else {
        console.log(req.headers.api_name)
        const response = {
            accepted: false,
            message: 'Error in API call!'
        }
        res.send(JSON.stringify(response))
    }
    res.end()
}

/** 
 * @description Parses the Delete request and returns the data in the body and in the header of the request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Object} - Returns the data in the body and in the header of the request as an object
 * @throws {Error} - Throws an error if the request is not a DELETE request or if the request body is not a JSON object or if the request header is not a JSON object
 * 
 * @info req.headers.api_name is the name of the API that is being called (e.g. 'try_login')
 * 
 */
async function apiDeleteParser(req, res, next) {
    if (typeof(req.headers.api_name) !== 'undefined') {
        let response = {}

        // Update the PM2 Meter
        api_delete_req_meter.mark()
            // And Counter
        api_delete_req_counter.inc()

        const api_name = req.headers.api_name
        const session_key = req.headers.session_key
        if (session_key !== 'guest' && !SM.checkSessionStatus(session_key)) {
            // Session is expired! Logging out
            console.log("[routes/api] Session key is expired, Logging out...")
            response = {
                accepted: false,
                logout: true,
            }
            res.status(404)
            res.send(JSON.stringify(response))
            res.end()
            return
        }
        console.log("[routes/api] Received a client call of type DELETE - action '" + api_name + "' API...")
        switch (api_name) {
            case 'logout':
                response = {
                    accepted: false,
                    message: '',
                }
                if (typeof(req.body) === 'object') {
                    try {
                        const body = req.body
                        let ret = SM.deleteSession(req.headers.session_key)
                        if (ret !== false) {
                            response.accepted = true
                            response.message = 'Bye Bye! 😘'
                            res.status(200)
                        } else {
                            response.accepted = false
                            response.message = 'Connection refused!'
                            res.status(404)
                        }
                    } catch (error) {
                        /**
                         * If you want to get error cause, log 'error': it is already
                         * a string error message
                         */
                        response.accepted = false
                        response.message = 'Error in API call!'
                        res.status(404)
                    } finally {
                        /**
                         * Send
                         */
                        res.send(JSON.stringify(response))
                    }
                }
                break
            case 'delete_user':
                response = {
                    accepted: false,
                    message: ''
                }
                if (typeof(req.body) === 'object') {
                    try {
                        const body = req.body
                        if (await db.validateApiRequest(req.headers.session_key, "manage_users")) {
                            const db_response = await db.deleteUser(body.username)
                            console.log(db_response)
                            if (db_response) {
                                response.accepted = true
                                response.message = 'OK'
                                res.status(200)
                            } else {
                                response.accepted = false
                                response.message = 'Error in API call!'
                                res.status(404)
                            }
                        } else {
                            response.accepted = false
                            response.message = 'Action not allowed!'
                            console.warn('Action not allowed! api_name:', api_name)
                            res.status(404)
                        }
                    } catch (error) {
                        response.accepted = false
                        response.message = 'Error in API call!'
                        response.analytics = null
                        res.status(404)
                    } finally {
                        res.send(JSON.stringify(response))
                    }
                }
                break
            default:
                break
        }
    } else {
        console.log(req.headers.api_name)
        const response = {
            accepted: false,
            message: 'Error in API call!'
        }
        res.status(404)
        res.send(JSON.stringify(response))
    }
    res.end()
}

router.post(`/v${apiVersion}/`, apiPostParser)
router.get(`/v${apiVersion}/`, apiGetParser)
router.delete(`/v${apiVersion}/`, apiDeleteParser)
router.put(`/v${apiVersion}/`, apiPutParser)

module.exports = router