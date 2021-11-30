import { io } from "socket.io-client";
const ENDPOINT = `http${process.env.REACT_APP_USE_HTTPS === 'yes' ? "s" : ""}://${process.env.REACT_APP_BK_IPV4_ADDRESS}:9001`;
const API_ROUTE = "/API/"
const API_VERSION = "v1/"
let md5 = require('md5')
let socket = undefined
let session_key = 'guest'

// Function to build the GET query string from body object, using encoding (for API calls) starting with ?
function BuildQueryString(body) {
    let queryString = "?"
    for (let key in body) {
        queryString += encodeURIComponent(key) + "=" + encodeURIComponent(body[key])
        if (key !== Object.keys(body).pop())
            queryString += "&"
    }
    return queryString
}

async function Logout(self = false) {
    if (self) {
        //console.log(ENDPOINT)
        let credentials = {
            session_key
        }
        const rawResponse = await fetch(ENDPOINT + API_ROUTE + API_VERSION, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'session_key': session_key,
                'api_name': 'logout'
            },
            body: JSON.stringify(credentials)
        })
        const response = await rawResponse.json()
        if (response.accepted) {
            localStorage.clear()
            console.log("Logging Out... ", response.message)

            setTimeout(() => window.location.reload(), 500)
        }
    } else {
        localStorage.clear()
        console.log("Logging Out")
        window.location.reload();
    }
}

/**
 * Function to start Socket connection between specific client and API server
 *
 * @param {*} user username text
 * @param {*} sites sites JS Array with sites id or name
 */
function StartSocketConnection(user, _session_key) {
    session_key = _session_key
    console.log("trying to connect", user, "session_key:", _session_key, "at endpoint:", ENDPOINT)
    socket = io(ENDPOINT);

    socket.on('connect', function() { // TIP: you can avoid listening on `connect` and listen on events directly too!
        console.log("connected! Socket ID: " + socket.id + " session key: " + _session_key)
        socket.emit("session_key", { 'session_key': _session_key, 'user': user })
    });

    socket.on('dataChanged', function(data) {
        // Gestire il refresh dei dati

    });

    socket.on('logout', () => {
        Logout()
    })
}

/**
 * Function to call try_login API
 *
 * @param {*} user username text
 * @param {*} pwd password text
 * @return {*} false if wrong login or the user table ROW of the selected user JSON format
 */
async function TryLogin(user, pwd) {
    //console.log(ENDPOINT)
    let credentials = {
        "username": user,
        "password": md5(pwd)
    }
    const rawResponse = await fetch(ENDPOINT + API_ROUTE + API_VERSION, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api_name': 'try_login'
        },
        body: JSON.stringify(credentials)
    })
    const user_data = await rawResponse.json()
        //console.log("user_data: ", user_data)
    return user_data
}

/**
 * Function to call get_table_data API
 *
 * @param {*} siteid number
 * @return {*} JSON object
 */
async function GetTableData(page) {
    let body = {
        table: page
    }
    const rawResponse = await fetch(ENDPOINT + API_ROUTE + API_VERSION + BuildQueryString(body), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'session_key': session_key,
            'api_name': 'get_table_data'
        }
    })
    const sectors = await rawResponse.json()
    if (sectors.logout) Logout()
        //console.log("sectors: ", sectors)
    return sectors
}

/**
 * Function to call get_userprofile_pic API
 *
 * @param {*} username string
 * @return {*} JSON object
 */
async function GetUserProfilePic(username) {
    let body = {
        "username": username
    }
    const binaryImage = await fetch(ENDPOINT + API_ROUTE + API_VERSION + BuildQueryString(body), {
        method: 'GET',
        headers: {
            'Accept': 'image/png',
            'Content-Type': 'application/json',
            'session_key': session_key,
            'api_name': 'get_userprofile_pic'
        }
    })
    const base64ProfilePic = await binaryImage.text()
    if (base64ProfilePic.indexOf("logout") > 0)
        Logout()
    else if (base64ProfilePic.indexOf("accepted") === -1)
        return base64ProfilePic
    else
        return ""
}

/**
 * Function to create user and add it on a selected site
 *
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string/base64} [userProfilePic=undefined]
 * @return {boolean} 
 */
async function CreateUserProfile(permissions, username, email, password, profilePictureFile = undefined) {
    let filename = null
    if (profilePictureFile && username) {
        filename = `${username}.png`
        let body = {
            file: profilePictureFile
        }
        try {
            const resp = await fetch(ENDPOINT + API_ROUTE + API_VERSION, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'session_key': session_key,
                    'api_name': 'upload_image',
                    'type': 'profilePic',
                    'file_name': filename
                },
                body: JSON.stringify(body)
            })
            const response = await resp.json()
            if (response.logout) Logout()
            if (!response.accepted)
                return response
        } catch (err) {
            console.log(err)
            throw err
        }
    }
    if (username && email && password) {
        let body = {
            permissions,
            username,
            email,
            profile_pic_path: filename,
            password: md5(password),
        }
        const rawResponse = await fetch(ENDPOINT + API_ROUTE + API_VERSION, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'session_key': session_key,
                'api_name': 'create_profile'
            },
            body: JSON.stringify(body)
        })
        const response = await rawResponse.json()
        if (response.logout) Logout()
            //console.log("devices_table: ", devices_table)
        return response
    }
}

/**
 * Function to call update_profile API
 *
 * @param {string} username
 * @param {string} email
 * @param {string} newPassword
 * @param {string} oldPassword
 * @param {string/base64} [profilePictureFile=undefined]
 * @return {*} 
 */
async function UpdateUserProfile(username, email, newPassword, oldPassword, profilePictureFile = undefined) {
    let filename = null
    if (profilePictureFile && username) {
        filename = `${username}.png`
        let body = {
            file: profilePictureFile
        }
        try {
            const resp = await fetch(ENDPOINT + API_ROUTE + API_VERSION, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'session_key': session_key,
                    'api_name': 'upload_image',
                    'type': 'profilePic',
                    'file_name': filename
                },
                body: JSON.stringify(body)
            })
            const response = await resp.json()
            if (response.logout) Logout()
            if (!response.accepted)
                return response
        } catch (err) {
            console.log(err)
            throw err
        }
    }
    if (username && email && oldPassword) {
        let body = {
            username,
            email,
            filename,
            'oldPassword': md5(oldPassword),
            'newPassword': newPassword ? md5(newPassword) : undefined
        }
        const rawResponse = await fetch(ENDPOINT + API_ROUTE + API_VERSION, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'session_key': session_key,
                'api_name': 'update_profile'
            },
            body: JSON.stringify(body)
        })
        const response = await rawResponse.json()
        if (response.logout) Logout()
            //console.log("devices_table: ", devices_table)
        return response
    }
}

/**
 * Function to Update Selected User
 *
 * @param {string} username
 * @param {string} myPassword
 * @param {object} permissions
 * @param {boolean} user_disabled
 * @param {string} [newPassword=undefined]
 * @return {object} 
 */
async function UpdateSelectedUser(myusername, myPassword, username, permissions, user_disabled, newPassword = undefined) {
    if (username && myPassword && permissions) {
        let body = {
            myusername,
            myPassword: md5(myPassword),
            username,
            settings: {
                users_management: permissions.users_management,
                dataset_management: permissions.dataset_management,
                user_disabled
            }
        }
        if (newPassword) body.settings.password = md5(newPassword)
        const rawResponse = await fetch(ENDPOINT + API_ROUTE + API_VERSION, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'session_key': session_key,
                'api_name': 'update_selected_user'
            },
            body: JSON.stringify(body)
        })
        const response = await rawResponse.json()
        if (response.logout) Logout()
            //console.log("devices_table: ", devices_table)
        return response
    }
}

/**
 *  Function to Get the list of users of a site
 *
 * @param {number} site_id
 * @return {array<object>} 
 */
async function GetUsersList() {
    let body = {

    }
    const binaryImage = await fetch(ENDPOINT + API_ROUTE + API_VERSION + BuildQueryString(body), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'session_key': session_key,
            'api_name': 'get_users_list'
        }
    })
    const res = await binaryImage.json()
    if (res.logout) Logout()
    if (res.accepted) {
        return res.users_list
    } else
        return false
}

/**
 * Function to delete an user with his username
 *
 * @param {string} username
 * @return {boolean} 
 */
async function DeleteUser(username) {
    let body = {
        username
    }
    const rawResponse = await fetch(ENDPOINT + API_ROUTE + API_VERSION, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'session_key': session_key,
            'api_name': 'delete_user'
        },
        body: JSON.stringify(body)
    })
    const response = await rawResponse.json()
    if (response.logout) Logout()
        //console.log("devices_table: ", devices_table)
    return response
}

export {
    Logout,
    TryLogin,
    GetUserProfilePic,
    UpdateUserProfile,
    UpdateSelectedUser,
    GetUsersList,
    StartSocketConnection,
    GetTableData,
    CreateUserProfile,
    DeleteUser
}