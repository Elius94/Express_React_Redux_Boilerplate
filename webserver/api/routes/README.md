## Constants

<dl>
<dt><a href="#api_post_req_meter">api_post_req_meter</a> : <code>PMX.Counter</code></dt>
<dd></dd>
<dt><a href="#api_post_req_counter">api_post_req_counter</a> : <code>PMX.Counter</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#apiParser">apiParser(req, res, next)</a> ⇒ <code>Object</code></dt>
<dd><p>Parses the request and returns the data in the body and in the header of the request</p>
</dd>
</dl>

<a name="api_post_req_meter"></a>

## api\_post\_req\_meter : <code>PMX.Counter</code>
**Kind**: global constant
<a name="api_post_req_counter"></a>

## api\_post\_req\_counter : <code>PMX.Counter</code>
**Kind**: global constant
<a name="apiParser"></a>

## apiParser(req, res, next) ⇒ <code>Object</code>
Parses the request and returns the data in the body and in the header of the request

**Kind**: global function
**Returns**: <code>Object</code> - - Returns the data in the body and in the header of the request as an object
**Throws**:

- <code>Error</code> - Throws an error if the request is not a POST request or if the request body is not a JSON object or if the request header is not a JSON object

**Info**: req.headers.api_name is the name of the API that is being called (e.g. 'try_login')

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |
| next | <code>function</code> | Express next function |