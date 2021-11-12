/** 
 * @type {string} 
 * @description SQL create statement to build your table
 */
const dataset = `
CREATE TABLE IF NOT EXISTS "dataset" (
    "id" BIGSERIAL PRIMARY KEY,
    "nome" VARCHAR,
    "zona" VARCHAR,
    "altitudine" VARCHAR
);`

/** 
 * @type {string} 
 * @description SQL create statement to build users table
 */
const users = `
CREATE TABLE IF NOT EXISTS "users" (
    "id" BIGSERIAL PRIMARY KEY,
    "username" VARCHAR UNIQUE,
    "password" VARCHAR,
    "email" VARCHAR,
    "profile_pic_path" VARCHAR,
    "user_disabled" BOOLEAN DEFAULT FALSE,
    "users_management" BOOLEAN NOT NULL DEFAULT FALSE,
    "dataset_management" BOOLEAN NOT NULL DEFAULT FALSE
);`

module.exports = {
    tables: [
        dataset,
        users
    ]
}