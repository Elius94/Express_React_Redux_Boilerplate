## Functions

<dl>
<dt><a href="#ip2uint32">ip2uint32(ip)</a> ⇒ <code>Number</code></dt>
<dd><p>Convert an IP address from string to uint32</p>
</dd>
<dt><a href="#buildInsertQuery">buildInsertQuery(table, inputs)</a></dt>
<dd><p>If object record (for single INSERT) or objects array
(for multiple INSERT) do have &#39;id&#39; key, this must be deleted from object
or objects array BEFORE calling this function or to be inserted in DB
will already have &#39;id&#39; key).</p>
</dd>
<dt><a href="#buildUpdateQuery">buildUpdateQuery(table, inputs, condition)</a></dt>
<dd></dd>
<dt><a href="#tryLogin">tryLogin(username, password, [pre_md5])</a> ⇒ <code>Promise.&lt;Object&gt;</code> | <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Try to login with provided credentials</p>
</dd>
<dt><a href="#getUserProfilePic">getUserProfilePic(username)</a> ⇒ <code>Promise.&lt;(string|null|undefined)&gt;</code></dt>
<dd><p>Given a username, get its profile picture</p>
</dd>
<dt><a href="#getTableData">getTableData(tab)</a> ⇒ <code>Promise.&lt;Array&gt;</code></dt>
<dd><p>Get all data from a table</p>
</dd>
<dt><a href="#createUser">createUser(username, password, email, profilePicPath)</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Create a new user</p>
</dd>
<dt><a href="#deleteUser">deleteUser(username)</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Delete a user</p>
</dd>
<dt><a href="#updateUserProfile">updateUserProfile(username, email, newPassword, oldPassword)</a> ⇒ <code>*</code></dt>
<dd><p>Function to update profile informations</p>
</dd>
<dt><a href="#updateSelectedUser">updateSelectedUser(myUsername, myPassword, username, settings)</a> ⇒ <code>boolean</code></dt>
<dd><p>TODO Funzione per cambiare i parametri di un utente selezionato</p>
</dd>
<dt><a href="#validateApiRequest">validateApiRequest(sessionKey, action)</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Validate the session key</p>
</dd>
<dt><a href="#getUsersList">getUsersList(sessionKey, siteId)</a> ⇒ <code>Promise.&lt;Array.&lt;pg.QueryResult&gt;&gt;</code> | <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Given site, return users belonging to that site
but do not return user calling this function.
Return false if provided session key does not match any users</p>
</dd>
<dt><a href="#generateEmailFromTemplate">generateEmailFromTemplate(title, subtitle, call, text, footer, credits, legal)</a> ⇒ <code>String</code></dt>
<dd><p>Generate an email from a template</p>
</dd>
<dt><a href="#initTransporter">initTransporter()</a> ⇒ <code>Mail</code></dt>
<dd><p>Initialize a transporter to send emails</p>
</dd>
<dt><a href="#sendEmail">sendEmail(transporter, receiver, username)</a> ⇒ <code>Promise</code></dt>
<dd><p>Send an email to the receiver</p>
</dd>
<dt><a href="#loadFakeDataset">loadFakeDataset(pool)</a> ⇒ <code>Promise</code></dt>
<dd><p>Load fake data into the database</p>
</dd>
<dt><a href="#initSocketReference">initSocketReference(ioRef)</a></dt>
<dd><p>Function used to copy the Socket IO http server reference</p>
</dd>
<dt><a href="#loadNewSession">loadNewSession(username)</a> ⇒ <code>string</code></dt>
<dd><p>Function to add users sessions in this module. Use it at login</p>
</dd>
<dt><a href="#deleteSession">deleteSession(key)</a> ⇒ <code>boolean</code></dt>
<dd><p>Function to delete users sessions in this module. Use it at client logout</p>
</dd>
<dt><a href="#sendLogoutMessage">sendLogoutMessage(key)</a></dt>
<dd><p>Use this to notify the client to logout with WebSocket</p>
</dd>
<dt><a href="#createNewSessionTimer">createNewSessionTimer(key, username)</a> ⇒ <code>NodeJS.Timeout</code></dt>
<dd><p>Function to return a new setTimeout object and start it.</p>
</dd>
<dt><a href="#checkSessionStatus">checkSessionStatus(key)</a> ⇒ <code>boolean</code></dt>
<dd><p>Function to check if a key is valid and exists in the stored collection
Use this before every API.js function execution.</p>
</dd>
<dt><a href="#getUsernameFromSessionKey">getUsernameFromSessionKey(key)</a> ⇒ <code>string</code> | <code>boolean</code></dt>
<dd><p>Function to return the username from a session key</p>
</dd>
</dl>

<a name="ip2uint32"></a>

## ip2uint32(ip) ⇒ <code>Number</code>
Convert an IP address from string to uint32

**Kind**: global function
**Returns**: <code>Number</code> - The IP address as uint32

| Param | Type | Description |
| --- | --- | --- |
| ip | <code>string</code> | IPv4 address as a string |

<a name="buildInsertQuery"></a>

## buildInsertQuery(table, inputs)
will already have 'id' key).ing this function or to be inserted in DBect

**Kind**: global function
**Todo**

- [ ] to test and to doc


| Param | Type |
| --- | --- |
| table | <code>\*</code> |
| inputs | <code>Object</code> \| <code>Array</code> |

<a name="buildUpdateQuery"></a>

## buildUpdateQuery(table, inputs, condition)
**Kind**: global function
**Todo**

- [ ] to test and to doc


| Param | Type | Description |
| --- | --- | --- |
| table | <code>\*</code> |  |
| inputs | <code>\*</code> |  |
| condition | <code>\*</code> | condition.columnName |

<a name="tryLogin"></a>

## tryLogin(username, password, [pre_md5]) ⇒ <code>Promise.&lt;Object&gt;</code> \| <code>Promise.&lt;boolean&gt;</code>
Try to login with provided credentials

**Kind**: global function
and path, level, name of the site he belongs to)   password, email&lt;boolean&gt;</code> - If user exists in DB,
**Throws**:

- Will throw if query to DB will fail

**Todo**

- [ ] document output object


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| username | <code>string</code> |  | User name |
| password | <code>string</code> |  | User password |
| [pre_md5] | <code>boolean</code> | <code>false</code> | If true, input password will be pre-computed with md5; if false, input password will NOT be pre- computed with md5 |

<a name="getUserProfilePic"></a>

## getUserProfilePic(username) ⇒ <code>Promise.&lt;(string\|null\|undefined)&gt;</code>
Given a username, get its profile picture

**Kind**: global function
undefined   no profile pic, return null; if user does not exist, returng;urn the user profile pic path if
**Throws**:

- <code>string</code> Will throw if query to DB will fail


| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | Get username of this user |

<a name="getTableData"></a>

## getTableData(tab) ⇒ <code>Promise.&lt;Array&gt;</code>
Get all data from a table

**Kind**: global function
from the table  de>Promise.&lt;Array&gt;</code> - Return an array of objects containing all data
**Throws**:

- Will throw if query to DB will fail


| Param | Type | Description |
| --- | --- | --- |
| tab | <code>string</code> | Table name |

<a name="createUser"></a>

## createUser(username, password, email, profilePicPath) ⇒ <code>Promise.&lt;boolean&gt;</code>
Create a new user

**Kind**: global function
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Return true if user has been created, false
**Throws**:

- Will throw if query to DB will fail


| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | User name |
| password | <code>string</code> | User password |
| email | <code>string</code> | User email |
| profilePicPath | <code>string</code> | User profile picture path |

<a name="deleteUser"></a>

## deleteUser(username) ⇒ <code>Promise.&lt;boolean&gt;</code>
Delete a user

**Kind**: global function
otherwise  : <code>Promise.&lt;boolean&gt;</code> - Return true if user has been deleted, false
**Throws**:

- Will throw if query to DB will fail

**Todo**

- [ ] check if user is admin and if he is, throw error
- [ ] check if user is logged and if he is, throw error
- [ ] check if user is disabled and if he is, throw error


| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | User name |

<a name="updateUserProfile"></a>

## updateUserProfile(username, email, newPassword, oldPassword) ⇒ <code>\*</code>
Function to update profile informations

**Kind**: global function

| Param | Type |
| --- | --- |
| username | <code>string</code> |
| email | <code>string</code> |
| newPassword | <code>string/md5</code> |
| oldPassword | <code>string/md5</code> |

<a name="updateSelectedUser"></a>

## updateSelectedUser(myUsername, myPassword, username, settings) ⇒ <code>boolean</code>
TODO Funzione per cambiare i parametri di un utente selezionato

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| myUsername | <code>string</code> | Username dell'utente che esegue l'azione |
| myPassword | <code>string/md5</code> | Password relativa |
| username | <code>string</code> | Username dell'utente da modificare |
| settings | <code>object</code> | Oggetto che contiene i parametri da modificare con i nomi dei campi sul DB |

<a name="validateApiRequest"></a>

## validateApiRequest(sessionKey, action) ⇒ <code>Promise.&lt;boolean&gt;</code>
Validate the session key

**Kind**: global function
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Return true if session key is valid, false otherwise
**Throws**:

- Will throw if query to DB will fail


| Param | Type | Description |
| --- | --- | --- |
| sessionKey | <code>string</code> | Session key |
| action | <code>string</code> | Action to validate |

<a name="getUsersList"></a>

## getUsersList(sessionKey, siteId) ⇒ <code>Promise.&lt;Array.&lt;pg.QueryResult&gt;&gt;</code> \| <code>Promise.&lt;boolean&gt;</code>
Return false if provided session key does not match any users

**Kind**: global function

| Param | Type |
| --- | --- |
| sessionKey | <code>\*</code> |
| siteId | <code>number</code> \| <code>string</code> |

<a name="generateEmailFromTemplate"></a>

## generateEmailFromTemplate(title, subtitle, call, text, footer, credits, legal) ⇒ <code>String</code>
Generate an email from a template

**Kind**: global function
**Returns**: <code>String</code> - The generated email
**See**

- https://nodemailer.com/message/
- https://nodemailer.com/smtp/
- https://nodemailer.com/extras/
- https://nodemailer.com/about/
- https://nodemailer.com/docs/
- https://nodemailer.com/docs/transport-smtp/
- https://nodemailer.com/docs/sending-mail/
- https://nodemailer.com/docs/messages/


| Param | Type | Description |
| --- | --- | --- |
| title | <code>String</code> | Title of the email |
| subtitle | <code>String</code> | Subtitle of the email |
| call | <code>String</code> | Call to action of the email |
| text | <code>String</code> | Text of the email |
| footer | <code>String</code> | Footer of the email |
| credits | <code>String</code> | Credits of the email |
| legal | <code>String</code> | Legal information of the email |

<a name="initTransporter"></a>

## initTransporter() ⇒ <code>Mail</code>
Initialize a transporter to send emails

**Kind**: global function
**Returns**: <code>Mail</code> - An object to send emails
<a name="sendEmail"></a>

## sendEmail(transporter, receiver, username) ⇒ <code>Promise</code>
Send an email to the receiver

**Kind**: global function
**Returns**: <code>Promise</code> - - A promise that resolves when the email has been sent
**Throws**:

- <code>Error</code> - If the email cannot be sent


| Param | Type | Description |
| --- | --- | --- |
| transporter | <code>Mail</code> | The transporter object to send the email |
| receiver | <code>string</code> | The email address to send the email to |
| username | <code>string</code> | The username of the user to send the email to |

<a name="loadFakeDataset"></a>

## loadFakeDataset(pool) ⇒ <code>Promise</code>
Load fake data into the database

**Kind**: global function
**Returns**: <code>Promise</code> - - promise of the database query
**Throws**:

- <code>Error</code> - if the database query fails


| Param | Type | Description |
| --- | --- | --- |
| pool | <code>Pool</code> | database connection pool |

**Example**
```js
loadFakeDataset(pool)
```
**Example**
```js
loadFakeDataset(pool).then(res => console.log(res))
```
**Example**
```js
loadFakeDataset(pool).catch(err => console.error(err))
```
**Example**
```js
loadFakeDataset(pool).finally(() => pool.end())
```
<a name="initSocketReference"></a>

## initSocketReference(ioRef)
Function used to copy the Socket IO http server reference

**Kind**: global function

| Param | Type |
| --- | --- |
| ioRef | <code>\*</code> |

<a name="loadNewSession"></a>

## loadNewSession(username) ⇒ <code>string</code>
Function to add users sessions in this module. Use it at login

**Kind**: global function
**Returns**: <code>string</code> - user unique key

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | The username provided on successful login |

<a name="deleteSession"></a>

## deleteSession(key) ⇒ <code>boolean</code>
Function to delete users sessions in this module. Use it at client logout

**Kind**: global function
**Returns**: <code>boolean</code> - true or false, true if ok

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The session_key provided on successful login |

<a name="sendLogoutMessage"></a>

## sendLogoutMessage(key)
Use this to notify the client to logout with WebSocket

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The session_key |

<a name="createNewSessionTimer"></a>

## createNewSessionTimer(key, username) ⇒ <code>NodeJS.Timeout</code>
Function to return a new setTimeout object and start it.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The session_key |
| username | <code>string</code> | The username, only for logging features |

<a name="checkSessionStatus"></a>

## checkSessionStatus(key) ⇒ <code>boolean</code>
Use this before every API.js function execution.n the stored collection

**Kind**: global function
**Returns**: <code>boolean</code> - true or false: true if session is active

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the user key generated at login |

<a name="getUsernameFromSessionKey"></a>

## getUsernameFromSessionKey(key) ⇒ <code>string</code> \| <code>boolean</code>
Function to return the username from a session key

**Kind**: global function
**Returns**: <code>string</code> \| <code>boolean</code> - username or false if session is not active
**Throws**:

- <code>Error</code> if session key is not valid
- <code>Error</code> if session key is not found
- <code>Error</code> if session key is expired
- <code>Error</code> if session key is not found


| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the user key generated at login |