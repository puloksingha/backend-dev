Parsing Request
# Day 06 — Streams, Buffers, and Handling Large Data

---

## Table of Contents

1. [Problem: Handling Large Data](#problem-handling-large-data)
2. [What are Buffers?](#what-are-buffers)
3. [Buffer Basics](#buffer-basics)
4. [What are Streams?](#what-are-streams)
5. [Types of Streams](#types-of-streams)
6. [Understanding Chunks](#understanding-chunks)
7. [Reading Files Chunk-by-Chunk](#reading-files-chunk-by-chunk)
8. [Buffering Chunks](#buffering-chunks)
9. [Practical: Building a Request Parser](#practical-building-a-request-parser)
10. [Streams vs Loading Entire File](#streams-vs-loading-entire-file)
11. [Using Modules (fs, stream, path)](#using-modules-fs-stream-path)
12. [Best Practices for Handling Large Data](#best-practices-for-handling-large-data)
13. [Key Takeaways](#key-takeaways)

---

## Problem: Handling Large Data

Imagine you want to read a **1GB file** from disk. You have two options:

### ❌ Option 1: Load Everything into Memory (Bad)
```js
const fs = require('fs');
const data = fs.readFileSync('large-file.txt'); // Blocks!
// The entire 1GB file is loaded into memory
// Server is frozen while reading
// High memory usage
```

**Problems:**
- Blocking code (synchronous)
- Massive memory consumption
- Server can't handle other requests
- Crashes if file is too large

### ✅ Option 2: Read in Chunks (Good)
```js
const fs = require('fs');
const stream = fs.createReadStream('large-file.txt');
// File is read in 64KB chunks by default
// Non-blocking, memory efficient
stream.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length, 'bytes');
});
```

**Advantages:**
- Non-blocking code
- Low memory footprint
- Server stays responsive
- Can process data as it arrives

---

## What are Buffers?

> A **Buffer** is a fixed-size block of memory in Node.js that stores raw binary data.

### Why Buffers?

JavaScript strings are great for text, but when dealing with **binary data** (images, videos, network packets, files), you need Buffers.

Buffers represent **raw binary data** that cannot be directly displayed as text.

### Buffer vs String

```
String:        "Hello"           (human-readable)
Buffer:        <Buffer 48 65 6c 6c 6f>  (binary representation of "Hello")

String:        "Node.js is awesome!" (text)
Buffer:        <Buffer 4e 6f 64 65 2e 6a 73...>  (bytes)
```

### Creating Buffers

```js
// Method 1: From a string
const buf1 = Buffer.from('Hello', 'utf8');
console.log(buf1);  // <Buffer 48 65 6c 6c 6f>

// Method 2: Allocate empty buffer (n bytes)
const buf2 = Buffer.alloc(10);  // 10 bytes of zeros
console.log(buf2);  // <Buffer 00 00 00 00 00 00 00 00 00 00>

// Method 3: From array of bytes
const buf3 = Buffer.from([72, 101, 108, 108, 111]);
console.log(buf3);  // <Buffer 48 65 6c 6c 6f> = "Hello"

// Method 4: Allocate and don't initialize (faster, but has garbage)
const buf4 = Buffer.allocUnsafe(10);
```

### Buffer Properties & Methods

```js
const buf = Buffer.from('Hello');

// Properties
console.log(buf.length);        // 5 (bytes)
console.log(buf[0]);            // 72 (first byte as decimal)

// Methods
console.log(buf.toString());    // "Hello" (convert back to string)
console.log(buf.toString('hex')); // "48656c6c6f" (hexadecimal)

// Slicing
const slice = buf.slice(0, 3);
console.log(slice.toString());  // "Hel"

// Comparing
const buf2 = Buffer.from('Hello');
console.log(buf.equals(buf2));  // true
```

### Encoding Formats

Buffers can be encoded in different ways:

| Encoding | Usage | Example |
|----------|-------|---------|
| `utf8` (default) | Text data in UTF-8 | "Hello" → `48 65 6c 6c 6f` |
| `ascii` | ASCII text only | "A" → `41` |
| `hex` | Hexadecimal representation | `"48656c6c6f"` |
| `base64` | Base64 encoding (URLs, emails) | "SGVsbG8=" |
| `latin1` | ISO-8859-1 encoding | Legacy text |
| `binary` | Same as latin1 | Legacy |

```js
const text = "Node.js";
const hexBuf = Buffer.from(text, 'hex');  // Error! Invalid hex
const base64Buf = Buffer.from(text).toString('base64');
console.log(base64Buf);  // "Tm9kZS5qcw=="
```

---

## Buffer Basics

### Buffer Allocation and Memory

```js
// Creating different sizes
const small = Buffer.alloc(1);      // 1 byte
const medium = Buffer.alloc(1024);  // 1 KB
const large = Buffer.alloc(1024 * 1024); // 1 MB

// Buffer is allocated on the heap
// JavaScript (V8) manages it automatically
```

### Maximum Buffer Size

```js
// Maximum buffer size depends on your system
// On 64-bit systems: ~2GB
// On 32-bit systems: ~1GB

const huge = Buffer.alloc(2147483647); // ~2GB (limit)
```

### Buffer Operations

```js
const buf = Buffer.from([1, 2, 3, 4, 5]);

// Write values
buf.writeUInt8(255, 0);  // Write 255 at position 0
console.log(buf);        // <Buffer ff 02 03 04 05>

// Read values
const val = buf.readUInt8(0);
console.log(val);        // 255

// Concatenate buffers
const buf1 = Buffer.from('Hello');
const buf2 = Buffer.from(' World');
const combined = Buffer.concat([buf1, buf2]);
console.log(combined.toString()); // "Hello World"
```

---

## What are Streams?

> A **Stream** is an EventEmitter that lets you read data from a source or write data to a destination in **chunks** rather than all at once.

Think of a stream like a **river flowing**: data flows continuously in pieces, not all at once.

### Streams vs Traditional File Reading

```
Traditional (Blocking):
   [===============] Read entire 1GB file into memory
   Server blocked during read
   High memory spike

Streams (Non-blocking):
   [=]→[=]→[=]→[=]→[=]... Read 64KB chunks continuously
   Server stays responsive
   Constant low memory usage
```

### Why Streams?

1. **Memory efficient** — Process small chunks instead of entire files
2. **Speed** — Start processing immediately
3. **Non-blocking** — Other requests can be handled
4. **Backpressure handling** — Control data flow
5. **Perfect for large files, network requests, real-time data**

---

## Types of Streams

Node.js has four main stream types:

### 1. **Readable Streams** (data comes OUT)

```js
const fs = require('fs');
const readable = fs.createReadStream('file.txt');

// Data flows out from file
readable.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
});
```

### 2. **Writable Streams** (data goes IN)

```js
const fs = require('fs');
const writable = fs.createWriteStream('output.txt');

// Write data into stream
writable.write('Hello');
writable.write(' ');
writable.write('World');
writable.end();  // Signal end of writing
```

### 3. **Duplex Streams** (data goes IN and comes OUT)

```js
const net = require('net');
const socket = net.createConnection();

// Socket is both readable and writable
socket.write('Request');  // Writable
socket.on('data', () => {}); // Readable
```

### 4. **Transform Streams** (read → modify → write)

```js
const { Transform } = require('stream');

const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

fs.createReadStream('input.txt')
  .pipe(upperCase)
  .pipe(fs.createWriteStream('output.txt'));
```

---

## Understanding Chunks

### What is a Chunk?

> A **chunk** is a small piece of data from a stream, typically measured in bytes.

### Default Chunk Size

```js
const fs = require('fs');
const readable = fs.createReadStream('huge.txt');

// Default highWaterMark (chunk size) is 64KB
readable.on('data', (chunk) => {
  console.log('Chunk size:', chunk.length, 'bytes');
  // Typically outputs: 65536 (64 * 1024)
});
```

### Custom Chunk Size

```js
// Read smaller chunks (32 KB)
const readable = fs.createReadStream('file.txt', {
  highWaterMark: 32 * 1024  // 32 KB chunks
});

readable.on('data', (chunk) => {
  console.log('Chunk size:', chunk.length);  // ~32KB
});

// Larger chunks (1 MB)
const readable2 = fs.createReadStream('file.txt', {
  highWaterMark: 1024 * 1024  // 1 MB chunks
});
```

### Chunk Flow Control

```js
const readable = fs.createReadStream('file.txt');

readable.on('data', (chunk) => {
  console.log('Processing chunk...');
  
  // If processing is slow, pause the stream
  readable.pause();
  
  setTimeout(() => {
    console.log('Done processing');
    readable.resume();  // Resume reading
  }, 1000);
});
```

---

## Reading Files Chunk-by-Chunk

### Basic File Reading with Streams

```js
const fs = require('fs');

const readable = fs.createReadStream('large-file.txt', {
  encoding: 'utf8',
  highWaterMark: 16 * 1024  // 16 KB chunks
});

readable.on('data', (chunk) => {
  console.log('Received chunk length:', chunk.length);
  console.log('Content:', chunk);
});

readable.on('end', () => {
  console.log('File reading complete');
});

readable.on('error', (err) => {
  console.error('Error reading file:', err);
});
```

### Line-by-Line Reading

```js
const fs = require('fs');
const readline = require('readline');

const readable = fs.createReadStream('data.txt');

const rl = readline.createInterface({
  input: readable,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  console.log('Line:', line);
  // Process each line
});

rl.on('close', () => {
  console.log('All lines read');
});
```

### Copying Large File with Streams

```js
const fs = require('fs');

const readable = fs.createReadStream('original.txt');
const writable = fs.createWriteStream('copy.txt');

readable.pipe(writable);

writable.on('finish', () => {
  console.log('File copied successfully');
});

writable.on('error', (err) => {
  console.error('Error writing file:', err);
});
```

---

## Buffering Chunks

### What is Buffering?

When reading a stream, Node.js buffers chunks in memory while you process them. If you process slowly, the buffer fills up.

### Buffer Visualization

```
File on Disk (1GB)
        ↓ (stream reads in chunks)
    [========================] <- Buffer pool (highWaterMark)
        ↓
    Your processing code
        ↓
    If you're slow...
    [████████████████████] <- Buffer gets full!
        ↓
    Stream pauses reading to prevent memory overflow
```

### Handling Backpressure

When the buffer is full, the stream automatically pauses (backpressure).

```js
const fs = require('fs');
const writable = fs.createWriteStream('output.txt');
const readable = fs.createReadStream('large-file.txt');

readable.on('data', (chunk) => {
  // write() returns boolean indicating if buffer is full
  const canContinue = writable.write(chunk);
  
  if (!canContinue) {
    console.log('Buffer full, pausing read');
    readable.pause();
  }
});

writable.on('drain', () => {
  console.log('Buffer drained, resuming read');
  readable.resume();
});

readable.on('end', () => {
  writable.end();
});
```

### Using .pipe() (Automatic Backpressure Handling)

The easiest way: let `.pipe()` handle backpressure automatically!

```js
const fs = require('fs');

fs.createReadStream('large-file.txt')
  .pipe(fs.createWriteStream('output.txt'));

// .pipe() automatically handles:
// - Backpressure
// - Resuming/pausing
// - Error handling (somewhat)
// - Buffering
```

### Manual Buffering of Chunks

```js
const fs = require('fs');

let buffer = [];
let isProcessing = false;

const readable = fs.createReadStream('data.txt');

readable.on('data', (chunk) => {
  buffer.push(chunk);
  
  if (!isProcessing) {
    processBuffer();
  }
});

async function processBuffer() {
  isProcessing = true;
  
  while (buffer.length > 0) {
    const chunk = buffer.shift();
    console.log('Processing chunk:', chunk);
    // Simulate slow processing
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  isProcessing = false;
}

readable.on('end', () => {
  console.log('All chunks received');
  // Process any remaining
  if (buffer.length > 0) {
    processBuffer();
  }
});
```

---

## Practical: Building a Request Parser

### Scenario: Handling File Uploads

When a client uploads a large file, Node.js receives it as a stream of chunks.

### Basic Request Parser

```js
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    console.log(`Headers: ${JSON.stringify(req.headers)}`);
    
    // req.body is a readable stream
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    
    const filename = `upload_${Date.now()}.bin`;
    const filepath = `${uploadDir}/${filename}`;
    
    const writable = fs.createWriteStream(filepath);
    
    req.pipe(writable);
    
    writable.on('finish', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'success',
        filename: filename
      }));
    });
    
    writable.on('error', (err) => {
      res.writeHead(500);
      res.end('Upload failed');
    });
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

### Parsing Multipart Form Data

```js
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/upload') {
    // Real implementations use 'formidable' or 'busboy' for multipart
    const boundary = req.headers['content-type'].split('boundary=')[1];
    
    let buffer = '';
    
    req.on('data', (chunk) => {
      buffer += chunk.toString();
      
      // Process each chunk to extract parts
      if (buffer.includes(boundary)) {
        const parts = buffer.split(boundary);
        // Parse multipart data...
      }
    });
    
    req.on('end', () => {
      res.end('Form data received');
    });
  }
});

server.listen(3000);
```

### Better Approach: Use a Library

```js
// Using 'busboy' for parsing multipart/form-data
const http = require('http');
const busboy = require('busboy');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    const bb = busboy({ headers: req.headers });
    
    bb.on('file', (fieldname, file, info) => {
      console.log(`File received: ${info.filename}`);
      
      const filepath = path.join('./uploads', info.filename);
      file.pipe(fs.createWriteStream(filepath));
    });
    
    bb.on('finish', () => {
      res.end('Upload complete');
    });
    
    req.pipe(bb);
  }
});

server.listen(3000);
```

---

## Streams vs Loading Entire File

### Comparison Table

| Aspect | Entire File | Streams |
|--------|-------------|---------|
| **Memory Usage** | High (entire file in RAM) | Low (chunk size only) |
| **Speed** | Slower (wait for full load) | Faster (start immediately) |
| **Blocking** | Yes (synchronous or slow async) | No (non-blocking) |
| **Large Files** | Crashes/hangs if too large | Works seamlessly |
| **Scalability** | Can't handle 100s of files | Handles thousands |
| **Complexity** | Simpler code | Slightly more complex |

### Real-World Example

```js
// ❌ BAD: Loading entire file
function handleRequest_Bad(req, res) {
  const data = fs.readFileSync('huge-10gb-file.txt');
  res.write(data);
  res.end();
}
// Memory spike: 10GB!
// Server frozen for seconds!

// ✅ GOOD: Using streams
function handleRequest_Good(req, res) {
  fs.createReadStream('huge-10gb-file.txt').pipe(res);
}
// Memory steady: ~64KB
// Immediate response!
```

---

## Using Modules (fs, stream, path)

### fs (File System) Module

```js
const fs = require('fs');

// Create readable stream
const readable = fs.createReadStream('input.txt', {
  encoding: 'utf8',
  highWaterMark: 64 * 1024
});

// Create writable stream
const writable = fs.createWriteStream('output.txt', {
  encoding: 'utf8'
});

// Stream events
readable.on('data', (chunk) => {
  console.log('Data:', chunk);
});

readable.on('end', () => {
  console.log('File read complete');
});

readable.on('error', (err) => {
  console.error('Read error:', err);
});
```

### stream Module

```js
const { Transform, PassThrough, Readable, Writable } = require('stream');

// Create custom transform stream
const compress = new Transform({
  transform(chunk, encoding, callback) {
    // Process chunk
    const processed = chunk.toString().toUpperCase();
    this.push(processed);
    callback();
  }
});

// Using PassThrough to inspect data
const inspector = new PassThrough();
inspector.on('data', (chunk) => {
  console.log('Inspecting:', chunk.length, 'bytes');
});

// Chain streams
readable.pipe(inspector).pipe(compress).pipe(writable);
```

### path Module

```js
const path = require('path');

// Parse file paths
const filepath = '/home/user/documents/file.txt';

console.log(path.dirname(filepath));    // /home/user/documents
console.log(path.basename(filepath));   // file.txt
console.log(path.extname(filepath));    // .txt
console.log(path.resolve(filepath));    // Full absolute path

// Building paths
const uploadDir = path.join(__dirname, 'uploads');
const filename = `file_${Date.now()}.txt`;
const fullPath = path.join(uploadDir, filename);
```

### Combining All Three Modules

```js
const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

// Process all files in a directory
const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir);

files.forEach(file => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, `processed_${file}`);
  
  const uppercase = new Transform({
    transform(chunk, encoding, callback) {
      this.push(chunk.toString().toUpperCase());
      callback();
    }
  });
  
  fs.createReadStream(inputPath)
    .pipe(uppercase)
    .pipe(fs.createWriteStream(outputPath));
});
```

---

## Best Practices for Handling Large Data

### 1. Always Use Streams for Large Files

```js
// ✅ Good
fs.createReadStream('large.txt').pipe(res);

// ❌ Avoid
const data = fs.readFileSync('large.txt');
res.write(data);
```

### 2. Set Appropriate Chunk Sizes

```js
// For text processing: 16-64 KB
fs.createReadStream('text.txt', { highWaterMark: 64 * 1024 });

// For binary/binary: 256 KB - 1 MB
fs.createReadStream('image.jpg', { highWaterMark: 256 * 1024 });

// For network: 64 KB (default is good)
```

### 3. Handle Errors Properly

```js
const readable = fs.createReadStream('file.txt');
const writable = fs.createWriteStream('output.txt');

readable.on('error', (err) => {
  if (err.code === 'ENOENT') {
    console.error('File not found');
  } else {
    console.error('Read error:', err);
  }
});

writable.on('error', (err) => {
  console.error('Write error:', err);
});

readable.pipe(writable);
```

### 4. Implement Timeouts for Streams

```js
const readable = fs.createReadStream('file.txt');

// Timeout if stream takes too long
const timeout = setTimeout(() => {
  readable.destroy();
  console.error('Stream timeout');
}, 30000);  // 30 seconds

readable.on('finish', () => {
  clearTimeout(timeout);
});
```

### 5. Monitor Stream Health

```js
const readable = fs.createReadStream('large.txt');

let chunkCount = 0;
let totalBytes = 0;

readable.on('data', (chunk) => {
  chunkCount++;
  totalBytes += chunk.length;
  
  if (chunkCount % 100 === 0) {
    console.log(`Processed ${chunkCount} chunks, ${totalBytes} bytes`);
  }
});

readable.on('end', () => {
  console.log(`Total: ${chunkCount} chunks, ${totalBytes} bytes`);
});
```

---

## Key Takeaways

1. **Buffers** store raw binary data; use them when working with non-text data
2. **Streams** process data in chunks without loading everything into memory
3. **Chunks** are fixed-size pieces of data (default 64KB for file streams)
4. **Backpressure** is automatic with `.pipe()` — let it handle flow control
5. **Use streams for large files** — they're memory-efficient and non-blocking
6. Use **fs, stream, and path modules** together for file processing
7. **Always handle errors** in stream operations
8. Choose appropriate **highWaterMark** based on your use case
9. **Line-by-line processing** needs the `readline` module
10. For **form uploads**, use libraries like `busboy` or `formidable`

---

## Practice Problems

1. Create a readable stream to process a large log file line-by-line
2. Build a transform stream that filters out certain lines
3. Copy a 1GB file using streams and measure performance
4. Create a simple HTTP file upload handler using streams
5. Implement custom backpressure handling (pause/resume)
6. Process multiple streams concurrently without blocking

