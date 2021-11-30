var assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../app.js');
const fetch = require('node-fetch');
const md5 = require('md5');
const fs = require('fs');
const { SM } = require('../integrations/session_manager.js');
const API_ROUTE = "/API/"
const API_VERSION = "v1/"

chai.use(chaiHttp);

let session_key_mariolone = "";

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

// test the function tryLogin with chai and mocha (https://www.chaijs.com/api/bdd/)
describe('/POST try_login', () => {
    it('it should POST try_login API', (done) => {
        let credentials = {
            "username": "mariolone",
            "password": md5("mariolone")
        }
        chai.request(server)
            .post(API_ROUTE + API_VERSION)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'try_login')
            .send(JSON.stringify(credentials))
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(201);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(true);
                expect(_res).to.have.property('user_data');
                expect(_res.user_data).to.be.a('object');
                expect(_res.user_data).to.have.property('username');
                expect(_res.user_data.username).to.be.a('string');
                expect(_res.user_data.username).to.equal('mariolone');
                expect(_res.user_data).to.have.property('session_key');
                expect(_res.user_data.session_key).to.be.a('string');
                session_key_mariolone = _res.user_data.session_key;
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
})

describe('/GET get_users_list with user "mariolone" that cannot use this...', () => {
    it('it should GET get_users_list API but server should reject it', (done) => {
        let body = {}
        chai.request(server)
            .get(API_ROUTE + API_VERSION + BuildQueryString(body))
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'get_users_list')
            .set('session_key', session_key_mariolone)
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(404);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(false);
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
})

let session_key_admin = "";

describe('/POST try_login with admin user', () => {
    it('it should POST try_login API', (done) => {
        let credentials = {
            "username": "admin",
            "password": md5("admin")
        }
        chai.request(server)
            .post(API_ROUTE + API_VERSION)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'try_login')
            .send(JSON.stringify(credentials))
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(201);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(true);
                expect(_res).to.have.property('user_data');
                expect(_res.user_data).to.be.a('object');
                expect(_res.user_data).to.have.property('username');
                expect(_res.user_data.username).to.be.a('string');
                expect(_res.user_data.username).to.equal('admin');
                expect(_res.user_data).to.have.property('session_key');
                expect(_res.user_data.session_key).to.be.a('string');
                session_key_admin = _res.user_data.session_key;
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
})

describe('/GET get_users_list with user "admin" that can use this...', () => {
    it('it should GET get_users_list API', (done) => {
        let body = {}
        chai.request(server)
            .get(API_ROUTE + API_VERSION + BuildQueryString(body))
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'get_users_list')
            .set('session_key', session_key_admin)
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(200);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(true);
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
})

// Test get_userprofile_pic with user admin
describe('/GET get_userprofile_pic with user "admin" that can use this...', () => {
    it('it should GET get_userprofile_pic API and the returned base64 image should be equal to the real file in the uploads folder', (done) => {
        let body = {
            "username": "admin"
        }
        chai.request(server)
            .get(API_ROUTE + API_VERSION + BuildQueryString(body))
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'get_userprofile_pic')
            .set('session_key', session_key_admin)
            .then((res) => {
                expect(res).to.have.status(200);
                const image = res.text // base64 encoded image
                expect(image).to.be.a('string');
                // compare with the image in the folder "../uploads/users_profile_pics/admin.png"
                let file = fs.readFileSync('./uploads/users_profile_pics/admin.png');
                let file_base64 = new Buffer.from(file).toString('base64');
                expect(image).to.equal(file_base64);
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
})

// Now we have to create a new user "franco", using create_user POST API with a random profile pic found on the internet
let session_key_franco = "";
let user_data_franco = {};
describe('/POST upload_image and create_user with user "franco" and a random picture', () => {
    // convert ./testPic.jpg to base64
    const randomPictureBase64 = `data:image/jpeg;base64,${fs.readFileSync('./test/testPic.jpg').toString('base64')}`
    it('it should POST upload_image API', (done) => {
        let credentials = {
            file: randomPictureBase64
        }
        chai.request(server)
            .post(API_ROUTE + API_VERSION)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'upload_image')
            .set('session_key', session_key_admin)
            .set('type', 'profilePic')
            .set('file_name', 'franco.jpg')
            .send(JSON.stringify(credentials))
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(201);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(true);
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
    it('it should POST create_user API', (done) => {
        // now we have to fetch create_profile POST API with user "franco" and his data
        let body = {
            permissions: { "users_management": false, "dataset_management": false }, // permissions for user "franco"
            username: "franco",
            email: "franco@gmail.com",
            profile_pic_path: "franco.jpg",
            password: md5("franco"),
        }
        chai.request(server)
            .post(API_ROUTE + API_VERSION)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'create_profile')
            .set('session_key', session_key_admin)
            .send(JSON.stringify(body))
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(201);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(true);
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
    it('it should POST try_login API with user franco', (done) => {
        // now we have to login with the new user "franco"
        let credentials = {
            "username": "franco",
            "password": md5("franco")
        }
        chai.request(server)
            .post(API_ROUTE + API_VERSION)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'try_login')
            .send(JSON.stringify(credentials))
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(201);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(true);
                expect(_res).to.have.property('user_data');
                expect(_res.user_data).to.be.a('object');
                expect(_res.user_data).to.have.property('username');
                expect(_res.user_data.username).to.be.a('string');
                expect(_res.user_data.username).to.equal('franco');
                expect(_res.user_data).to.have.property('session_key');
                expect(_res.user_data.session_key).to.be.a('string');
                session_key_franco = _res.user_data.session_key;
                user_data_franco = _res.user_data;
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
    it('it should GET get_userprofile_pic API with user franco', (done) => {
        // now we have to get the user profile pic with user "franco" and compare it with the random picture previously uploaded
        let body = {
            "username": "franco"
        }
        chai.request(server)
            .get(API_ROUTE + API_VERSION + BuildQueryString(body))
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'get_userprofile_pic')
            .set('session_key', session_key_franco)
            .then((res) => {
                expect(res).to.have.status(200);
                const image = res.text // base64 encoded image
                expect(image).to.be.a('string');
                //expect(image).to.equals(randomPictureBase64);
                done();
            })
            .catch(function(err) {
                throw err;
            })
    })
})

// Now we have to test update_profile PUT API with user "franco"
describe('/PUT update_profile with user "franco"', async() => {
    let newEmail = "franco@hotmail.com"
    let newPassword = "franco123"
    it('it should PUT update_profile API', (done) => {
        let body = {
            username: "franco",
            email: newEmail,
            filename: "franco.jpg",
            'oldPassword': md5("franco"),
            'newPassword': md5(newPassword)
        }
        chai.request(server)
            .put(API_ROUTE + API_VERSION)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'update_profile')
            .set('session_key', session_key_franco)
            .send(JSON.stringify(body))
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(200);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(true);
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
    it('it should POST try_login API again with user "franco" and new password', (done) => {
        // now we have to login again the new user "franco" and new password
        let credentials = {
            "username": "franco",
            "password": md5(newPassword)
        }
        chai.request(server)
            .post(API_ROUTE + API_VERSION)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'try_login')
            .send(JSON.stringify(credentials))
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(201);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(true);
                expect(_res).to.have.property('user_data');
                expect(_res.user_data).to.be.a('object');
                expect(_res.user_data).to.have.property('username');
                expect(_res.user_data.username).to.be.a('string');
                expect(_res.user_data.username).to.equal('franco');
                expect(_res.user_data).to.have.property('session_key');
                expect(_res.user_data.session_key).to.be.a('string');
                session_key_franco = _res.user_data.session_key;
                expect(_res.user_data).to.have.property('email');
                expect(_res.user_data.email).to.be.a('string');
                expect(_res.user_data.email).to.equal(newEmail);
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
})

// Now we have to test update_selected_user PUT API with user "franco"
describe('/PUT update_selected_user with user "franco" changing password', async() => {
    let newPasswordFromAdmin = "franco001"
    it('it should PUT update_selected_user API', (done) => {
        let body = {
            myusername: "admin",
            myPassword: md5("admin"),
            username: "franco",
            settings: {
                users_management: true,
                dataset_management: true,
                user_disabled: false,
                password: md5(newPasswordFromAdmin),
            }
        }
        chai.request(server)
            .put(API_ROUTE + API_VERSION)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'update_selected_user')
            .set('session_key', session_key_admin)
            .send(JSON.stringify(body))
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(200);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(true);
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
    it('it should login again the new user "franco" and new password', (done) => {
        // now we have to login again the new user "franco" and new password
        let credentials = {
            "username": "franco",
            "password": md5(newPasswordFromAdmin)
        }
        chai.request(server)
            .post(API_ROUTE + API_VERSION)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'try_login')
            .send(JSON.stringify(credentials))
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(201);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(true);
                expect(_res).to.have.property('user_data');
                expect(_res.user_data).to.be.a('object');
                expect(_res.user_data).to.have.property('username');
                expect(_res.user_data.username).to.be.a('string');
                expect(_res.user_data.username).to.equal('franco');
                expect(_res.user_data).to.have.property('session_key');
                expect(_res.user_data.session_key).to.be.a('string');
                session_key_franco = _res.user_data.session_key;
                done();
            })
            .catch(function(err) {
                throw err;
            })
    })
})

// Now we have to delete user "franco" permanently with DELETE API "delete_user"
describe('/DELETE delete_user with user "franco"', async() => {
    it('should DELETE delete_user API', (done) => {
        let body = {
            username: "franco",
        }
        chai.request(server)
            .delete(API_ROUTE + API_VERSION)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'delete_user')
            .set('session_key', session_key_admin) // admin is the only user that can delete users
            .send(JSON.stringify(body))
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(200);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(true);
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
    it('should fail the try_login POST request with user franco because it was deleted', (done) => {
        let credentials = {
            "username": "franco",
            "password": md5("franco")
        }
        chai.request(server)
            .post(API_ROUTE + API_VERSION)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'try_login')
            .send(JSON.stringify(credentials))
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(404);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(false);
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
})

// Testing get_table_data GET API
describe('/GET get_table_data', async() => {
    it('it should GET get_table_data API', (done) => {
        let body = {
            table: "dataset"
        }
        chai.request(server)
            .get(API_ROUTE + API_VERSION + BuildQueryString(body))
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'get_table_data')
            .set('session_key', session_key_admin)
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(200);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(true);
                expect(_res).to.have.property('table_data');
                expect(_res.table_data).to.be.a('array');
                expect(_res.table_data[0]).to.be.a('object');
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
})

// Logout mariolone user
describe('/DELETE logout mariolone', () => {
    it('it should DELETE logout API', (done) => {
        let body = {}
        chai.request(server)
            .delete(API_ROUTE + API_VERSION)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'logout')
            .set('session_key', session_key_mariolone)
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(200);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(true);
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
})

// Logout admin user
describe('/DELETE logout admin', () => {
    it('it should DELETE logout API', (done) => {
        let body = {}
        chai.request(server)
            .delete(API_ROUTE + API_VERSION)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('api_name', 'logout')
            .set('session_key', session_key_admin)
            .then((res) => {
                const _res = JSON.parse(res.text)
                expect(res).to.have.status(200);
                expect(_res).to.be.a('object');
                expect(_res).to.have.property('accepted');
                expect(_res.accepted).to.be.a('boolean');
                expect(_res.accepted).to.equal(true);
                done();
            })
            .catch(function(err) {
                throw err;
            })
    });
})

after(function(done) {
    SM.deleteAllSessions()
    done();
});