## A nice boilerplate to start wit Node.js and React

Use this repository to build a webapp with Express.js (backend) and React+Redux (frontend).

This webapp uses RESTFULL APIs using HTTP Post messages.
React app talk with the server using a Bkconnect Js file.

In this example I use Postgres for DB.

1. Install backend env: 
    -     cd ./webserver/api/
    -     cp .env.example .env
    -     npm install
    -     npm install '@pm2/io'
    - To test the CSV db API you can run ```npm test``` (it use mocha)

2. Install frontend env:
    -     cd ../client/
    -     cp .env.example .env
    - adapt .env file to your backend ip address (if you run all in local you can leave 'localhost')
    -     npm install
    -     npm install -g serve
    -     npm run build

3. Run both applications:
    To run the applications you can do in different way:
    1. Using PM2 server manager there is a ```ecosystem.config.js```, run it with this command in the root of the project:
        - Install pm2 with ```npm i -g pm2```
        - Start ecosystem with ```pm2 start ecosystem.config.js```
    2. Manually you can run both apps in this way:
        - Execute ```serve.sh``` script (it runs 'npm run start' on the backend and 'npm run serve' on the client) 


## Note:
The automated scripts must be executable with right permissions:

    chmod +x ./install.sh
    chmod +x ./serve.sh

use ```node -v``` to make shure to have the latest Node.js version.

In production mode:

Change webserver/client/.env file --> Comment Locallhost ip address and set it with your server public IP

