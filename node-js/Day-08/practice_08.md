# Day 08 Practice - npm and nodemon

## Objective

Practice npm basics end-to-end:

- initialize a Node.js project
- install production and development packages
- create and run npm scripts
- use nodemon for auto-restart

---

## 1) Create a practice project

Open terminal inside Day-08 folder and run:

```bash
mkdir app
cd app
npm init -y
```

Check generated file:

```bash
type package.json
```

Expected: a default package.json file is created.

---

## 2) Create starter app file

Create index.js with this content:

```js
const now = new Date();
console.log('App started at:', now.toLocaleString());
```

Run it:

```bash
node index.js
```

---

## 3) Install a production package

Install Express:

```bash
npm install express
```

Verify:

```bash
npm list express
```

Open package.json and confirm express is inside dependencies.

---

## 4) Install a dev package

Install nodemon as dev dependency:

```bash
npm install -D nodemon
```

Verify:

```bash
npm list nodemon
```

Open package.json and confirm nodemon is inside devDependencies.

---

## 5) Add npm scripts

Edit package.json scripts section:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js",
  "check": "node -e \"console.log('check script ok')\""
}
```

Run each script:

```bash
npm start
npm run check
npm run dev
```

When dev mode is running, edit index.js and save. nodemon should restart automatically.

---

## 6) Add a tiny Express server

Replace index.js with:

```js
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Day 08 practice');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

Run with nodemon:

```bash
npm run dev
```

Open browser: http://localhost:3000

Change response text and save to test auto-restart.

---

## 7) Useful command drill

Run each command and observe output:

```bash
npm outdated
npm update
npm fund
npm audit
```

Optional safe fix:

```bash
npm audit fix
```

---

## 8) Clean install drill

Delete node_modules and reinstall from lock file:

```bash
rmdir /s /q node_modules
npm ci
```

Why: this simulates CI behavior and ensures reproducible installs.

---

## 9) Quick challenge

1. Add a script named build that prints: Building project...
2. Add another route /health returning JSON with status ok.
3. Change server port to 4000 using an environment variable fallback.

Hint for port fallback:

```js
const PORT = process.env.PORT || 4000;
```

---

## 10) Self-check checklist

- package.json exists and has scripts
- dependencies and devDependencies are used correctly
- npm start works
- npm run dev restarts on file save
- express route responds in browser
- npm ci works after deleting node_modules

If all are done, Day 08 practice is complete.
