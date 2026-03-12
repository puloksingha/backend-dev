# Day 01 — Introduction to Node.js

---

## Table of Contents

1. [What is Node.js?](#what-is-nodejs)
2. [History of Node.js](#history-of-nodejs)
3. [How Node.js Works — The V8 Engine](#how-nodejs-works--the-v8-engine)
4. [Node.js Architecture — Event Loop & Non-blocking I/O](#nodejs-architecture--event-loop--non-blocking-io)
5. [Node.js Features](#nodejs-features)
6. [Browser JS vs Node.js — Key Differences](#browser-js-vs-nodejs--key-differences)
7. [Local Storage vs Session Storage vs Cookies](#local-storage-vs-session-storage-vs-cookies)
8. [JavaScript on the Client](#javascript-on-the-client)
9. [JavaScript on the Server](#javascript-on-the-server)
10. [Client Code vs Server Code](#client-code-vs-server-code)
11. [Installing Node.js](#installing-nodejs)
12. [Your First Node.js Program](#your-first-nodejs-program)
13. [Node.js Global Objects](#nodejs-global-objects)
14. [Node.js Module System](#nodejs-module-system)
15. [When to Use Node.js (and When NOT to)](#when-to-use-nodejs-and-when-not-to)
16. [Key Takeaways](#key-takeaways)

---

## What is Node.js?

> **Node.js** is an open-source, cross-platform **JavaScript runtime environment** built on Chrome's **V8 engine** that allows you to execute JavaScript code **outside** of a web browser.

Before Node.js (created in **2009 by Ryan Dahl**), JavaScript could only run inside browsers. Node.js changed that by taking Chrome's powerful V8 engine and wrapping it with C++ APIs for file system access, networking, and more — giving JavaScript the ability to work as a **server-side language**.

In simple terms:

```
Node.js = V8 Engine (C++) + Backend Capabilities (fs, http, net, os, etc.)
```

### Why was Node.js created?

Ryan Dahl was frustrated with the way traditional web servers (like Apache) handled connections:

- **Apache** created a **new thread** for every incoming connection  expensive, limited scalability
- **Node.js** uses a **single-threaded event loop** with non-blocking I/O  handles thousands of concurrent connections efficiently

```
Traditional Server (Apache):
  Request 1  Thread 1 (blocked while waiting for DB)
  Request 2  Thread 2 (blocked while waiting for file)
  Request 3  Thread 3 (blocked while waiting for API)
  ... runs out of threads!

Node.js Server:
  Request 1  Event Loop (sends DB query, moves on)
  Request 2  Event Loop (sends file read, moves on)
  Request 3  Event Loop (sends API call, moves on)
  ... callbacks fire when results are ready!
```

---

## History of Node.js

| Year | Milestone |
|------|-----------|
| **2009** | Ryan Dahl creates Node.js; initial release for Linux only |
| **2010** | **npm** (Node Package Manager) is introduced — the package ecosystem begins |
| **2011** | Windows support added; Node.js gains enterprise traction |
| **2014** | **io.js** forks from Node.js due to governance disagreements |
| **2015** | io.js merges back  **Node.js Foundation** formed; Node.js v4.0 released |
| **2017** | Node.js becomes one of the most popular backend technologies globally |
| **2019** | Node.js Foundation merges with JS Foundation  **OpenJS Foundation** |
| **2023** | Node.js 20+ with built-in `fetch`, test runner, and permission model |
| **2024+** | Continued evolution with ESM support, performance improvements, and security features |

---

## How Node.js Works — The V8 Engine

### What is V8?

**V8** is Google's open-source **JavaScript engine** written in **C++**. It powers:
- Google Chrome browser
- Node.js runtime
- Deno runtime
- Edge browser (Chromium-based)

### How V8 executes JavaScript:

```
JavaScript Source Code
        
   [ Parser ]  Generates AST (Abstract Syntax Tree)
        
   [ Ignition ]  Interprets AST into Bytecode (fast startup)
        
   [ TurboFan ]  Optimizing Compiler (hot code  machine code)
        
   Native Machine Code (runs directly on CPU)
```

**Key points:**
- V8 does **NOT** interpret JS line by line — it uses **JIT (Just-In-Time) compilation**
- Frequently executed ("hot") code gets compiled to **optimized machine code** by TurboFan
- This is why Node.js is significantly **faster** than traditional interpreted languages for many tasks

### V8 in Node.js vs Browser

```
    
        BROWSER                          NODE.JS              
                                                              
   JavaScript Code                  JavaScript Code           
                                                            
      V8 Engine                        V8 Engine              
                                                            
   Web APIs (DOM, fetch,            C++ Bindings (fs, http,   
   localStorage, etc.)              net, os, crypto, etc.)    
                                                            
   Renders Web Page                 Runs Server / Scripts     
    
```

---

## Node.js Architecture — Event Loop & Non-blocking I/O

This is the **most important concept** to understand about Node.js.

### Single-Threaded but Highly Concurrent

Node.js runs on a **single thread** but uses an **event-driven, non-blocking I/O model** to handle many operations concurrently.

### The Event Loop (Simplified)

```
   
>         Timers                setTimeout(), setInterval()
  
  
       Pending Callbacks         I/O callbacks deferred from previous loop
  
  
         Idle / Prepare          Internal use only
  
  
            Poll                 Retrieve new I/O events; execute callbacks
  
  
            Check                setImmediate() callbacks
  
  
       Close Callbacks           socket.on('close', ...)
  

```

### Blocking vs Non-blocking Example

**Blocking (Synchronous):**
```js
const fs = require('fs');

// This BLOCKS the entire thread until the file is fully read
const data = fs.readFileSync('/path/to/file.txt', 'utf8');
console.log(data);
console.log('This runs AFTER the file is read');
```

**Non-blocking (Asynchronous):**
```js
const fs = require('fs');

// This does NOT block — Node.js continues to the next line immediately
fs.readFile('/path/to/file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);  // Runs when file reading is DONE
});
console.log('This runs BEFORE the file is read!');
```

### What happens under the hood?

```
1. Your code calls fs.readFile()
2. Node.js delegates the file read to libuv (C++ thread pool)
3. The Event Loop continues processing other tasks
4. When the file is read, libuv pushes the callback to the event queue
5. The Event Loop picks up the callback and executes it
```

> **libuv** is a C library that provides Node.js with its asynchronous I/O capabilities — it manages the thread pool, event loop, and OS-level async operations.

---

## Node.js Features

### What Node.js **CAN** do (vs. Browser JS)

| Feature | Description | Example |
|---------|-------------|---------|
| **Non-blocking I/O** | Async operations by default — perfect for I/O-heavy workloads | `fs.readFile()`, `http.get()` |
| **Networking** | TCP/UDP sockets for low-level network apps | `net.createServer()`, `dgram` module |
| **File System Access** | Read/write/delete files and directories | `fs.readFile()`, `fs.writeFile()`, `fs.mkdir()` |
| **Server-Side Logic** | Handle HTTP requests, build web servers | `http.createServer()` |
| **Modules** | Organize code into reusable pieces | `require()` (CJS) or `import` (ESM) |
| **Process Management** | Spawn child processes, access environment variables | `child_process.exec()`, `process.env` |
| **OS Information** | Access operating system details | `os.cpus()`, `os.freemem()`, `os.platform()` |
| **Streams** | Process data piece by piece (memory efficient) | `fs.createReadStream()`, pipe operations |
| **Crypto** | Hashing, encryption, secure random numbers | `crypto.createHash()`, `crypto.randomBytes()` |
| **Path Utilities** | Cross-platform file path manipulation | `path.join()`, `path.resolve()` |

### What Node.js **DOES NOT** have (Browser-only)

| Missing in Node.js | What it is | Node.js Alternative |
|---------------------|-----------|---------------------|
| `window` object | Browser's global object | `global` or `globalThis` |
| `document` (DOM) | Web page manipulation API | No equivalent — use template engines (EJS, Pug) |
| `navigator` / `screen` (BOM) | Browser/device info | `os` module for system info |
| `localStorage` / `sessionStorage` | Client-side key-value storage | Use files, databases, or Redis |
| `alert()` / `prompt()` / `confirm()` | Browser dialog boxes | `readline` module or CLI libraries |
| `XMLHttpRequest` | Legacy AJAX calls | `http` module or `fetch` (v18+) |
| CSS / Rendering Engine | Visual rendering | No GUI — Node.js is headless |

---

## Browser JS vs Node.js — Key Differences

```

                    JAVASCRIPT (The Language)                      
         Variables, Functions, Loops, Objects, Promises...         

    BROWSER Environment         NODE.JS Environment              
                                                                 
   window / document       global / process                    
   DOM API                 fs (file system)                    
   Fetch API               http / https                        
   Web Storage             net / dgram (sockets)               
   Canvas / WebGL          os / path / crypto                  
   Service Workers         child_process                       
   Web Audio API           stream / buffer                     
                            npm ecosystem                       

```

JavaScript itself is the **same language** in both environments. The difference is in the **APIs and capabilities** provided by each environment.

---

## Local Storage vs Session Storage vs Cookies

> These are all **browser-side** storage mechanisms. They do NOT exist in Node.js.

| Feature | Local Storage | Session Storage | Cookies |
|---------|---------------|-----------------|---------|
| **Capacity** | ~5–10 MB | ~5 MB | ~4 KB per cookie |
| **Lifetime** | Persists until manually cleared | Cleared when tab/window closes | Configurable expiry (or session) |
| **Sent with HTTP requests?** | No | No | Yes — automatically sent with every request to the domain |
| **Accessibility** | Same origin, all tabs | Same origin, **same tab only** | Same origin (configurable via domain/path) |
| **API** | `localStorage.setItem()` | `sessionStorage.setItem()` | `document.cookie` |
| **Use cases** | User preferences, theme, cached data | Temporary form data, wizard steps | Auth tokens, tracking, CSRF tokens |
| **Security** | Vulnerable to XSS | Vulnerable to XSS | Can be `HttpOnly` (safer from XSS), `Secure`, `SameSite` |
| **Accessible from Server?** | No | No | Yes — server reads cookies from request headers |

### Code Examples

```js
// Local Storage
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme');  // 'dark'
localStorage.removeItem('theme');

// Session Storage
sessionStorage.setItem('step', '3');
const step = sessionStorage.getItem('step');  // '3'

// Cookies
document.cookie = "username=Pulok; expires=Fri, 31 Dec 2026 23:59:59 GMT; path=/";
console.log(document.cookie);  // "username=Pulok"
```

---

## JavaScript on the Client

The **browser** is the client-side JS environment. Here is what it handles:

### 1. Rendering Web Pages
The browser's rendering engine parses HTML and CSS to display the visual page.

```
HTML + CSS + JS  Browser Engine  Pixels on Screen
```

### 2. User Interaction
JavaScript captures and responds to user events:

```js
document.getElementById('btn').addEventListener('click', () => {
  alert('Button clicked!');
});
```

### 3. Dynamic Content (DOM Manipulation)
Update the page without reloading:

```js
const heading = document.querySelector('h1');
heading.textContent = 'Updated Heading!';
heading.style.color = 'blue';
```

### 4. Fetching Data from Server (AJAX / Fetch)
Request data from the backend asynchronously:

```js
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 5. Client-side Validation
Validate forms before sending data to the server:

```js
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

### 6. Loading Resources
Browser fetches HTML, CSS, images, fonts, and scripts from the server via HTTP.

---

## JavaScript on the Server

With **Node.js**, JavaScript handles the entire backend:

### 1. Database Management (CRUD)
Interact with databases like MongoDB, PostgreSQL, MySQL.

```js
// Example with MongoDB (using mongoose)
const User = require('./models/User');

// Create
const newUser = await User.create({ name: 'Pulok', email: 'pulok@example.com' });

// Read
const users = await User.find({});

// Update
await User.findByIdAndUpdate(id, { name: 'Updated Name' });

// Delete
await User.findByIdAndDelete(id);
```

### 2. Authentication
Verify who the user is.

```js
// Password hashing with bcrypt
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash('mypassword', 10);
const isMatch = await bcrypt.compare('mypassword', hashedPassword);  // true
```

### 3. Authorization
Control what the user can access.

```js
// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}
```

### 4. Input Validation
Never trust user input — always validate on the server.

```js
// Example: Check if email is valid and name is not empty
if (!email || !email.includes('@')) {
  return res.status(400).json({ error: 'Invalid email' });
}
```

### 5. Session Management
Track users across requests (stateless HTTP needs help).

```
Client sends request  Server checks session/token  Identifies user  Responds
```

### 6. API Management
Build RESTful APIs that frontends and mobile apps consume:

```js
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Pulok' }]);
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### 7. Error Handling

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
```

### 8. Security Measures

| Threat | Protection |
|--------|-----------|
| **SQL Injection** | Use parameterized queries / ORM |
| **XSS** | Sanitize output, use Content Security Policy |
| **CSRF** | Use CSRF tokens, SameSite cookies |
| **Brute Force** | Rate limiting (e.g., `express-rate-limit`) |

### 9. Data Encryption

```js
const crypto = require('crypto');

// Hashing
const hash = crypto.createHash('sha256').update('secret').digest('hex');

// HTTPS ensures encryption in transit (TLS/SSL)
```

### 10. Logging & Monitoring
Use libraries like `winston` or `morgan` to track application activity.

```js
const morgan = require('morgan');
app.use(morgan('dev'));
// Output: GET /api/users 200 12.345 ms
```

---

## Client Code vs Server Code

| Aspect | Client-Side (Browser) | Server-Side (Node.js) |
|--------|----------------------|----------------------|
| **Runs on** | User's browser | Remote server or cloud (AWS, Vercel, etc.) |
| **Language** | HTML, CSS, JavaScript | JavaScript (Node.js), Python, Go, Java, etc. |
| **Access to** | DOM, BOM, Web APIs, Canvas | File system, databases, network sockets, OS |
| **Security** | Code is **visible** (View Source / DevTools) | Code is **hidden** from end users |
| **State** | Stored in browser (memory, storage, cookies) | Stored in databases, sessions, cache (Redis) |
| **Purpose** | UI rendering, user interaction, animations | Business logic, data processing, APIs |
| **Frameworks** | React, Vue, Angular, Svelte | Express.js, Fastify, NestJS, Koa |
| **Execution** | Triggered by user actions (clicks, scrolls) | Triggered by HTTP requests, cron jobs, events |
| **Network** | Makes requests TO the server | Receives requests FROM clients |

### How They Work Together

```
         HTTP Request          
                                     
   CLIENT         (GET /api/users)               SERVER         
   (Browser)                                     (Node.js)      
                                     
   React App           JSON Response             Express API    
                  [{ id: 1, name: "Pulok" }]                    
                                
                                                      
  Renders UI                                    Queries Database
  Handles clicks                                Validates data
  Shows animations                              Manages auth
```

---

## Installing Node.js

### Download

Go to [https://nodejs.org](https://nodejs.org) and download:
- **LTS (Long Term Support)** — Recommended for most users and production
- **Current** — Latest features, may be less stable

### Verify Installation

Open your terminal and run:

```bash
node --version     # e.g., v20.11.0
npm --version      # e.g., 10.2.0
```

### What gets installed?

| Tool | Purpose |
|------|---------|
| `node` | The Node.js runtime — runs JS files |
| `npm` | Node Package Manager — install/manage third-party packages |
| `npx` | Execute packages without globally installing them |

---

## Your First Node.js Program

### Hello World

Create a file called `hello.js`:

```js
console.log('Hello, Node.js!');
```

Run it in the terminal:

```bash
node hello.js
# Output: Hello, Node.js!
```

### Simple HTTP Server

Create a file called `server.js`:

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node.js Server!');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

Run it:

```bash
node server.js
```

Open `http://localhost:3000` in your browser — you should see "Hello from Node.js Server!"

### How the HTTP server works:

```
1. require('http')          Load the built-in HTTP module
2. http.createServer()      Create a server with a callback function
3. Callback receives:
   - req (request)          Info about the incoming request (URL, method, headers)
   - res (response)         Object to send back a response
4. res.writeHead(200, ...)  Set status code and headers
5. res.end('...')           Send response body and close connection
6. server.listen(3000)      Start listening on port 3000
```

---

## Node.js Global Objects

Unlike browsers (which have `window`), Node.js provides its own global objects:

| Global | Description | Example |
|--------|-------------|---------|
| `global` | The top-level global object (like `window` in browsers) | `global.myVar = 42` |
| `globalThis` | Universal global (works in browser AND Node.js) | `globalThis.myVar` |
| `process` | Info about the current Node.js process | `process.env`, `process.argv`, `process.exit()` |
| `__dirname` | Absolute path of the current file's directory | `/home/user/project/src` |
| `__filename` | Absolute path of the current file | `/home/user/project/src/app.js` |
| `console` | Logging to stdout/stderr | `console.log()`, `console.error()` |
| `setTimeout` | Schedule a function after delay | `setTimeout(() => {}, 1000)` |
| `setInterval` | Repeat a function at intervals | `setInterval(() => {}, 1000)` |
| `setImmediate` | Execute after the current event loop cycle | `setImmediate(() => {})` |
| `Buffer` | Handle binary data | `Buffer.from('hello')` |
| `require()` | Import modules (CommonJS) | `const fs = require('fs')` |
| `module` | Reference to the current module | `module.exports = { ... }` |
| `exports` | Shorthand for `module.exports` | `exports.myFunc = () => {}` |

### process Object (commonly used)

```js
console.log(process.version);    // Node.js version: v20.11.0
console.log(process.platform);   // OS: 'win32', 'linux', 'darwin'
console.log(process.cwd());      // Current working directory
console.log(process.env.PATH);   // Environment variable
console.log(process.argv);       // Command-line arguments array
process.exit(0);                 // Exit the process (0 = success)
```

---

## Node.js Module System

Node.js uses modules to organize code. There are two systems:

### 1. CommonJS (CJS) — Default in Node.js

```js
// math.js — Exporting
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
module.exports = { add, subtract };

// app.js — Importing
const { add, subtract } = require('./math');
console.log(add(2, 3));       // 5
console.log(subtract(5, 2));  // 3
```

### 2. ES Modules (ESM) — Modern Standard

To use ESM, either:
- Name your file `.mjs`, OR
- Add `"type": "module"` to your `package.json`

```js
// math.mjs — Exporting
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }

// app.mjs — Importing
import { add, subtract } from './math.mjs';
console.log(add(2, 3));       // 5
```

### 3. Built-in Modules (No installation needed)

| Module | Purpose | Example |
|--------|---------|---------|
| `fs` | File system operations | `fs.readFile()`, `fs.writeFile()` |
| `http` | Create HTTP server/client | `http.createServer()` |
| `path` | File path utilities | `path.join()`, `path.resolve()` |
| `os` | Operating system info | `os.cpus()`, `os.freemem()` |
| `crypto` | Cryptographic operations | `crypto.createHash()` |
| `url` | URL parsing and formatting | `new URL()` |
| `events` | Event emitter pattern | `EventEmitter` class |
| `stream` | Streaming data | `Readable`, `Writable` streams |
| `util` | Utility functions | `util.promisify()` |
| `child_process` | Run system commands | `exec()`, `spawn()` |

### 4. Third-party Modules (via npm)

```bash
npm init -y                 # Initialize a project with package.json
npm install express         # Install Express.js
npm install nodemon --save-dev  # Install as dev dependency
```

```js
const express = require('express');  // Use the installed package
```

---

## When to Use Node.js (and When NOT to)

### Best For

| Use Case | Why Node.js? |
|----------|-------------|
| **REST APIs** | Fast I/O, JSON-native, huge npm ecosystem |
| **Real-time Apps** | WebSockets, chat apps, live updates (Socket.io) |
| **Microservices** | Lightweight, fast startup, easy containerization |
| **Streaming** | Handles data streams efficiently (video, file uploads) |
| **CLI Tools** | Quick to build, npm for distribution |
| **Server-Side Rendering** | Next.js, Nuxt.js for SEO-friendly apps |
| **IoT / Embedded** | Low resource footprint, event-driven model |

### NOT Ideal For

| Use Case | Why Not? | Better Alternative |
|----------|----------|-------------------|
| **CPU-heavy computation** | Single-threaded — blocks the event loop | Python, Go, Rust, C++ |
| **Machine Learning** | Limited ML libraries compared to Python | Python (TensorFlow, PyTorch) |
| **Heavy data processing** | Not designed for number crunching | Python (NumPy), Java, Scala (Spark) |
| **Desktop GUI apps** | Possible (Electron) but heavy | Native frameworks (Swift, Kotlin) |

> **Note:** Node.js *can* handle CPU tasks using **Worker Threads** or **child processes**, but it is not its primary strength.

---

## Key Takeaways

1. **Node.js** = V8 Engine + Backend APIs  JavaScript on the server
2. It uses a **single-threaded event loop** with **non-blocking I/O** for high concurrency
3. **V8** compiles JavaScript to machine code using JIT compilation
4. Node.js gives JS access to **file system, networking, OS, crypto** — things browsers cannot do
5. The **module system** (CJS / ESM) keeps code organized and reusable
6. **npm** provides access to over 2 million packages
7. Node.js is ideal for **I/O-bound** tasks (APIs, real-time apps, microservices) but not for **CPU-bound** tasks
8. Understanding the **Event Loop** is fundamental to writing efficient Node.js code

---

> *"Node.js is not a framework. It is not a library. It is a runtime environment."* — Every Node.js tutorial ever.

---

**Next:** Day 02 — Modules, npm, and Building Your First Express Server.

--- 