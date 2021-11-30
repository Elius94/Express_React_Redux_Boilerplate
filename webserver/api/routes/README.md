## Constants

<dl>
<dt><a href="#apiVersion">apiVersion</a> : <code>number</code></dt>
<dd><p>the version of the API</p>
</dd>
<dt><a href="#api_post_req_meter">api_post_req_meter</a> : <code>PMX.Meter</code></dt>        
<dd></dd>
<dt><a href="#api_post_req_counter">api_post_req_counter</a> : <code>PMX.Counter</code></dt>  
<dd></dd>
<dt><a href="#api_get_req_meter">api_get_req_meter</a> : <code>PMX.Meter</code></dt>
<dd></dd>
<dt><a href="#api_get_req_counter">api_get_req_counter</a> : <code>PMX.Counter</code></dt>    
<dd></dd>
<dt><a href="#api_put_req_meter">api_put_req_meter</a> : <code>PMX.Meter</code></dt>
<dd></dd>
<dt><a href="#api_put_req_counter">api_put_req_counter</a> : <code>PMX.Counter</code></dt>    
<dd></dd>
<dt><a href="#api_delete_req_meter">api_delete_req_meter</a> : <code>PMX.Meter</code></dt>    
<dd></dd>
<dt><a href="#api_delete_req_counter">api_delete_req_counter</a> : <code>PMX.Counter</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#apiPostParser">apiPostParser(req, res, next)</a> ⇒ <code>Object</code></dt>     
<dd><p>Parses the Post request and returns the data in the body and in the header of the request</p>
</dd>
<dt><a href="#apiGetParser">apiGetParser(req, res, next)</a> ⇒ <code>Object</code></dt>       
<dd><p>Parses the Get request and returns the data in the body and in the header of the request</p>
</dd>
<dt><a href="#apiPutParser">apiPutParser(req, res, next)</a> ⇒ <code>Object</code></dt>       
<dd><p>Parses the Put request and returns the data in the body and in the header of the request</p>
</dd>
<dt><a href="#apiDeleteParser">apiDeleteParser(req, res, next)</a> ⇒ <code>Object</code></dt> 
<dd><p>Parses the Delete request and returns the data in the body and in the header of the request</p>
</dd>
</dl>

<a name="apiVersion"></a>

## apiVersion : <code>number</code>
the version of the API

**Kind**: global constant
<a name="api_post_req_meter"></a>

## api\_post\_req\_meter : <code>PMX.Meter</code>
**Kind**: global constant
<a name="api_post_req_counter"></a>

## api\_post\_req\_counter : <code>PMX.Counter</code>
**Kind**: global constant
<a name="api_get_req_meter"></a>

## api\_get\_req\_meter : <code>PMX.Meter</code>
**Kind**: global constant
<a name="api_get_req_counter"></a>

## api\_get\_req\_counter : <code>PMX.Counter</code>
**Kind**: global constant
<a name="api_put_req_meter"></a>

## api\_put\_req\_meter : <code>PMX.Meter</code>
**Kind**: global constant
<a name="api_put_req_counter"></a>

## api\_put\_req\_counter : <code>PMX.Counter</code>
**Kind**: global constant
<a name="api_delete_req_meter"></a>

## api\_delete\_req\_meter : <code>PMX.Meter</code>
**Kind**: global constant
<a name="api_delete_req_counter"></a>

## api\_delete\_req\_counter : <code>PMX.Counter</code>
**Kind**: global constant
<a name="apiPostParser"></a>

## apiPostParser(req, res, next) ⇒ <code>Object</code>
Parses the Post request and returns the data in the body and in the header of the request     

**Kind**: global function
**Returns**: <code>Object</code> - - Returns the data in the body and in the header of the request as an object
**Throws**:

- <code>Error</code> - Throws an error if the request is not a POST request or if the request 
body is not a JSON object or if the request header is not a JSON object

**Info**: req.headers.api_name is the name of the API that is being called (e.g. 'try_login') 


| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |
| next | <code>function</code> | Express next function |

<a name="apiGetParser"></a>

## apiGetParser(req, res, next) ⇒ <code>Object</code>
Parses the Get request and returns the data in the body and in the header of the request      

**Kind**: global function
**Returns**: <code>Object</code> - - Returns the data in the body and in the header of the request as an object
**Throws**:

- <code>Error</code> - Throws an error if the request is not a GET request or if the request body is not a JSON object or if the request header is not a JSON object

**Info**: req.headers.api_name is the name of the API that is being called (e.g. 'try_login') 


| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |
| next | <code>function</code> | Express next function |

<a name="apiPutParser"></a>

## apiPutParser(req, res, next) ⇒ <code>Object</code>
Parses the Put request and returns the data in the body and in the header of the request      

**Kind**: global function
**Returns**: <code>Object</code> - - Returns the data in the body and in the header of the request as an object
**Throws**:

- <code>Error</code> - Throws an error if the request is not a PUT request or if the request body is not a JSON object or if the request header is not a JSON object

**Info**: req.headers.api_name is the name of the API that is being called (e.g. 'try_login') 


| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |
| next | <code>function</code> | Express next function |

<a name="apiDeleteParser"></a>

## apiDeleteParser(req, res, next) ⇒ <code>Object</code>
Parses the Delete request and returns the data in the body and in the header of the request   

**Kind**: global function
**Returns**: <code>Object</code> - - Returns the data in the body and in the header of the request as an object
**Throws**:

- <code>Error</code> - Throws an error if the request is not a DELETE request or if the request body is not a JSON object or if the request header is not a JSON object

**Info**: req.headers.api_name is the name of the API that is being called (e.g. 'try_login') 


| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Express request object |
| res | <code>Object</code> | Express response object |
| next | <code>function</code> | Express next function |