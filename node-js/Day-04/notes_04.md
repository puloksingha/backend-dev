# Day 04 — Building Your First Node Server

---

## Table of Contents

1. [How DNS Works?](#how-dns-works)
2. [How Web Works?](#how-web-works)
3. [What are Protocols?](#what-are-protocols)
4. [Node Core Modules](#node-core-modules)
5. [Require Keyword](#require-keyword)
6. [Creating Your First Node Server](#creating-your-first-node-server)
7. [Key Takeaways](#key-takeaways)

---

## How DNS Works?

**DNS (Domain Name System)** is the internet's phone book that translates human-readable domain names into IP addresses.

### The Problem

Computers communicate using **IP addresses** (like `142.251.41.14`), but humans remember names (like `google.com`).

DNS solves this by maintaining a database of domain names and their corresponding IP addresses.

### How DNS Resolution Works

```
Step 1: User enters "google.com" in browser
        ↓
Step 2: Browser queries a Recursive Resolver (ISP's DNS server)
        ↓
Step 3: Recursive Resolver queries Root Nameserver
        "Where is google.com?"
        ↓
Step 4: Root Nameserver returns address of TLD Nameserver
        "Ask the .com nameserver"
        ↓
Step 5: Recursive Resolver queries TLD Nameserver (.com)
        ↓
Step 6: TLD Nameserver returns address of Authoritative Nameserver
        "Check Google's nameserver"
        ↓
Step 7: Recursive Resolver queries Authoritative Nameserver
        ↓
Step 8: Authoritative Nameserver returns IP address: 142.251.41.14
        ↓
Step 9: Browser receives IP and connects to the server
        ↓
Step 10: Website loads!
```

### DNS Components

| Component | Role |
|-----------|------|
| **Recursive Resolver** | Intermediary between user and nameservers (usually ISP) |
| **Root Nameserver** | Directs to appropriate TLD nameserver |
| **TLD Nameserver** | Handles top-level domain (.com, .org, .net, etc.) |
| **Authoritative Nameserver** | Stores actual IP address for the domain |

### DNS Record Types

| Type | Purpose | Example |
|------|---------|---------|
| **A Record** | Maps domain to IPv4 address | google.com → 142.251.41.14 |
| **AAAA Record** | Maps domain to IPv6 address | google.com → 2607:f8b0:4004:... |
| **CNAME** | Domain alias | www.google.com → google.com |
| **MX Record** | Mail server address | Directs emails for the domain |
| **NS Record** | Nameserver | Points to authoritative nameserver |
| **TXT Record** | Text information | Verification, SPF, DKIM records |

### DNS Caching

DNS results are cached at multiple levels:

1. **Browser Cache** — Stores results for minutes
2. **OS Cache** — Stores results at system level
3. **ISP/Resolver Cache** — Stores at network level
4. **Authoritative Nameserver** — Master record

**TTL (Time To Live)** determines how long a record stays cached (typically 300-86400 seconds).

---

## How Web Works?

### The Client-Server Model

The web operates on a **request-response** model:

```
USER (Client)                              WEB SERVER
     ↓                                            ↑
  Opens browser          ─── HTTP Request ───→   
  Types URL              (GET /index.html)        
                                                  
                         ← HTTP Response ←
                         (HTML + CSS + JS)
     ↓                                            ↓
  Receives response
  Browser renders
  Page displays
```

### Step-by-Step Web Request

**1. User Action**
```
User types "https://example.com" in browser
```

**2. DNS Lookup**
```
Browser resolves example.com → 93.184.216.34
```

**3. TCP Connection**
```
Browser establishes TCP connection on port 80 (HTTP) or 443 (HTTPS)
Three-way handshake:
  - Client sends SYN
  - Server sends SYN-ACK
  - Client sends ACK
```

**4. HTTP Request**
```http
GET / HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0...
Accept: text/html
Connection: keep-alive
```

**5. Server Processing**
```
Server receives request
Routes to appropriate handler
Generates response (HTML/JSON/etc)
```

**6. HTTP Response**
```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234
Set-Cookie: session=abc123

<html>
  <head><title>Example</title></head>
  <body>Hello World!</body>
</html>
```

**7. Browser Rendering**
```
Browser parses HTML
Loads CSS and JavaScript
Renders page
Executes JavaScript
Page is interactive
```

**8. Connection Close**
```
(With HTTP/1.1 keep-alive, connection may stay open)
Connection closes or remains for future requests
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| **2xx** | Success | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirect | 301 Moved Permanently, 304 Not Modified |
| **4xx** | Client Error | 400 Bad Request, 404 Not Found, 403 Forbidden |
| **5xx** | Server Error | 500 Internal Error, 502 Bad Gateway, 503 Unavailable |

### HTTP Methods

| Method | Purpose | Idempotent? |
|--------|---------|-------------|
| **GET** | Retrieve data | Yes |
| **POST** | Create new resource | No |
| **PUT** | Update entire resource | Yes |
| **PATCH** | Partial update | No |
| **DELETE** | Remove resource | Yes |
| **HEAD** | Like GET but no body | Yes |
| **OPTIONS** | Describe communication options | Yes |

---

## What are Protocols?

A **protocol** is a set of rules and standards for communication between computers or systems.

### Real-World Analogy

```
Handshake Protocol (Social):
- Person A: Extends hand
- Person B: Grasps hand
- Both: Shake up and down
- Both: Release hand
- Result: Friendly greeting established

Network Protocol:
- Device A: Sends formatted data with headers
- Device B: Recognizes format and rules
- Device B: Processes data correctly
- Device B: Sends response following same rules
- Result: Communication established
```

### Common Internet Protocols

#### **TCP/IP (Transmission Control Protocol / Internet Protocol)**

**TCP:**
- Ensures reliable, ordered delivery of data
- Establishes connection before sending (connection-oriented)
- Slower but guaranteed
- Used for: HTTP, HTTPS, FTP, Email

**IP:**
- Routes packets across the internet
- Assigns addresses (IPv4/IPv6)
- Works with TCP for full communication stack

**Why TCP/IP?**
```
TCP = Postal Service (ensures delivery, maintains order)
IP = Address System (ensures packet reaches right location)
```

#### **HTTP/HTTPS (HyperText Transfer Protocol/Secure)**

- **HTTP:** Plain text, unencrypted (insecure)
- **HTTPS:** Encrypted with SSL/TLS (secure)
- Stateless (each request is independent)
- Request-response model
- Port 80 (HTTP), Port 443 (HTTPS)

#### **DNS (Domain Name System)**

- Translates domain names to IP addresses
- Uses UDP (unreliable but fast)
- Port 53
- Hierarchical structure

#### **FTP (File Transfer Protocol)**

- Transfers files between computers
- Port 21 (control), Port 20 (data)
- Older, less secure (replaced by SFTP/FTPS)

#### **SSH (Secure Shell)**

- Secure remote login and file transfer
- Encrypted communication
- Port 22
- Replaces Telnet

#### **SMTP/POP3/IMAP (Email Protocols)**

- **SMTP:** Sending emails (Port 25, 587, 465)
- **POP3:** Receiving emails (Port 110)
- **IMAP:** Email management (Port 143, 993)

### OSI Model Layers

Protocols work at different network layers:

| Layer | Name | Examples | Function |
|-------|------|----------|----------|
| 7 | Application | HTTP, FTP, DNS, SMTP | User applications |
| 6 | Presentation | SSL/TLS, Image formats | Data formatting |
| 5 | Session | NetBIOS, SSH | Session management |
| 4 | Transport | TCP, UDP | End-to-end communication |
| 3 | Network | IP, ICMP | Routing |
| 2 | Data Link | Ethernet, WiFi | Physical addressing (MAC) |
| 1 | Physical | Cables, Radio | Raw bits transmission |

---

## Node Core Modules

Node.js comes with built-in **core modules** that provide essential functionality without installation.

### Essential Core Modules

#### **1. fs (File System)**

Interact with the file system:

```javascript
const fs = require('fs');

// Read file synchronously
const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);

// Read file asynchronously
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Write file
fs.writeFileSync('output.txt', 'Hello World');
```

#### **2. http**

Create web servers:

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
```

#### **3. path**

Handle file paths safely:

```javascript
const path = require('path');

console.log(path.join(__dirname, 'src', 'index.js'));
// Output: /absolute/path/src/index.js

console.log(path.basename('/src/index.js')); // index.js
console.log(path.dirname('/src/index.js'));  // /src
console.log(path.extname('/src/index.js'));  // .js
```

#### **4. os**

Access operating system information:

```javascript
const os = require('os');

console.log(os.platform());     // 'win32', 'darwin', 'linux'
console.log(os.arch());         // 'x64', 'arm64'
console.log(os.cpus().length);  // Number of CPUs
console.log(os.freemem());      // Free memory in bytes
console.log(os.homedir());      // User home directory
```

#### **5. events**

Work with events:

```javascript
const EventEmitter = require('events');

const emitter = new EventEmitter();

emitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

emitter.emit('greet', 'Pulok');
// Output: Hello, Pulok!
```

#### **6. util**

Utility functions:

```javascript
const util = require('util');

// Promisify callback-based functions
const fs = require('fs');
const readFileAsync = util.promisify(fs.readFile);

readFileAsync('file.txt', 'utf8')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

#### **7. stream**

Handle large data efficiently:

```javascript
const fs = require('fs');

// Read file as stream (memory efficient)
const readStream = fs.createReadStream('large-file.txt');

readStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes`);
});

readStream.on('end', () => {
  console.log('Read complete');
});
```

#### **8. process**

Access process information:

```javascript
const process = require('process');

console.log(process.pid);           // Process ID
console.log(process.argv);          // Command line arguments
console.log(process.cwd());         // Current working directory
console.log(process.env.NODE_ENV);  // Environment variables

process.exit(0);                    // Exit with code 0
```

### Complete List of Core Modules

```
assert         - Assertion testing
buffer         - Buffer handling
child_process  - Spawn child processes
cluster        - Multi-core server
crypto         - Cryptographic functions
dns            - DNS lookups
domain         - Error handling (deprecated)
events         - Event-driven architecture
fs             - File system operations
http           - HTTP server/client
https          - HTTPS server/client
net            - TCP/UDP networking
os             - Operating system info
path           - File path utilities
querystring    - Parse URL query strings
readline       - Read lines from input
stream         - Stream data handling
string_decoder - Decode buffers to strings
tls            - TLS/SSL encryption
url            - URL utilities
util           - Utility functions
vm             - Run code in VM context
zlib           - Compression
```

---

## Require Keyword

The **require keyword** is used to import modules in Node.js (CommonJS).

### Syntax

```javascript
const moduleName = require('module-path');
```

### Types of Requires

#### **1. Core Modules**

```javascript
const fs = require('fs');
const http = require('http');
const path = require('path');
```

#### **2. Third-party Modules**

```javascript
const express = require('express');
const dotenv = require('dotenv');
```

#### **3. Local Modules**

```javascript
// Relative path
const utils = require('./utils');           // Same directory
const math = require('./math/calculator');  // Subdirectory
const config = require('../config');        // Parent directory
```

### How Require Works

When you write `require('module-name')`, Node.js:

1. **Check if it's a core module** (fs, http, etc.)
2. **Check node_modules directory** (third-party packages)
3. **Check local file/directory** (./module.js, ./module/index.js)
4. **Cache the module** (subsequent requires return cached version)
5. **Return the exported object**

### Module Caching

```javascript
// app.js
const math = require('./math');
const math2 = require('./math');

// math === math2 (same reference, module cached)
```

### Require Only Executes Once

```javascript
// counter.js
let count = 0;

module.exports = {
  increment: () => ++count,
  getCount: () => count
};

// app.js
const counter1 = require('./counter');
const counter2 = require('./counter');

counter1.increment();
console.log(counter1.getCount()); // 1
console.log(counter2.getCount()); // 1 (same instance)
```

### Require vs Import

| Feature | require() | import |
|---------|-----------|--------|
| **Type** | CommonJS (traditional) | ES Modules (modern) |
| **Timing** | Runtime | Parse time |
| **Async** | Synchronous | Can be async |
| **Node Support** | Native | Requires .mjs or package.json config |

---

## Creating Your First Node Server

### What is a Server?

A **server** is a program that listens for requests and sends responses. It runs continuously and waits for client connections.

```
CLIENT (Browser)              SERVER (Node.js)
    ↓                              ↑
  Request  ──────────────────→  Listen & Process
    ↓                              ↓
  Response ←──────────────────  Send Response
```

### Step 1: Create Project Structure

```bash
mkdir my-node-server
cd my-node-server
```

### Step 2: Create index.js

```javascript
// index.js
const http = require('http');

// Create server
const server = http.createServer((req, res) => {
  // req = request object (contains info about request)
  // res = response object (used to send response)
  
  console.log(`${req.method} ${req.url}`);
  
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <body>
          <h1>Welcome to My Node Server!</h1>
          <p>This is your first server.</p>
        </body>
      </html>
    `);
  } 
  else if (req.url === '/about' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('About Page');
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Page Not Found');
  }
});

// Server listens on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

### Step 3: Run the Server

```bash
node index.js
```

**Output:**
```
Server running at http://localhost:3000/
GET /
```

### Step 4: Test the Server

Open browser and visit:

- `http://localhost:3000/` → Welcome page
- `http://localhost:3000/about` → About page
- `http://localhost:3000/unknown` → 404 error

### Handling Query Parameters

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;
  
  console.log('Query:', query);
  
  if (parsedUrl.pathname === '/search') {
    const q = query.q || 'no query';
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Search results for: ${q}`);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello!');
  }
});

server.listen(3000, () => {
  console.log('Server on http://localhost:3000');
});
```

**Test with query:**
```
http://localhost:3000/search?q=nodejs
```

### Handling POST Requests

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      console.log('Received:', body);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Data received');
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <form method="POST">
        <input type="text" name="username" placeholder="Username">
        <button type="submit">Submit</button>
      </form>
    `);
  }
});

server.listen(3000);
```

### Graceful Shutdown

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Server running');
});

server.listen(3000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```

**Shutdown with:** `Ctrl+C`

---

## Key Takeaways

✓ DNS translates domain names to IP addresses through a hierarchical system  
✓ Web communication follows the client-server request-response model  
✓ Protocols are standardized rules for network communication  
✓ Node.js provides built-in core modules for common tasks  
✓ `require()` keyword imports modules in Node.js  
✓ HTTP server listens for requests and sends responses  
✓ You can handle GET, POST, and other HTTP methods  
✓ Query parameters and POST data can be processed  
✓ Proper error handling and graceful shutdown improve server reliability