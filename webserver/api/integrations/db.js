#!/usr/bin/env node

'use strict'

const { Pool } = require('pg')
const dbUtils = require('./db_utils.js')
const { getUsernameFromSessionKey } = require('./session_manager.js')
const io = require('@pm2/io')

const query_meter = io.meter({
    name: 'PG Query Frequency',
    id: 'app/requests/queryfreq'
});

/**
 * Importing DB connection credentials from my environment: .config()
 * will load my env variables in process.env
 */
require('dotenv').config()

/* Define following object in order to pass it to Pool constructor */
const dbConnectionConfig = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT || 5432
            /* Occasionally tune three parameters below */
            // max: process.env.DB_MAX_CLIENTS || 10,
            // idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT_CLIENT || 0,
            // connectionTimeoutMillis: process.env.DB_CONN_TIMEOUT_CLIENT || 10000
    }
    // console.log(dbConnectionConfig)

const pool = new Pool(dbConnectionConfig)

pool.on('query', query => {
    query_meter.mark()
})

pool.on('connect', client => {
    // (`[pool] client connect : total clients ${pool.totalCount}, idle clients ${pool.idleCount}, queued requests ${pool.waitingCount}`)
})

pool.on('acquire', client => {
    // (`[pool] client aquired: total clients ${pool.totalCount}, idle clients ${pool.idleCount}, queued requests ${pool.waitingCount}`)
})

pool.on('error', ( /* err, */ client) => {
    // console.error('[pool]', err)
    // (`[pool] client error: total clients ${pool.totalCount}, idle clients ${pool.idleCount}, queued requests ${pool.waitingCount}`)
})

pool.on('remove', client => {
    // (`[pool] client removed: total clients ${pool.totalCount}, idle clients ${pool.idleCount}, queued requests ${pool.waitingCount}`)
})

/***********************
 *   DB API functions  *
 **********************/

/**
 * @async
 * @TODO document output object
 * @description Try to login with provided credentials
 * @param {string} username User name
 * @param {string} password User password
 * @param {boolean} [pre_md5=false] If true, input password will be
 * pre-computed with md5; if false, input password will NOT be pre-
 * computed with md5
 * @throws Will throw if query to DB will fail
 * @returns {(Promise<Object>|Promise<boolean>)} If user exists in DB,
 * return infos about user (its site, role, username, password, email
 * and path, level, name of the site he belongs to)
 */
async function tryLogin(username, password, preMd5 = false) {
    const getUserQuery = {
        /* Prepared statement */
        name: 'fetch-user_' + username,
        /* text: `SELECT u.site_id, u.username, u.email, u.profile_pic_path,
                r.role_name, r.users_management, r.sites_management,
                r.devices_management, r.notifications_management
                FROM users AS u INNER JOIN roles AS r on u.role_id = r.id
                    WHERE username = $1 AND
                        password = $2 AND
                        user_disabled = false;`, */
        text: 'SELECT username, email, profile_pic_path, ' +
            'user_disabled, users_management, dataset_management ' +
            'FROM users WHERE username = $1 AND ' +
            'password = $2 AND user_disabled = false;',
        values: [username, preMd5 ? password : md5(password)]
    }

    /* Will be boolean or Object typed */
    let loginRes
    try {
        /* dbRes is a temp variable scope limited to try/catch */
        const dbRes = await pool.query(getUserQuery)
            // console.log('[tryLogin]', dbRes.rows);
        if (dbRes.rows.length === 0) {
            loginRes = false
        } else {
            /* Save site ID logged user belongs to for later */
            loginRes = JSON.parse(JSON.stringify(dbRes.rows[0]))
                // console.log('[tryLogin] AGGIUNGERE A QST OBJ', loginRes);
                /* Add extra infos about the site the user belongs to */
        }
    } catch (err) {
        throw err.message
    }

    return loginRes
}

/**
 * @async
 * @description Given a username, get its profile picture
 * @param {string} username Get username of this user
 * @throws {string} Will throw if query to DB will fail
 * @returns {Promise<string|null|undefined>} Return the user profile pic path if
 * provided username does exist: if user has a profile pic, return a string;
 * if user has no profile pic, return null; if user does not exist, return
 * undefined
 */
async function getUserProfilePic(username) {
    const query = {
        text: 'SELECT profile_pic_path ' +
            'FROM users WHERE username = $1;',
        values: [username]
    }
    let userProfilePicPath
    try {
        const userProfilePicPathRes = await pool.query(query)
            // console.log('[getUserProfilePic]', userProfilePicPathRes.rows)
        if (!userProfilePicPathRes.rows.length) {
            userProfilePicPath = undefined
        } else {
            /* This may be a string or null */
            userProfilePicPath = userProfilePicPathRes.rows[0].profile_pic_path
        }
    } catch (err) {
        console.error(err)
        throw err.message
    }
    // if (userProfilePicPath === null || userProfilePicPath === '') {
    //     userProfilePicPath = undefined
    // }
    return userProfilePicPath
}

/**
 * @async
 * @description Get all data from a table
 * @param {string} tab Table name
 * @throws Will throw if query to DB will fail
 * @returns {Promise<Array>} Return an array of objects containing all data
 * from the table
 */
async function getTableData(tab) {
    // console.log('[getTreeView] input', siteId);
    let checkRes = false
    const res = []
    const dataQuery = {
        text: `select * from $1;`,
        values: [tab]
    }
    try {
        const res = await pool.query(dataQuery)
        checkRes = res.rowCount > 0
        if (checkRes) {
            return res.rows
        }
    } catch (err) {
        console.error(err)
        throw err.message
    }
    // console.log('[getTreeView] final res:', res);
    return res
}

/** make the docstring of createUser():
 * @async   
 * @description Create a new user
 * @param {string} username User name
 * @param {string} password User password
 * @param {string} email User email
 * @param {string} profilePicPath User profile picture path
 * @throws Will throw if query to DB will fail
 * @returns {Promise<boolean>} Return true if user has been created, false
 */
async function createUser(inputs) {
    let insertRes = false
    try {
        if ('permissions' in inputs) {
            inputs.users_management = inputs.permissions.users_management
            inputs.dataset_management = inputs.permissions.dataset_management
            delete inputs.permissions
        }

        /* Creating new user */
        const { text, values } = dbUtils.buildInsertQuery('users', inputs)
        const res = await pool.query({ text, values })
        insertRes = res.rowCount === 1
    } catch (err) {
        console.error(err)
        throw err.message
    }
    return insertRes
}

/**
 * @async
 * @description Delete a user
 * @param {string} username User name
 * @throws Will throw if query to DB will fail
 * @returns {Promise<boolean>} Return true if user has been deleted, false
 * otherwise
 * @TODO check if user is admin and if he is, throw error
 * @TODO check if user is logged and if he is, throw error
 * @TODO check if user is disabled and if he is, throw error
 */
async function deleteUser(username) {
    const query = {
        text: 'UPDATE users SET user_disabled = TRUE ' +
            'WHERE username = $1',
        values: [username]
    }
    let updateRes
    try {
        const res = await pool.query(query)
        updateRes = res.rowCount === 1
    } catch (err) {
        console.error(err)
        throw err.message
    }
    return updateRes
}

/**
 * Function to update profile informations
 *
 * @param {string} username
 * @param {string} email
 * @param {string/md5} newPassword
 * @param {string/md5} oldPassword
 * @return {*}
 */
async function updateUserProfile(username, email, filename, newPassword, oldPassword) {
    // Check if oldPassword is OK
    let checkRes = false
    const checkQuery = {
        text: 'SELECT id FROM users WHERE username = $1 AND password = $2',
        values: [username, oldPassword]
    }
    try {
        const res = await pool.query(checkQuery)
        checkRes = res.rowCount === 1
    } catch (err) {
        console.error(err)
        throw err.message
    }
    if (checkRes) {
        let updateRes = false
        let updateQuery
        if (newPassword) {
            if (filename) {
                updateQuery = {
                    text: 'UPDATE users SET email = $1, profile_pic_path = $2, password = $3 WHERE username = $4',
                    values: [email, filename, newPassword, username]
                }
            } else {
                updateQuery = {
                    text: 'UPDATE users SET email = $1, password = $2 WHERE username = $3',
                    values: [email, newPassword, username]
                }
            }
        } else {
            if (filename) {
                updateQuery = {
                    text: 'UPDATE users SET email = $1, profile_pic_path = $2 WHERE username = $3',
                    values: [email, filename, username]
                }
            } else {
                updateQuery = {
                    text: 'UPDATE users SET email = $1 WHERE username = $2',
                    values: [email, username]
                }
            }
        }
        try {
            const res = await pool.query(updateQuery)
            updateRes = res.rowCount === 1
        } catch (err) {
            console.error(err)
            throw err.message
        }
        return updateRes
    }
    return false
}

/**
 * TODO Funzione per cambiare i parametri di un utente selezionato
 *
 * @param {string} myUsername Username dell'utente che esegue l'azione
 * @param {string/md5} myPassword Password relativa
 * @param {string} username Username dell'utente da modificare
 * @param {object} settings Oggetto che contiene i parametri da modificare con i nomi dei campi sul DB
 * @return {boolean}
 */
async function updateSelectedUser(myUsername, myPassword, username, settings) {
    let res = false
    try {
        // controlla se utente che vuole modificare esiste
        const checkModifyingUser = await pool.query({
            text: 'SELECT * FROM users ' +
                'WHERE username = $1 AND password = $2;',
            values: [myUsername, myPassword]
        })
        if (checkModifyingUser.rows.length === 0) {
            return false
        }

        // modifica utente descritto in 'settings'
        const updateUserQuery = dbUtils.buildUpdateQuery(
            'users', // table name
            settings, // inputs
            {
                columnName: 'username',
                columnValue: username
            } // WHERE condition
        )
        const updateRes = await pool.query(updateUserQuery)
        res = updateRes.rowCount === 1
    } catch (err) {
        console.error(err)
        throw err.message
    }
    return res
}

/** 
 * @async
 * @description Validate the session key
 * @param {string} sessionKey Session key
 * @param {string} action Action to validate
 * @throws Will throw if query to DB will fail
 * @returns {Promise<boolean>} Return true if session key is valid, false otherwise
 */
async function validateApiRequest(sessionKey, action = undefined) {
    if (sessionKey === 'guest') {
        if (action === 'get_data') {
            return false
        }
        return true
    }
    const username = getUsernameFromSessionKey(sessionKey)
    if (username) {
        let user_data = undefined
        const query_user_id = {
            text: 'SELECT users_management, dataset_management ' +
                'FROM users WHERE username = $1;',
            values: [username]
        }
        try {
            const userIdRes = await pool.query(query_user_id)
                // console.log('[getUserProfilePic]', userProfilePicPathRes.rows)
            if (!userIdRes.rows.length) {
                user_data = undefined
                return false
            } else {
                /* This may be a string or null */
                user_data = userIdRes.rows[0]
            }
        } catch (err) {
            console.error(err)
            throw err.message
        }
        switch (action) {
            case "manage_users":
                {
                    if (user_data.users_management === true)
                        return true
                }
                break
            case "manage_dataset":
                {
                    if (user_data.dataset_management === true)
                        return true
                }
                break
            case "get_data":
                {
                    /*const availableSectors = await getAvailableSectorsForUser(username)
                    if (availableSectors.includes(sector) || availableSectors === "ALL")
                        return true*/
                }
                break
            default:
                return true
        }
    }
    return false
}

/**
 * @async
 * @description Given site, return users belonging to that site
 * but do not return user calling this function.
 * Return false if provided session key does not match any users
 * @param {*} sessionKey
 * @param {number|string} siteId
 * @returns {Promise<Array<pg.QueryResult>>|Promise<boolean>}
 */
async function getUsersList(sessionKey) {
    const users = []
    const username = getUsernameFromSessionKey(sessionKey)
    if (username === false) {
        console.error('[getUsersList] session key', sessionKey,
            'is not associated to any user, returning')
        return false
    }
    try {
        const res = await pool.query({
            text: 'SELECT username, email, profile_pic_path, ' +
                'user_disabled, users_management, dataset_management ' +
                'FROM users '
        })
        for (const user of res.rows) {
            if (!["system", "admin"].includes(user.username))
                users.push(user)
        }
    } catch (err) {
        console.error(err)
        throw err.message
    }
    return users
}

module.exports = {
    createUser,
    deleteUser,
    getTableData,
    getUserProfilePic,
    getUsersList,
    tryLogin,
    updateSelectedUser,
    updateUserProfile,
    validateApiRequest
}

/**
 * NODE_ENV env variable should be set in order to expose methods
 * that normally are never exposed: exposing hidden methods is
 * used during testing phase, where ALL functions here should be
 * tested.
 */
if (process.env.NODE_ENV === 'test') {
    module.exports.closePool = async() => await pool.end
}