# Day 05 — Request & Response in Node.js

---

## Table of Contents

1. [Node Lifecycle & Event Loop](#node-lifecycle--event-loop)
2. [How to Exit Event Loop](#how-to-exit-event-loop)
3. [Understand Request Object](#understand-request-object)
4. [Sending Response](#sending-response)
5. [Routing Requests](#routing-requests)
6. [Taking User Input](#taking-user-input)
7. [Redirecting Requests](#redirecting-requests)
8. [Key Takeaways](#key-takeaways)

---

## Node Lifecycle & Event Loop

When you run a Node app (`node index.js`), Node executes your file and then waits for async work (timers, I/O, network requests).

### High-Level Lifecycle

```
Step 1: Node starts process
Step 2: Loads your JS file
Step 3: Executes synchronous code (top to bottom)
Step 4: Registers async tasks (setTimeout, fs.readFile, server.listen)
Step 5: Enters Event Loop
Step 6: Processes callbacks when operations complete
Step 7: Exits only when no pending tasks remain
```

### What is the Event Loop?

The **Event Loop** is Node’s mechanism to handle non-blocking operations using a single thread for JavaScript execution.

- JS code runs in one main thread.
- Long operations (file/network/db) are delegated to system APIs / thread pool.
- Completed operations push callbacks to queues.
- Event loop picks callbacks and executes them.

### Why It Matters

- Makes Node efficient for I/O-heavy apps.
- Lets one process serve many requests concurrently.
- Avoids blocking code patterns.

### Example

```js
console.log('Start');

setTimeout(() => {
	console.log('Timer callback');
}, 0);

console.log('End');
```

Output:
```
Start
End
Timer callback
```

Even with `0ms`, timer callback runs after synchronous code completes.

---

## How to Exit Event Loop

Node automatically exits when nothing keeps it alive.

### Node Process Will Exit If

- No open server socket
- No active timer/interval
- No pending async I/O work
- No unresolved work that keeps handles open

### Common Ways to Exit

#### 1) Natural Exit (Preferred)

Let all work finish. Node exits by itself.

#### 2) Stop Long-Running Handles

```js
const intervalId = setInterval(() => {
	console.log('running...');
}, 1000);

setTimeout(() => {
	clearInterval(intervalId);
	console.log('interval cleared');
}, 3500);
```

If interval is not cleared, process keeps running.

#### 3) Manual Exit

```js
process.exit(0); // success
// process.exit(1); // failure
```

Use this carefully; it can stop pending work abruptly.

---

## Understand Request Object

In an HTTP server callback, `req` (request object) contains information sent by the client.

```js
const http = require('http');

const server = http.createServer((req, res) => {
	console.log(req.method); // GET, POST, etc.
	console.log(req.url);    // /, /about, /users
	console.log(req.headers);
});
```

### Useful Request Properties

| Property | Meaning |
|----------|---------|
| `req.method` | HTTP method (`GET`, `POST`, etc.) |
| `req.url` | Requested path + query |
| `req.headers` | Request headers object |
| `req.socket.remoteAddress` | Client IP (basic access) |

### Request Body (for POST/PUT)

Data arrives in chunks (stream):

```js
let body = '';

req.on('data', chunk => {
	body += chunk;
});

req.on('end', () => {
	console.log('Body:', body);
});
```

---

## Sending Response

`res` (response object) is used to send data back to client.

### Basic Response

```js
res.write('Hello ');
res.write('World');
res.end();
```

### Set Status and Headers

```js
res.statusCode = 200;
res.setHeader('Content-Type', 'text/html');
res.end('<h1>Home Page</h1>');
```

### Send JSON

```js
const data = { message: 'Success' };
res.setHeader('Content-Type', 'application/json');
res.end(JSON.stringify(data));
```

### Important Rule

`res.end()` must be called once for each request, otherwise client waits forever.

---

## Routing Requests

Routing means sending different responses based on `req.url` and `req.method`.

### Simple Route Handling

```js
const http = require('http');

const server = http.createServer((req, res) => {
	if (req.url === '/' && req.method === 'GET') {
		res.setHeader('Content-Type', 'text/html');
		return res.end('<h1>Home</h1>');
	}

	if (req.url === '/about' && req.method === 'GET') {
		res.setHeader('Content-Type', 'text/html');
		return res.end('<h1>About</h1>');
	}

	res.statusCode = 404;
	res.end('Route not found');
});
```

### Why `return` with `res.end()`?

Prevents further code execution after response is sent.

---

## Taking User Input

In backend apps, user input commonly comes through:

1. URL query params (`/search?q=node`)
2. Route params (framework-based)
3. Request body (`POST` form/JSON)

Here we focus on raw Node body parsing.

### Form Input Example

```js
if (req.url === '/submit' && req.method === 'POST') {
	const bodyParts = [];

	req.on('data', chunk => {
		bodyParts.push(chunk);
	});

	req.on('end', () => {
		const parsedBody = Buffer.concat(bodyParts).toString();
		console.log(parsedBody); // e.g. name=Pulok&age=22

		res.statusCode = 302;
		res.setHeader('Location', '/');
		res.end();
	});

	return;
}
```

### Notes

- Request body is asynchronous.
- Large payloads arrive in multiple chunks.
- You should validate and sanitize input before using it.

---

## Redirecting Requests

Redirect tells browser/client to go to a different URL.

### How Redirect Works

Server sends:

- Status code `301`, `302`, `307`, or `308`
- `Location` header with new URL

### Example (Temporary Redirect)

```js
res.statusCode = 302;
res.setHeader('Location', '/');
res.end();
```

### Common Redirect Codes

| Code | Meaning | Typical Use |
|------|---------|-------------|
| `301` | Moved Permanently | SEO-safe permanent URL change |
| `302` | Found (Temporary) | Temporary redirect after action |
| `307` | Temporary Redirect | Preserve HTTP method/body |
| `308` | Permanent Redirect | Permanent + preserve method/body |

---

## Key Takeaways

- Node runs synchronous code first, then handles async callbacks via event loop.
- Process exits automatically when no active handles remain.
- `req` gives request details (`method`, `url`, `headers`, body stream).
- `res` sends status, headers, and body; always finish with `res.end()`.
- Routing in core Node is manual using `if/else` with URL + method.
- User input from body must be parsed asynchronously and validated.
- Redirect is just status code + `Location` header.