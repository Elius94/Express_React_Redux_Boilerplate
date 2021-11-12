module.exports = {
    apps: [{
        name: "client",
        script: "serve",
        env: {
            PM2_SERVE_PATH: './webserver/client/build',
            PM2_SERVE_PORT: 80,
            PM2_SERVE_SPA: 'true'
        }
    }, {
        name: "server",
        script: "./webserver/api/bin/www",
        cwd: "./webserver/api/",
        args: ""
    }],
}