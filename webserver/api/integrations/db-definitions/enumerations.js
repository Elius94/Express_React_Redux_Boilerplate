/** 
 * @type {string} 
 * @description You can also add all other db definitions here. like enumerators or other constants.
 */
const siteTabs = `
CREATE TYPE "site_tabs" AS ENUM (
    '01_Riassunto',
    '02_Bilancio',
    '03_Indici'
);`

module.exports = {
    enums: [
        siteTabs
    ]
}