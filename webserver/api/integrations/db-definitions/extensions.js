/** 
 * @type {string} 
 * @description SQL statement to add custom DB plugins
 */
const ltree = `CREATE EXTENSION IF NOT EXISTS ltree WITH SCHEMA public;`

module.exports = {
    extensions: [ltree]
}