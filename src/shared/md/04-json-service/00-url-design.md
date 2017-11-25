JSF Architect is designed for quickly building `application/json` HTTP APIs that are, by default, stateful with session support, for the purpose of hydrating "server"-side rendered `text/html` routes. Stateless style APIs for applications developing their own oAuth services are also fully supported by opting out of the session support on the functions that you do not want to use it. 

### Jargon

In a "traditional" REST (REpresentational State Transfer) style architecture the HTTP (Hyper Text Transfer Protocol) verbs map, mostly, cleanly to the now classic CRUD pattern (Create, Read, Update and Delete).

#### Ideal

1. Create &rarr; `POST /cats`
2. Read &rarr; `GET /cats`
3. Read &rarr; `GET /cats/:catID`
4. Update &rarr; `PUT /cats/:catID`
5. Delete &rarr; `DELETE /cats/:catID`

> Note how the URLs cleanly address the things they represent; the HTTP verbs map cleanly to the action being taken

---
### REST's Dirty Secret

Unfortunatley for REST web browsers serving `text/html` only support `GET` and `POST`. And this practical constraint cannot change because breaking the web isn't an option. However, clientside JavaScript via `XMLHttpRequest` or, the more recent, `fetch` networking primatives can use additional verbs. Regardless, clients that provide `text/html` interfaces absolutely need to support fallbacks. For performance. For accessability. For security. As a compromise, most web server frameworks bake fallbacks into `POST` using either a hidden form field, an HTTP Header or sometimes a query parameter. 

As a consequence, the clean conceptual RESTful API design shakes out with a less than ideal implementation:

#### Actual 

1. Create &rarr; `POST /cats`
2. Read &rarr; ` GET /cats`
3. Read &rarr; `GET /cats/:catID`
4. Update &rarr; `PUT /cats/:catID` 
5. *Fallback Update* &rarr; `POST /cats/:catID` with either a header or hidden form field `_method`
6. Delete &rarr; `DELETE /cats/:catID`
7. *Fallback Delete* &rarr; `POST /cats/:catID` with either a header or a hiden form field `_method`

This creates more code paths, which means more code, more security surface, harder to debug. This also means helper functions for generating urls, headers and form fields. These charactistics are known as a leaky abstraction; ideally we aren't exposed to these details _but inevidably we are_ and not in immediately obvious ways. 

JST Architect opts out of "hidden" fallback hacks and reccommends sticking to five URLs per entity:

---
### JSF Architect Reccomended REST

1. Create &rarr; `POST /cats`
2. Read   &rarr; `GET /cats`
3. Read   &rarr; `GET /cats/:catID`
4. Update &rarr; `POST /cats/:catID`
5. Delete &rarr; `POST /cats/:catID/delete`

The tradeoff of this approach is a convention for destructive writes of appending `/delete` (or anything you want) to the entity route. Conceptually this probably irks some purists as the URL is ideally a cannonical address of the entity representation and the HTTP verbs are, again ideally, supposed to be the representation of the action being taken. That is the difference between theory and practice.

- It is very clear what is happening and we're not hiding the information of the actual HTTP request
- By using the URL we opt into a discreet function for delete instead of overloading, and bloating the responsibility, of the update function
- Less code paths; your code is faster and less surface for bugs/sec holes
- Clients are far easier to author with the main information is divvied betwen reads (`GET`) and writes (`POST`) and plain URLs
- No helpers are required to learn, use (and debug); you are free to generate form fields, headers, and the such however you want (serverside render interop is clean)

Just because JSF Architect reccomends this it does not mean you are required to heed this advice. You can create additional endpoints in API Gateway and map them to your existing Lambda functions manually (or with CloudFormation). You could opt to use a query parameter or hidden form field to mock out `text/html` content too (but you are then opting into having a function for both update and delete actions which is definately not desirable)..

---
### Alternative API Styles

REST is not the only way to architect an HTTP API.

[**JSON API**](http://jsonapi.org/) is a formal specification for formatting JSON responses with a slightly different header `application/vnd.api+json`. JSF Architect does not currently support this natively but you could reconfigure API Gateway manually to send this `Content-Type`.

**GraphQL** is an interesting new way of thinking about querying and mutating data over HTTP. It is completely feasible to configure a single JSF Architect route to be a GraphQL endpoint. (Let me know if you do!)

**RPC** over HTTP is an older approach that recently has seen new (or old?) adherants. Notably, the Slack API is an excellent RPC over HTTP API that breaks just about every rule of REST. 

- The urls are method names
- Methods can be invoked with either `POST` or `GET`
- Consequently arguments can be either form variables or query parameters
- They _almost_ always respond with a statusCode of `200` 
- If there's an error condition the API returns JSON `{ok:false, error}`

It works wonderfully and we were able to implment a client library in less than 20KB!

---
### Limits

- URLs need to be short
- Deep nesting is not reccomended (probably not a super great practice anyhow)

---
### Notes on Hydrating Server Side Rendered Content

Prerendering HTML content on the "serverless" side is often more performant than constructing everything clientside with JavaScript. A common pattern is to render an HTML DOM string in the Lambda function, and embed a JSON encoded payload that clientside JS then reads and 'hydrates' the DOM.

---
### Notes on creatng Stateless APIs

JSF Architect layers in sesson state for building robust user facing web applications. API Gateway by itself is designed for stateless APIs and works great for them! Just delete the SESSION_TABLE_NAME environment variables from the lambdas you want to be stateless. You will have to construct an oAuth flow for security.

