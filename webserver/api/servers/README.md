## Functions

<dl>
<dt><a href="#notifyClientToLogout">notifyClientToLogout(io, key)</a></dt>
<dd><p>Call this function to force specific browser to log out</p>
</dd>
<dt><a href="#notifyAllClientsToLogout">notifyAllClientsToLogout(io)</a></dt>
<dd><p>Call this function to force all browsers to log out</p>
</dd>
<dt><a href="#onError">onError(error, port)</a></dt>
<dd><p>Event listener for HTTP server &quot;error&quot; event.</p>
</dd>
<dt><a href="#onListening">onListening(server)</a></dt>
<dd><p>Event listener for HTTP server &quot;listening&quot; event.</p>
</dd>
<dt><a href="#startServer">startServer(app, port)</a> ⇒ <code>SocketIO.Server</code></dt>
<dd><p>Create and start an ioSocket server</p>
</dd>
</dl>

<a name="notifyClientToLogout"></a>

## notifyClientToLogout(io, key)
Call this function to force specific browser to log out

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| io | <code>SocketIO.Server</code> | SocketIO server to call this on |
| key | <code>string</code> | session_key of the user |

<a name="notifyAllClientsToLogout"></a>

## notifyAllClientsToLogout(io)
Call this function to force all browsers to log out

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| io | <code>SocketIO.Server</code> | SocketIO server to call this on |

<a name="onError"></a>

## onError(error, port)
Event listener for HTTP server "error" event.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| error | <code>\*</code> | Error variable |
| port | <code>\*</code> | Port the HTTP server is listening on |

<a name="onListening"></a>

## onListening(server)
Event listener for HTTP server "listening" event.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| server | <code>\*</code> | Server handle |

<a name="startServer"></a>

## startServer(app, port) ⇒ <code>SocketIO.Server</code>
Create and start an ioSocket server

**Kind**: global function
**Returns**: <code>SocketIO.Server</code> - The newly created server

| Param | Type | Description |
| --- | --- | --- |
| app | <code>\*</code> | "Express" handle |
| port | <code>\*</code> | Port the server should listen on |