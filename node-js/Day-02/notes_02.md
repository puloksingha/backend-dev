# Day 02 — Node.js Modules, npm, and package.json

---

## Table of Contents

1. [Recap of Day 01](#recap-of-day-01)
2. [What is a Module in Node.js?](#what-is-a-module-in-nodejs)
3. [Types of Modules](#types-of-modules)
4. [CommonJS Module System](#commonjs-module-system)
5. [ES Modules (ESM)](#es-modules-esm)
6. [CommonJS vs ESM](#commonjs-vs-esm)
7. [The npm Ecosystem](#the-npm-ecosystem)
8. [Understanding package.json](#understanding-packagejson)
9. [Dependencies vs Dev Dependencies](#dependencies-vs-dev-dependencies)
10. [Semantic Versioning (SemVer)](#semantic-versioning-semver)
11. [Useful npm Commands](#useful-npm-commands)
12. [Node.js Built-in Core Modules](#nodejs-built-in-core-modules)
13. [Path Module Basics](#path-module-basics)
14. [File System (fs) Basics](#file-system-fs-basics)
15. [Practical Mini Project Structure](#practical-mini-project-structure)
16. [Key Takeaways](#key-takeaways)

---

## Recap of Day 01

From Day 01, you learned:

- Node.js is a JavaScript runtime built on V8
- Node.js uses an event-driven, non-blocking model
- JavaScript in Node.js and Browser is the same language, but APIs are different
- Node.js is ideal for I/O-heavy applications

Day 02 focuses on writing maintainable backend code using modules and package management.

---

## What is a Module in Node.js?

A **module** is a reusable block of code (variables, functions, classes, objects) that can be exported from one file and imported into another.

Why modules matter:

- Better code organization
- Reusability
- Easier testing
- Cleaner project structure

Example idea:

```
math.js       -> exports add(), subtract()
app.js        -> imports and uses those functions
```

---

## Types of Modules

Node.js uses three main categories:

1. **Core (built-in) modules**
	 - Provided by Node.js itself
	 - Example: `fs`, `path`, `http`, `os`

2. **Local (custom) modules**
	 - Files you create in your own project
	 - Example: `./utils/logger.js`

3. **Third-party modules**
	 - Installed using npm
	 - Example: `express`, `dotenv`, `mongoose`

---

## CommonJS Module System

CommonJS is the traditional Node.js module format.

- Export with `module.exports` or `exports`
- Import with `require()`

### Exporting (CommonJS)

```js
// math.js
function add(a, b) {
	return a + b;
}

function subtract(a, b) {
	return a - b;
}

module.exports = { add, subtract };
```

### Importing (CommonJS)

```js
// app.js
const math = require('./math');

console.log(math.add(10, 5));       // 15
console.log(math.subtract(10, 5));  // 5
```

---

## ES Modules (ESM)

ESM is the modern JavaScript module standard.

- Export with `export`
- Import with `import`

To use ESM in Node.js, set this in `package.json`:

```json
{
	"type": "module"
}
```

### Exporting (ESM)

```js
// math.js
export function add(a, b) {
	return a + b;
}

export function subtract(a, b) {
	return a - b;
}
```

### Importing (ESM)

```js
// app.js
import { add, subtract } from './math.js';

console.log(add(10, 5));
console.log(subtract(10, 5));
```

---

## CommonJS vs ESM

| Feature | CommonJS | ESM |
|--------|----------|-----|
| Import style | `require()` | `import` |
| Export style | `module.exports` | `export` |
| File extension behavior | Often implicit | Usually explicit (`.js`) |
| Node default (old projects) | Common | Less common in old projects |
| Browser support | No | Yes |

Use one style consistently in a project to avoid confusion.

---

## The npm Ecosystem

**npm** = Node Package Manager.

It helps you:

- Install packages
- Manage versions
- Run scripts
- Publish your own packages

Initialize a project:

```bash
npm init -y
```

This creates `package.json` automatically.

---

## Understanding package.json

`package.json` is the manifest of your Node.js project.

Example:

```json
{
	"name": "day-02-demo",
	"version": "1.0.0",
	"description": "Learning Node.js modules and npm",
	"main": "app.js",
	"scripts": {
		"start": "node app.js",
		"dev": "node --watch app.js"
	},
	"type": "commonjs",
	"author": "Pulok",
	"license": "ISC"
}
```

Important keys:

- `name`, `version`
- `main` (entry file)
- `scripts` (custom commands)
- `dependencies`, `devDependencies`
- `type` (`commonjs` or `module`)

---

## Dependencies vs Dev Dependencies

- **dependencies**: required at runtime
	- Install with: `npm install express`

- **devDependencies**: required only for development
	- Install with: `npm install -D nodemon`

Example:

```json
{
	"dependencies": {
		"express": "^4.19.2"
	},
	"devDependencies": {
		"nodemon": "^3.1.0"
	}
}
```

---

## Semantic Versioning (SemVer)

Version format:

```
MAJOR.MINOR.PATCH
```

Example: `2.5.3`

- **MAJOR**: breaking changes
- **MINOR**: new backward-compatible features
- **PATCH**: backward-compatible bug fixes

Common symbols in `package.json`:

- `^1.2.3` → allow MINOR + PATCH updates
- `~1.2.3` → allow PATCH updates only
- `1.2.3` → exact version only

---

## Useful npm Commands

```bash
npm init -y                 # create package.json
npm install <package>       # install dependency
npm install -D <package>    # install dev dependency
npm uninstall <package>     # remove package
npm run <script-name>       # run script from package.json
npm start                   # run start script
npm run dev                 # run dev script
npm list --depth=0          # list top-level installed packages
```

---

## Node.js Built-in Core Modules

You don't install these with npm.

Common core modules:

- `fs` → file system operations
- `path` → file path handling
- `os` → operating system info
- `http` → create HTTP servers
- `url` → URL parsing utilities

Example:

```js
const os = require('os');

console.log(os.platform());
console.log(os.arch());
console.log(os.cpus().length);
```

---

## Path Module Basics

`path` helps create safe, cross-platform paths.

```js
const path = require('path');

const filePath = path.join(__dirname, 'data', 'users.json');
console.log(filePath);

console.log(path.basename(filePath)); // users.json
console.log(path.extname(filePath));  // .json
```

Use `path.join()` instead of manual string concatenation.

---

## File System (fs) Basics

Read and write files using `fs`.

### Synchronous (blocking)

```js
const fs = require('fs');

const text = fs.readFileSync('notes.txt', 'utf8');
console.log(text);
```

### Asynchronous (non-blocking)

```js
const fs = require('fs');

fs.readFile('notes.txt', 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log(data);
});
```

Prefer async methods in server applications.

---

## Practical Mini Project Structure

```
project/
	package.json
	app.js
	utils/
		logger.js
		math.js
	data/
		users.json
```

Suggested workflow:

1. `npm init -y`
2. Create reusable local modules in `utils/`
3. Import modules into `app.js`
4. Add scripts in `package.json`
5. Run with `npm start`

---

## Key Takeaways

- Node.js modules make code reusable and maintainable
- CommonJS and ESM are two module systems (pick one style per project)
- npm manages third-party packages and scripts
- `package.json` is the core configuration file for a Node project
- Understanding `fs` and `path` is essential for backend development

Day 03 can continue with:

- Creating an HTTP server with the `http` module
- Request/response lifecycle
- Basic routing without Express
