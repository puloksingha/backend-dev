# Day 09 - Errors and Debugging (Detailed Notes)

---

## Table of Contents

1. [Learning Goal](#learning-goal)
2. [Why Errors Matter](#why-errors-matter)
3. [Types of Errors](#types-of-errors)
4. [Syntax Errors](#syntax-errors)
5. [Runtime Errors](#runtime-errors)
6. [Logical Errors](#logical-errors)
7. [Using the Debugger](#using-the-debugger)
8. [Debugger with Async Code](#debugger-with-async-code)
9. [Restart Debug with nodemon](#restart-debug-with-nodemon)
10. [Practical Debugging Workflow](#practical-debugging-workflow)
11. [Best Practices](#best-practices)
12. [Key Takeaways](#key-takeaways)

---

## Learning Goal

By the end of Day 09, you should be able to:

- identify common error types in Node.js
- read error messages and locate the real problem quickly
- use VS Code debugger breakpoints, step controls, and watch values
- debug asynchronous code without guessing
- restart debugging automatically while using nodemon

---

## Why Errors Matter

Errors are part of normal development.

Good developers do not try to avoid every error. They learn how to:

- understand what the error is saying
- find the exact line causing the issue
- fix the root cause instead of masking the problem
- build code that fails clearly and predictably

In backend development, debugging skills matter because problems often come from:

- user input
- API responses
- database calls
- file system operations
- asynchronous timing issues

---

## Types of Errors

In JavaScript and Node.js, the three most important error categories are:

1. Syntax errors
2. Runtime errors
3. Logical errors

Each one looks different and needs a different debugging approach.

---

## Syntax Errors

Syntax errors happen when JavaScript code is written in an invalid format.

The JavaScript engine cannot even start running the file if syntax is broken.

### Common causes

- missing parentheses, braces, or brackets
- missing commas
- misspelled keywords
- incorrect string quotes
- invalid object or function structure

### Example

```js
function add(a, b) {
	return a + b
}

console.log(add(2, 3);
```

This code has a missing closing parenthesis after `add(2, 3)`.

### Typical error message

```text
SyntaxError: missing ) after argument list
```

### How to fix syntax errors

- read the line number carefully
- check the line before the reported line too
- look for missing closing symbols
- use editor formatting and linting
- make sure strings and template literals are closed

### Important note

Sometimes the actual mistake is one line above the line mentioned in the error message.

---

## Runtime Errors

Runtime errors happen while the program is running.

The syntax is valid, but something goes wrong during execution.

### Common causes

- calling a function on `undefined` or `null`
- accessing a property that does not exist
- dividing by invalid values
- reading a file that is missing
- database connection failure
- network request failure

### Example

```js
const user = null;

console.log(user.name);
```

### Typical error message

```text
TypeError: Cannot read properties of null (reading 'name')
```

### What this means

The code is valid JavaScript, but at runtime `user` is `null`, so `user.name` cannot be read.

### How to handle runtime errors

- check values before using them
- use `if` conditions for null or undefined checks
- wrap risky operations in `try...catch`
- validate user input early
- log useful context when an operation fails

### Example with try...catch

```js
try {
	const data = JSON.parse('{ invalid json }');
	console.log(data);
} catch (error) {
	console.log('Failed to parse JSON:', error.message);
}
```

This prevents the app from crashing immediately and lets you show a controlled message.

---

## Logical Errors

Logical errors are the hardest to detect because the code runs without crashing, but the result is wrong.

### Common causes

- incorrect formula or condition
- wrong variable used in calculation
- off-by-one mistakes in loops
- reversed comparison operators
- misunderstanding the business rule

### Example

```js
function calculateDiscount(price) {
	return price * 0.2;
}

console.log(calculateDiscount(100));
```

If the intended discount was 20 percent off, this may be correct. But if the goal was to return the final price after discount, the logic is incomplete.

### Another example

```js
function isAdult(age) {
	return age > 18;
}
```

This excludes age 18, which may be wrong depending on the rule. The correct condition might be `age >= 18`.

### How to find logical errors

- add console logs at key points
- compare expected output with actual output
- test edge cases
- inspect variables with the debugger
- write small, isolated examples

### Key idea

If the program does not crash but behaves incorrectly, the bug is usually logical.

---

## Using the Debugger

The debugger is a tool that lets you pause code and inspect what is happening step by step.

In VS Code, the debugger is especially useful for:

- checking variable values
- following execution flow
- understanding function calls
- identifying where the wrong value appears
- inspecting async behavior

### Basic debugger features

- breakpoints: pause execution on a line
- step over: run the current line and move to the next one
- step into: go inside a function call
- step out: finish the current function and return
- continue: resume until the next breakpoint
- watch: monitor values during execution
- call stack: see the path of function calls

### Example debugging scenario

```js
function divide(a, b) {
	return a / b;
}

const result = divide(10, 0);
console.log(result);
```

If you set a breakpoint inside `divide`, you can inspect `a` and `b` before the division happens.

### What to inspect while paused

- current line
- local variables
- function arguments
- call stack
- output in the debug console

### Why this helps

Logging can show you what happened after the fact. The debugger lets you inspect the exact state before the bug appears.

---

## Debugger with Async Code

Async code is harder to debug because execution does not happen in one straight line.

Promises, `setTimeout`, file operations, and database calls all complete later.

### Example

```js
function fetchUser() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ name: 'Aman' });
		}, 1000);
	});
}

async function main() {
	const user = await fetchUser();
	console.log(user.name);
}

main();
```

### What makes async debugging tricky

- code pauses and resumes later
- stack traces may not show the original trigger clearly
- values may change before callback execution
- multiple async operations can run at the same time

### How to debug async code well

- place breakpoints inside `async` functions and callbacks
- inspect promise results after `await`
- check callback arguments carefully
- use `try...catch` around awaited code
- break the logic into smaller functions

### Example with error handling

```js
async function loadData() {
	try {
		const response = await fetch('https://example.com/api/users');
		const data = await response.json();
		console.log(data);
	} catch (error) {
		console.log('Async error:', error.message);
	}
}
```

### Important concept

When debugging async code, remember that the point where the error appears may be different from the point where the problem started.

---

## Restart Debug with nodemon

`nodemon` automatically restarts your Node.js app when files change.

This is helpful during debugging because you do not need to manually stop and rerun the app after every edit.

### Install nodemon

```bash
npm install -D nodemon
```

### Example script in package.json

```json
{
	"scripts": {
		"dev": "nodemon index.js"
	}
}
```

### Run the app

```bash
npm run dev
```

### Why it helps with debugging

- the app restarts automatically after changes
- you can keep the debugger attached
- iteration becomes faster
- you spend less time on manual restarts

### Common setup idea

Use `nodemon` for development and regular `node` for production-style runs.

---

## Practical Debugging Workflow

A simple debugging workflow saves a lot of time.

### Step 1: Read the error carefully

- identify the error type
- note the file and line number
- read the full message, not just the first line

### Step 2: Reproduce the issue

- run the code again
- confirm when the problem happens
- reduce the problem to the smallest possible example

### Step 3: Inspect values

- log the input values
- check function arguments
- verify returned results
- inspect the call stack if needed

### Step 4: Use the debugger

- set breakpoints
- step through the code
- inspect variables at the moment of failure

### Step 5: Fix and verify

- correct the root cause
- rerun the test or command
- check edge cases

### Step 6: Prevent repeat issues

- add validation
- add error handling
- write tests for the failing case

---

## Best Practices

- do not ignore error messages
- avoid fixing bugs by trial and error only
- use meaningful variable names so the code is easier to inspect
- validate input before using it
- keep functions small and focused
- log enough context to debug, but do not flood the console
- use `try...catch` where failure is expected
- learn to read stack traces
- test edge cases like empty values, `null`, `undefined`, and invalid input

### A good mindset

If something fails, ask:

- What did I expect?
- What actually happened?
- Where did the values become wrong?
- Is this a syntax, runtime, or logical issue?

---

## Key Takeaways

- Syntax errors stop code from running at all.
- Runtime errors happen while the code is executing.
- Logical errors produce wrong results without crashing.
- The debugger is better than guessing when a bug is hard to trace.
- Async code needs extra care because execution happens later.
- `nodemon` makes development debugging faster by restarting automatically.

---

## Quick Revision Notes

- syntax error = invalid code structure
- runtime error = valid code, failed execution
- logical error = valid and running code, wrong output
- breakpoint = pause execution at a chosen line
- step over = run current line
- step into = enter a function
- step out = finish current function
