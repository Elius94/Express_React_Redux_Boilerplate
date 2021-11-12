/**
 * Convert an IP address from string to uint32
 * @param {string} ip
 * IPv4 address as a string
 * @returns {Number}
 * The IP address as uint32
 */
function ip2uint32(ip) {
    return ip.split('.').reduce(function(ipInt, octet) {
        return (ipInt << 8) + parseInt(octet, 10)
    }, 0) >>> 0
}

/**
 * @todo to test and to doc
 * @description If object record (for single INSERT) or objects array
 * (for multiple INSERT) do have 'id' key, this must be deleted from object
 * or objects array BEFORE calling this function or to be inserted in DB
 * will already have 'id' key).
 * @param {*} table
 * @param {Object|Array} inputs
 */
function buildInsertQuery(table, inputs) {
    let text = `INSERT INTO ${table} (`
    const columns = []
    const queryValues = []

    if (Object.prototype.toString.call(inputs) === '[object Object]') {
        const values = []
            // const queryValues = []
        let index = 0
        for (const [key, value] of Object.entries(inputs)) {
            index++
            columns.push(key)
            values.push(`$${index}`)
            queryValues.push(value)
        }
        text += columns.join(', ')
        text += ') VALUES ('
        text += values.join(', ')
        text += ');'
    } else if (Array.isArray(inputs)) {
        let index = 0
            /* get column names from first record */
        const firstRecord = inputs[0]
        for (const key of Object.keys(firstRecord)) {
            columns.push(key)
        }
        text += columns.join(', ')
        text += ') VALUES '
            /* get column values from all records */
        for (const recordToInsert of inputs) {
            const values = []
            for (const [key, value] of Object.entries(recordToInsert)) {
                index++
                columns.push(key)
                values.push(`$${index}`)
                queryValues.push(value)
            }
            text += '('
            text += values.join(', ')
            text += '), '
        }
        /* Remove last '), ' occurence and put ';' in its place */
        text = text.slice(0, -2) + ';'
    }
    return { text, values: queryValues }
}

/**
 * @todo to test and to doc
 * @param {*} table
 * @param {*} inputs
 * @param {*} condition condition.columnName
 */
function buildUpdateQuery(table, inputs, condition) {
    let text = `UPDATE ${table} SET `
    const setValues = []
    const queryValues = []
    let conditionIndex = 1
    for (const [key, value] of Object.entries(inputs)) {
        setValues.push(`${key} = $${conditionIndex}`)
        queryValues.push(value)
        conditionIndex++
    }
    text += setValues.join(', ')
    text += ` WHERE ${condition.columnName} = $${conditionIndex};`
    queryValues.push(condition.columnValue)
    console.log(text)
    return { text, values: queryValues }
}

module.exports = {
    ip2uint32,
    buildInsertQuery,
    buildUpdateQuery,
}