# Day 08 - npm and Developer Tools (Detailed Notes)

---

## Table of Contents

1. [Learning Goal](#learning-goal)
2. [What Is npm?](#what-is-npm)
3. [Project Setup with npm init](#project-setup-with-npm-init)
4. [Understanding package.json](#understanding-packagejson)
5. [Dependencies vs Dev Dependencies](#dependencies-vs-dev-dependencies)
6. [How npm Installs Packages](#how-npm-installs-packages)
7. [Installing and Removing Packages](#installing-and-removing-packages)
8. [Semantic Versioning Basics](#semantic-versioning-basics)
9. [npm Scripts in Real Projects](#npm-scripts-in-real-projects)
10. [Useful npm Commands](#useful-npm-commands)
11. [Installing Material Icons](#installing-material-icons)
12. [Installing and Using nodemon](#installing-and-using-nodemon)
13. [Common Errors and Fixes](#common-errors-and-fixes)
14. [Best Practices](#best-practices)
15. [Key Takeaways](#key-takeaways)

---

## Learning Goal

By the end of Day 08, you should be able to:

- initialize any Node.js project quickly
- manage dependencies correctly
- write useful npm scripts for daily development
- use nodemon for auto-restart during coding
- understand and control package versions

---

## What Is npm?

`npm` stands for Node Package Manager.

It is used for:

- installing third-party libraries
- managing project dependencies
- running project scripts
- publishing your own packages

When you install Node.js, npm is installed automatically.

Check versions:

```bash
node -v
npm -v
```

---

## Project Setup with npm init

Start in an empty folder and run:

```bash
npm init
```

This command asks questions and generates a `package.json` file.

Quick setup (skip questions):

```bash
npm init -y
```

This creates default values immediately.

---

## Understanding package.json

`package.json` is the project manifest file.

Typical file:

```json
{
	"name": "day-08-demo",
	"version": "1.0.0",
	"description": "Learning npm scripts and tools",
	"main": "index.js",
	"scripts": {
		"start": "node index.js",
		"dev": "nodemon index.js",
		"test": "echo \"No tests yet\""
	},
	"author": "",
	"license": "ISC"
}
```

Important fields:

- `name`: package/project name
- `version`: current release version
- `main`: entry file
- `scripts`: command shortcuts
- `dependencies`: packages needed in production
- `devDependencies`: packages needed for development

---

## Dependencies vs Dev Dependencies

### dependencies

Libraries your app needs to run in production.

Example:

- `express`
- `mongoose`

Install command:

```bash
npm install express
```

### devDependencies

Tools needed only while developing.

Example:

- `nodemon`
- `eslint`
- `prettier`

Install command:

```bash
npm install -D nodemon
```

---

## How npm Installs Packages

When you run `npm install`:

1. npm reads `package.json`.
2. It downloads required packages.
3. It creates or updates `node_modules`.
4. It writes exact resolved versions to `package-lock.json`.

`package-lock.json` ensures all developers/installations use consistent versions.

---

## Installing and Removing Packages

Install latest package:

```bash
npm install express
```

Install specific version:

```bash
npm install express@4.19.2
```

Install globally (for CLI tools):

```bash
npm install -g nodemon
```

Uninstall package:

```bash
npm uninstall express
```

Install all dependencies from existing project:

```bash
npm install
```

---

## Semantic Versioning Basics

Version format:

```text
MAJOR.MINOR.PATCH
```

Example: `2.4.1`

- MAJOR: breaking changes
- MINOR: new features, backward compatible
- PATCH: bug fixes

Common prefixes in `package.json`:

- `^1.2.3` allows `1.x.x` updates except major bump
- `~1.2.3` allows only patch updates in `1.2.x`
- `1.2.3` exact fixed version

---

## npm Scripts in Real Projects

Scripts are shortcuts for terminal commands.

Example:

```json
{
	"scripts": {
		"start": "node index.js",
		"dev": "nodemon index.js",
		"lint": "eslint .",
		"format": "prettier --write ."
	}
}
```

Run script:

```bash
npm run dev
```

For `start`, shortcut is allowed:

```bash
npm start
```

Benefits:

- no need to remember long commands
- same command format for all teammates
- easier automation in CI/CD

---

## Useful npm Commands

See installed package list:

```bash
npm list
```

Show outdated packages:

```bash
npm outdated
```

Update allowed versions:

```bash
npm update
```

Clean install (often in CI):

```bash
npm ci
```

Why `npm ci`?

- faster and reproducible
- uses lock file exactly
- fails if lock file and package.json are out of sync

---

## Installing Material Icons

If you meant editor icons in VS Code:

1. Open Extensions panel.
2. Install `Material Icon Theme` by Philipp Kief.
3. Activate it from File Icon Theme settings.

If you meant Material Symbols/Icons package in project (frontend case):

```bash
npm install @mui/icons-material @mui/material @emotion/react @emotion/styled
```

Basic usage:

```js
import HomeIcon from '@mui/icons-material/Home';
```

Note: for pure backend projects, this package is usually unnecessary.

---

## Installing and Using nodemon

`nodemon` watches files and restarts your app automatically on changes.

Install as dev dependency (recommended):

```bash
npm install -D nodemon
```

Add script:

```json
{
	"scripts": {
		"dev": "nodemon index.js"
	}
}
```

Run:

```bash
npm run dev
```

Now every save triggers auto-restart.

Optional config file `nodemon.json`:

```json
{
	"watch": ["src"],
	"ext": "js,json",
	"ignore": ["node_modules"],
	"exec": "node src/index.js"
}
```

---

## Common Errors and Fixes

1. `npm: command not found`
	 - Node.js/npm not installed correctly; reinstall Node LTS.

2. Permission errors during global install
	 - Prefer local dev dependency or fix npm prefix permissions.

3. `Cannot find module ...`
	 - Missing install; run `npm install`.

4. Script not found
	 - Ensure script name exists in `package.json`.

5. Lock file conflicts in git
	 - Reinstall dependencies and commit updated `package-lock.json`.

---

## Best Practices

1. Always commit both `package.json` and `package-lock.json`.
2. Keep runtime and dev tools separated (`dependencies` vs `devDependencies`).
3. Use local package binaries via npm scripts.
4. Avoid unnecessary global installs.
5. Use `npm ci` in CI pipelines.
6. Keep scripts simple, clear, and team-friendly.
7. Update dependencies intentionally, not blindly.

---

## Key Takeaways

- npm is central to Node.js project setup and dependency management.
- `package.json` defines project identity, scripts, and required packages.
- Scripts standardize development workflows.
- `nodemon` improves development speed by auto-restarting your server.
- Version understanding (`^`, `~`, exact) helps prevent dependency surprises.
- Good npm habits reduce bugs and onboarding time.