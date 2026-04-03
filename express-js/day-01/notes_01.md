# Day 01 - Express.js Fundamentals (Detailed Notes)

---

## Table of Contents

1. [Learning Goal](#learning-goal)
2. [What Is Express.js](#what-is-expressjs)
3. [Need of Express.js](#need-of-expressjs)
4. [Installing Express.js](#installing-expressjs)
5. [Basic Express App](#basic-express-app)
6. [Adding Middleware](#adding-middleware)
7. [Sending Response](#sending-response)
8. [Express Deep Dive](#express-deep-dive)
9. [Handling Routes](#handling-routes)
10. [Route Parameters and Query Strings](#route-parameters-and-query-strings)
11. [Practical Tips](#practical-tips)
12. [Key Takeaways](#key-takeaways)

---

## Learning Goal

By the end of Day 01, you should be able to:

- explain what Express.js is and why it is used
- create a basic Express server
- install and configure Express in a Node.js project
- use middleware to process requests
- send common types of responses
- define and handle routes cleanly

---

## What Is Express.js

Express.js is a minimal and flexible web framework for Node.js.

It helps you build backend applications faster by providing a simpler way to:

- create servers
- handle routes
- process requests and responses
- add middleware
- organize application logic

Without Express, you can still build a server using Node's built-in `http` module, but Express makes the code much cleaner and easier to maintain.

### Simple idea

Node.js gives you the runtime. Express gives you a structure for web applications.

### Common use cases

- REST APIs
- web servers
- backend services
- authentication systems
- CRUD applications

---

## Need of Express.js

If you build everything only with raw Node.js, you have to write more code for common tasks.

Express solves this by making the following easier:

- handling HTTP methods like GET, POST, PUT, DELETE
- extracting route data
- returning JSON or HTML responses
- managing middleware chain
- handling errors in a cleaner way

### Example problem without Express

Using only `http`, you must manually parse URL, request method, headers, and body data.

With Express, this becomes much simpler.

### Why developers prefer Express

- less boilerplate
- easy to learn
- huge ecosystem
- great for APIs
- compatible with most Node.js tools and packages

---

## Installing Express.js

First create a Node.js project if needed:

```bash
npm init -y
```

Then install Express:

```bash
npm install express
```

This adds Express to `dependencies` in `package.json`.

### Basic project structure

```text
project/
├── node_modules/
├── package.json
├── package-lock.json
└── index.js
```

### Verify installation

After installing, you can import it in your app and start using it.

---

## Basic Express App

Here is a simple Express server:

```js
const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
	res.send('Hello from Express');
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
```

### What each part does

- `require('express')` imports the framework
- `express()` creates an app instance
- `app.get()` defines a route
- `res.send()` sends a response to the client
- `app.listen()` starts the server

### Request and response objects

- `req` contains data from the client request
- `res` is used to send data back to the client

---

## Adding Middleware

Middleware is a function that runs between the request and the final response.

It can:

- read request data
- modify request or response objects
- log activity
- perform authentication checks
- stop the request and send an error response
- pass control to the next middleware

### Middleware signature

```js
function middleware(req, res, next) {
	next();
}
```

### Example: simple logger middleware

```js
const express = require('express');
const app = express();

app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});

app.get('/', (req, res) => {
	res.send('Home page');
});

app.listen(3000);
```

### Why `next()` is important

If you do not call `next()`, the request may get stuck and never reach the route handler.

### Types of middleware

- application-level middleware
- route-level middleware
- built-in middleware
- third-party middleware
- error-handling middleware

### Built-in middleware examples

```js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

These help parse incoming JSON and form data.

---

## Sending Response

The response object is used to send data back to the client.

Common methods include:

- `res.send()`
- `res.json()`
- `res.status()`
- `res.end()`
- `res.redirect()`

### `res.send()`

Sends text, HTML, or objects.

```js
app.get('/text', (req, res) => {
	res.send('Plain text response');
});
```

### `res.json()`

Sends JSON data.

```js
app.get('/user', (req, res) => {
	res.json({ name: 'Aman', age: 22 });
});
```

### `res.status()`

Sets the HTTP status code.

```js
app.get('/not-found', (req, res) => {
	res.status(404).send('Page not found');
});
```

### Common status codes

- `200` = OK
- `201` = Created
- `400` = Bad Request
- `401` = Unauthorized
- `403` = Forbidden
- `404` = Not Found
- `500` = Internal Server Error

### Response flow example

```js
app.get('/profile', (req, res) => {
	res.status(200).json({ message: 'Profile loaded successfully' });
});
```

---

## Express Deep Dive

Express is built around the idea of handling HTTP requests in a clean and organized way.

### Core concepts

- app object: the main Express application instance
- request object: incoming client data
- response object: outgoing server data
- middleware: functions that run before the final response
- routing: mapping URLs and HTTP methods to handlers

### Request lifecycle

1. Client sends request
2. Express receives request
3. Middleware runs in order
4. Route handler runs
5. Response is sent

### Why order matters

Express processes middleware and routes from top to bottom.

If one middleware sends a response, later handlers will not run unless `next()` is used properly.

### Example of order

```js
app.use((req, res, next) => {
	console.log('First middleware');
	next();
});

app.use((req, res, next) => {
	console.log('Second middleware');
	next();
});
```

### Express is not opinionated

This means Express gives you flexibility.

You decide:

- folder structure
- middleware order
- error handling style
- project architecture

That flexibility is powerful, but it also means you need good habits.

---

## Handling Routes

Routes tell Express what to do when a request comes to a specific URL and method.

### Common route methods

- `app.get()` for reading data
- `app.post()` for creating data
- `app.put()` for updating data
- `app.delete()` for deleting data

### Example routes

```js
app.get('/', (req, res) => {
	res.send('Home');
});

app.post('/users', (req, res) => {
	res.send('User created');
});

app.put('/users/:id', (req, res) => {
	res.send('User updated');
});

app.delete('/users/:id', (req, res) => {
	res.send('User deleted');
});
```

### Why routes matter

Routes are the public interface of your backend API.

They define how frontend apps, mobile apps, or other services interact with your server.

### Route handler responsibilities

- validate the request
- process the input
- call business logic
- return the correct response

---

## Route Parameters and Query Strings

Express makes it easy to read values from the URL.

### Route parameters

Route parameters are part of the path.

Example:

```js
app.get('/users/:id', (req, res) => {
	const userId = req.params.id;
	res.send(`User ID is ${userId}`);
});
```

If the request is `/users/15`, then `req.params.id` is `15`.

### Query strings

Query strings appear after `?` in the URL.

Example:

```js
app.get('/search', (req, res) => {
	const keyword = req.query.keyword;
	res.send(`Searching for ${keyword}`);
});
```

If the URL is `/search?keyword=node`, then `req.query.keyword` is `node`.

### Difference between params and query

- params identify a specific resource
- query strings usually filter, sort, or search data

---

## Practical Tips

- keep route handlers small
- use middleware for repeated logic
- send proper HTTP status codes
- always validate user input
- organize code into separate files as the app grows
- use `express.json()` before reading JSON request bodies
- log errors with enough detail to debug quickly

### Good practice example

```js
app.use(express.json());

app.post('/users', (req, res) => {
	const { name } = req.body;

	if (!name) {
		return res.status(400).json({ message: 'Name is required' });
	}

	res.status(201).json({ message: 'User created', name });
});
```

### Why this is better

- request body is parsed correctly
- invalid data is rejected early
- response clearly explains what happened

---

## Key Takeaways

- Express.js simplifies backend development with Node.js.
- Middleware runs between the request and response.
- `req` contains incoming data and `res` sends output.
- Routes map HTTP methods and URLs to handlers.
- `res.json()` is the standard way to send API data.
- Route parameters and query strings serve different purposes.

---

## Quick Revision Notes

- Express = Node.js web framework
- middleware = function that runs during request processing
- route = URL + HTTP method handler
- params = `/users/:id`
- query = `/search?keyword=node`
- `res.send()` = text or HTML response
- `res.json()` = JSON response

