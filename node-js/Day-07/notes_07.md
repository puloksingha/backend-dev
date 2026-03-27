# Day 07 - Event Loop, Runtime, and Async Execution (Detailed Notes)

---

## Table of Contents

1. [Learning Goal](#learning-goal)
2. [Big Picture: How Node.js Executes Code](#big-picture-how-nodejs-executes-code)
3. [Event-Driven Programming](#event-driven-programming)
4. [Single Threaded JavaScript Model](#single-threaded-javascript-model)
5. [V8 vs libuv (Core Difference)](#v8-vs-libuv-core-difference)
6. [What Is Included in Node Runtime](#what-is-included-in-node-runtime)
7. [Call Stack, Heap, and Queues](#call-stack-heap-and-queues)
8. [Event Loop Lifecycle](#event-loop-lifecycle)
9. [Event Loop Phases in Node.js](#event-loop-phases-in-nodejs)
10. [Microtasks: process.nextTick and Promises](#microtasks-processnexttick-and-promises)
11. [setTimeout vs setImmediate](#settimeout-vs-setimmediate)
12. [Asynchronous Styles: Callback, Promise, async/await](#asynchronous-styles-callback-promise-asyncawait)
13. [Blocking vs Non-Blocking Code](#blocking-vs-non-blocking-code)
14. [CPU-Bound Work and Worker Threads](#cpu-bound-work-and-worker-threads)
15. [Thread Pool in libuv](#thread-pool-in-libuv)
16. [Common Production Pitfalls](#common-production-pitfalls)
17. [Performance and Debugging Tips](#performance-and-debugging-tips)
18. [Interview-Style Questions](#interview-style-questions)
19. [Key Takeaways](#key-takeaways)

---

## Learning Goal

By the end of Day 07, you should be able to explain:

- why Node.js can serve many clients with one JS thread
- when callback execution order changes
- how to avoid blocking your server
- when to use worker threads for CPU-heavy jobs

---

## Big Picture: How Node.js Executes Code

Node.js does not run everything directly on one queue.

It combines:

- V8 for JavaScript execution
- libuv for event loop and async I/O orchestration
- OS facilities (networking, file system notifications)
- Node core modules (`fs`, `http`, `net`, `crypto`, etc.)

Simple mental model:

```text
Your JS code -> V8 Call Stack -> Async task delegated -> Callback queued -> Event loop runs callback
```

---

## Event-Driven Programming

Node apps are built around events. You register handlers and react when something happens.

Common backend events:

- new HTTP request
- DB query result
- socket connection closed
- file chunk read

```js
const EventEmitter = require('events');

const appEvents = new EventEmitter();

appEvents.on('order:created', (orderId) => {
	console.log('Processing order:', orderId);
});

appEvents.emit('order:created', 'ORD-101');
```

This style keeps code decoupled and extensible.

---

## Single Threaded JavaScript Model

Node executes JavaScript on one main thread.

That means only one JS function runs at an instant on the main call stack.

Important clarification:

- JS execution is single-threaded.
- Node runtime operations are not strictly single-threaded.
- I/O and some expensive tasks are handled outside the main JS stack.

If one synchronous function takes 2 seconds, all incoming requests wait behind it.

---

## V8 vs libuv (Core Difference)

### V8 responsibilities

- parse and compile JS
- execute JS instructions
- memory management and garbage collection

### libuv responsibilities

- event loop implementation
- async I/O scheduling
- thread pool for selected operations
- cross-platform behavior for OS differences

Summary:

- V8 runs your JavaScript
- libuv makes async behavior possible

---

## What Is Included in Node Runtime

Runtime = environment that executes your backend code.

Node runtime includes:

- V8 engine
- libuv event loop + thread pool
- C/C++ bindings to OS APIs
- Node core APIs (`fs`, `http`, `stream`, `buffer`, `timers`)

This is why the same JS file can behave differently in Browser vs Node.

---

## Call Stack, Heap, and Queues

### Call Stack

- where currently running JS functions live
- LIFO structure (last in, first out)

### Heap

- memory area for objects, arrays, closures
- managed by V8 garbage collector

### Queues

- where callbacks wait before execution
- different queues exist for timers, I/O, check phase, and microtasks

If call stack is busy, queued callbacks must wait.

---

## Event Loop Lifecycle

The loop repeatedly performs this process:

1. check current phase queue
2. move eligible callback to stack
3. execute callback
4. drain microtasks
5. move to next phase

This cycle continues while there are active handles (timers, sockets, server listeners, pending async tasks).

---

## Event Loop Phases in Node.js

Simplified phase order:

1. timers
2. pending callbacks
3. idle/prepare (internal)
4. poll
5. check
6. close callbacks

### 1) Timers phase

Runs callbacks scheduled by `setTimeout` and `setInterval` when threshold time has passed.

### 2) Pending callbacks phase

Executes certain system-level deferred callbacks.

### 3) Poll phase

- waits for I/O events
- executes I/O callbacks
- may block here briefly if nothing else is scheduled

### 4) Check phase

Runs `setImmediate` callbacks.

### 5) Close callbacks

Runs close handlers like `socket.on('close', ...)`.

---

## Microtasks: process.nextTick and Promises

Microtasks run with higher priority than regular phase queues.

In Node.js, `process.nextTick` is processed before Promise microtasks.

Order inside many contexts:

1. current sync code
2. `process.nextTick` queue
3. Promise microtask queue
4. next event loop phase work

```js
console.log('A');

setTimeout(() => console.log('B timeout'), 0);

Promise.resolve().then(() => console.log('C promise'));

process.nextTick(() => console.log('D nextTick'));

console.log('E');
```

Common output:

1. A
2. E
3. D nextTick
4. C promise
5. B timeout

Warning: Recursive `process.nextTick` can starve the event loop.

```js
function starve() {
	process.nextTick(starve);
}

starve();
// Timers and I/O may never get a chance to run
```

---

## setTimeout vs setImmediate

Both schedule async callbacks, but queue placement differs.

- `setTimeout(fn, 0)` -> timers phase
- `setImmediate(fn)` -> check phase

At top-level script, order can vary by environment.
Inside an I/O callback, `setImmediate` often runs before `setTimeout(0)`.

```js
const fs = require('fs');

fs.readFile(__filename, () => {
	setTimeout(() => console.log('timeout'), 0);
	setImmediate(() => console.log('immediate'));
});
```

Typical output in this case:

1. immediate
2. timeout

---

## Asynchronous Styles: Callback, Promise, async/await

### Callback pattern

```js
const fs = require('fs');

fs.readFile('sample.txt', 'utf8', (err, data) => {
	if (err) return console.error(err.message);
	console.log(data);
});
```

### Promise pattern

```js
const fs = require('fs/promises');

fs.readFile('sample.txt', 'utf8')
	.then((data) => console.log(data))
	.catch((err) => console.error(err.message));
```

### async/await pattern

```js
const fs = require('fs/promises');

async function printFile() {
	try {
		const data = await fs.readFile('sample.txt', 'utf8');
		console.log(data);
	} catch (err) {
		console.error(err.message);
	}
}

printFile();
```

Practical choice for most backend code:

- use `async/await` for readability
- use `Promise.all` for independent parallel async operations

---

## Blocking vs Non-Blocking Code

### Blocking example

```js
const fs = require('fs');

const content = fs.readFileSync('big.log', 'utf8');
console.log(content.length);
```

During `readFileSync`, event loop cannot process other requests.

### Non-blocking example

```js
const fs = require('fs');

fs.readFile('big.log', 'utf8', (err, content) => {
	if (err) return console.error(err.message);
	console.log(content.length);
});
```

Server remains responsive and can accept more connections.

---

## CPU-Bound Work and Worker Threads

Async I/O is great, but CPU-heavy work still blocks main JS if executed directly.

CPU-heavy examples:

- image/video transformation
- PDF generation on large data
- heavy encryption loops
- large JSON parse/stringify operations

For these tasks, use:

- `worker_threads` (same process, multiple threads)
- `child_process` (separate process)
- queue system + separate worker service

---

## Thread Pool in libuv

libuv has a thread pool (default size: 4) used by some operations.

Typical pool users:

- `fs` operations
- DNS lookups (`dns.lookup` in specific paths)
- `crypto.pbkdf2`, `crypto.scrypt`
- compression (`zlib`)

You can tune with environment variable:

```bash
UV_THREADPOOL_SIZE=8 node app.js
```

Do not blindly increase this value. Test with realistic workload first.

---

## Common Production Pitfalls

1. Using synchronous APIs inside API handlers.
2. Unhandled Promise rejections causing unstable behavior.
3. Massive `JSON.parse` on event loop thread.
4. Infinite or deep recursion via `process.nextTick`.
5. Long loops in request path (`for` on huge arrays).
6. Assuming callback order without understanding phase queues.

---

## Performance and Debugging Tips

1. Measure event loop lag to detect blocking code.
2. Add request timing logs for slow endpoints.
3. Replace sync methods (`readFileSync`) with async variants.
4. Use streaming for large files (`createReadStream`).
5. Profile CPU when p95 latency grows.

Event loop delay measurement sample:

```js
const { monitorEventLoopDelay } = require('perf_hooks');

const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();

setInterval(() => {
	console.log('Event loop lag p99 (ms):', (histogram.percentile(99) / 1e6).toFixed(2));
	histogram.reset();
}, 5000);
```

---

## Interview-Style Questions

1. If Node is single-threaded, how does it handle many requests concurrently?
2. What is the difference between `process.nextTick` and Promise microtasks?
3. Why can `setImmediate` run before `setTimeout(0)` inside I/O callbacks?
4. When should you use worker threads?
5. Which operations use libuv thread pool?

Try answering these from memory after revision.

---

## Key Takeaways

- Node.js JavaScript execution is single-threaded, but runtime orchestration is not.
- V8 executes JS; libuv manages async lifecycle and event loop behavior.
- Event loop phases determine callback timing and output order.
- Microtasks have higher scheduling priority than normal phase callbacks.
- Non-blocking design is essential for scalable backend systems.
- CPU-bound tasks should move off the main thread.

