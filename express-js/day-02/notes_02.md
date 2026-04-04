# Day 02 - Express.js Deep Dive (Detailed Notes)

---

## Table of Contents

1. [Learning Goal](#learning-goal)
2. [Parsing Requests](#parsing-requests)
3. [Express Router](#express-router)
4. [Adding 404 Handling](#adding-404-handling)
5. [Common Paths in Node.js](#common-paths-in-nodejs)
6. [Adding HTML Files](#adding-html-files)
7. [Serving HTML Files](#serving-html-files)
8. [Using a File Helper](#using-a-file-helper)
9. [Suggested Folder Structure](#suggested-folder-structure)
10. [Mini Practice](#mini-practice)
11. [Key Takeaways](#key-takeaways)

---

## Learning Goal

By the end of Day 02, you should be able to:

- parse JSON and form request bodies
- create modular routes using `express.Router()`
- handle unknown routes using a 404 fallback
- work safely with file paths using Node's `path` module
- serve HTML pages with `res.sendFile()`
- create a reusable helper for file paths

---

## Parsing Requests

Client requests can send data in different ways:

- URL params (example: `/users/:id`)
- query strings (example: `/search?name=rahul`)
- request body (JSON or form data)

### Middleware for body parsing

```js
const express = require('express');
const app = express();

// Parse incoming JSON body
app.use(express.json());

// Parse form data: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
```

### Reading request data

```js
app.post('/submit', (req, res) => {
	console.log(req.body); // body data
	res.send('Data received');
});

app.get('/users/:id', (req, res) => {
	console.log(req.params.id); // route param
	res.send(`User id: ${req.params.id}`);
});

app.get('/search', (req, res) => {
	console.log(req.query.name); // query param
	res.send(`Searching for: ${req.query.name}`);
});
```

### Quick summary

- `req.body` -> body payload
- `req.params` -> dynamic route values
- `req.query` -> query string values

---

## Express Router

As app size grows, putting all routes in one file becomes messy.

`express.Router()` helps split routes into separate modules.

### Example router file

```js
// routes/admin.js
const express = require('express');
const router = express.Router();

router.get('/add-product', (req, res) => {
	res.send('<h1>Add Product Page</h1>');
});

module.exports = router;
```

### Use router in main app

```js
// app.js
const express = require('express');
const app = express();

const adminRoutes = require('./routes/admin');

app.use('/admin', adminRoutes);

app.listen(3000);
```

Now route becomes: `/admin/add-product`.

### Why Router is useful

- keeps code modular
- easier to maintain
- easier to test specific route groups
- cleaner project structure

---

## Adding 404 Handling

A 404 route should be added after all valid routes.

```js
app.use((req, res) => {
	res.status(404).send('<h1>Page Not Found</h1>');
});
```

Why last?

- Express checks routes in order
- fallback route should run only when no other route matches

---

## Common Paths in Node.js

When serving files, avoid hardcoded paths.

Use built-in `path` module:

```js
const path = require('path');
```

Common values:

- `__dirname` -> current file's directory
- `__filename` -> current file path
- `path.join()` -> safely joins path segments

### Example

```js
const path = require('path');

const filePath = path.join(__dirname, 'views', 'shop.html');
```

`path.join()` handles separators correctly on Windows, Linux, and macOS.

---

## Adding HTML Files

Create a `views` folder and place static HTML files.

Example:

```text
views/
	shop.html
	add-product.html
```

Simple `shop.html`:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Shop</title>
	</head>
	<body>
		<h1>Welcome to Shop</h1>
	</body>
</html>
```

---

## Serving HTML Files

Use `res.sendFile()` to return HTML files.

```js
const path = require('path');

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'shop.html'));
});
```

Important:

- use absolute path for `sendFile`
- `path.join(__dirname, ...)` is the safest approach

---

## Using a File Helper

When many files need base path, create a helper once.

### Helper file

```js
// utils/path.js
const path = require('path');

module.exports = path.dirname(require.main.filename);
```

### Use helper in routes

```js
// routes/shop.js
const path = require('path');
const express = require('express');
const rootDir = require('../utils/path');

const router = express.Router();

router.get('/', (req, res) => {
	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
```

### Why this helps

- avoids repeating relative path logic
- keeps route files clean
- reduces path mistakes

---

## Suggested Folder Structure

```text
project/
	app.js
	routes/
		admin.js
		shop.js
	views/
		add-product.html
		shop.html
	utils/
		path.js
```

---

## Mini Practice

Try this mini task:

1. Create two route files: `shop.js` and `admin.js`
2. Add `/` route in `shop.js` and `/admin/add-product` in `admin.js`
3. Serve HTML pages using `sendFile`
4. Add body parsing middleware
5. Add final 404 handler

If all routes work and unknown URLs return 404, your Day 02 concepts are clear.

---

## Key Takeaways

- `express.json()` and `express.urlencoded()` parse incoming body data
- `express.Router()` keeps route logic modular
- 404 middleware must be placed at the end
- `path.join()` + `__dirname` prevents path issues
- `res.sendFile()` is used to send HTML files
- a custom root path helper simplifies file serving across route files

