## A nice boilerplate to start wit Node.js and React

Use this repository to build a webapp with Express.js (backend) and React+Redux (frontend).

[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=elius94&repo=Express_React_Redux_Boilerplate&theme=github_dark&show_icons=true)](https://github.com/Elius94/Express_React_Redux_Boilerplate)

This webapp uses RESTFULL APIs using HTTP Post messages.
React app talk with the server using a Bkconnect Js file.

In this example I use Postgres for DB.

1. Prepare the PG database:
    -     Make sure you have Postgres installed on your machine.
    -     Make sure you have created the database and the user.
    -     Go to ```./webserver/api/integrations/```
    -     Uncomment the ```await initDb.dropDb()``` line if the db already exists.
    -     Doing this the database will be initialized with the tables and the data defined in the folders ./webserver/api/integrations/db-definitions and ./webserver/api/integrations/fake-data:
        1. db-definitions: 
            -     enumerations.js: defines the enumerated types.
            -     tables.js: defines the tables and the relationships between them.
            -     extensions.js: defines the postgres extensions used by the tables.
        2. fake-data:
            -     fake-data.js: defines the data to fill the tables.
    -     Run the following command to create the database:
        ```
        node ./test-init-fake-db.js
        ```

2. Install backend env: 
    -     cd ./webserver/api/
    -     cp .env.example .env # change the ip DB_HOST with your server ip: ex: 135.181.145.246
    -     npm install
    -     npm install '@pm2/io'
    -     npm i -g pm2
    - To test the DB db API you can run ```npm test``` (it use mocha)

3. Install frontend env:
    -     cd ../client/
    -     cp .env.example .env
    - adapt .env file to your backend ip address (if you run all in local you can leave 'localhost')
    -     npm install
    -     npm install -g serve
    - if you are using the last Node.js version (17.x.x) you have to set this env variable on Linux ```export NODE_OPTIONS=--openssl-legacy-provider && npm run build```
      on Windows you have to change the script object in package.json adding ```set NODE_OPTIONS=--openssl-legacy-provider``` to the build command, before react-scripts build: 
        ```json
        ...
        "scripts": {
            "start": "react-scripts start",
            "build": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts build", 
            "test": "react-scripts test",
            "eject": "react-scripts eject"
        },
        ...
        ```
    -     npm run build

4. Run both applications:
    To run the applications you can do in different way:
    1. Using PM2 server manager there is a ```ecosystem.config.js```, run it with this command in the root of the project:
        - If pm2 is not install, you need to install it by typing ```npm i -g pm2```
        - Start ecosystem with 
            ```sh
                Pm2 Doc: https://pm2.keymetrics.io/docs/usage/startup/
                # create pm2-root.service
                pm2 startup
                # run client and server
                pm2 start ecosystem.config.js
                # save config
                pm2 save
                # check logs
                pm2 logs
            ```
    2. Manually you can run both apps in this way:
        - Execute ```serve.sh``` script (it runs 'npm run start' on the backend and 'npm run serve' on the client) 


## Note:
The automated scripts must be executable with right permissions:

    chmod +x ./install.sh
    chmod +x ./serve.sh

use ```node -v``` to make shure to have the latest Node.js version.

In production mode:

Change webserver/client/.env file --> Comment Locallhost ip address and set it with your server public IP

## Database:

In this example I use Postgres for DB but you can use any DB or other data storage (like MongoDB or even a NoSQL DB).
For exaple you can use a csv file or a json file. 
