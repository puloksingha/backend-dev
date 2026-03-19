# Day 03 — Setting Up Your Node.js Development Environment

---

## Table of Contents

1. [What is IDE](#what-is-ide)
2. [Need of IDE](#need-of-ide)
3. [MAC Setup](#mac-setup)
4. [Windows Setup](#windows-setup)
5. [Linux Setup](#linux-setup)
6. [VsCode Overview](#vscode-overview)
7. [VsCode Extensions and Settings](#vscode-extensions-and-settings)
8. [Executing Your First .js File](#executing-first-js-file)
9. [What is REPL](#what-is-repl)
10. [Executing Code via REPL](#executing-code-via-repl)

---

## What is IDE?

An **IDE (Integrated Development Environment)** is a software application that provides comprehensive tools for software development in one unified interface.

### Components of an IDE:

- **Code Editor** — Write and edit code with syntax highlighting
- **Compiler/Interpreter** — Execute code
- **Debugger** — Find and fix errors
- **Version Control Integration** — Manage git repositories
- **Build Tools** — Automate compilation and testing
- **Package Manager** — Manage project dependencies

### Common IDEs for JavaScript/Node.js:

| IDE | Platform | Best For |
|-----|----------|----------|
| **VS Code** | Windows, Mac, Linux | Lightweight, extensible, most popular |
| **WebStorm** | Windows, Mac, Linux | Full-featured, enterprise-grade |
| **Sublime Text** | Windows, Mac, Linux | Fast, minimalist |
| **Atom** (Deprecated) | Windows, Mac, Linux | Community-driven |

---

## Need of IDE?

### Why use an IDE instead of a text editor?

1. **Syntax Highlighting** — Highlights code structure for better readability

2. **Code Completion (IntelliSense)** — Auto-suggests functions, variables, and imports

3. **Debugging** — Set breakpoints, step through code, inspect variables

4. **Built-in Terminal** — Run commands without switching windows

5. **Version Control** — Manage git commits, branches, and diffs visually

6. **Extensions & Plugins** — Extend functionality with community tools

7. **Error Detection** — Real-time linting and error checking

8. **Refactoring Tools** — Rename variables, extract functions, fix imports automatically

9. **Multi-file Navigation** — Quickly jump between files in large projects

10. **Project Structure Overview** — Tree view of files and folders

---

## MAC Setup

### Step 1: Install Node.js

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version
3. Open the installer and follow the installation wizard
4. Accept the default installation paths
5. Verify installation:

```bash
node --version
npm --version
```

### Step 2: Install VS Code

1. Visit [code.visualstudio.com](https://code.visualstudio.com/)
2. Click "Download for Mac"
3. Choose the appropriate version:
   - **Apple Silicon** (M1/M2/M3 chips)
   - **Intel Chip**
4. Open the downloaded file and drag VS Code to Applications folder
5. Launch VS Code from Applications

### Step 3: Verify Installation

Open Terminal and run:

```bash
code --version
```

---

## Windows Setup

### Step 1: Install Node.js

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version for Windows
3. Run the `.msi` installer
4. Follow the installation wizard (accept defaults)
5. Verify installation by opening PowerShell:

```powershell
node --version
npm --version
```

### Step 2: Install VS Code

1. Visit [code.visualstudio.com](https://code.visualstudio.com/)
2. Click "Download for Windows"
3. Run the installer (`.exe`)
4. Choose installation path and select:
   - ✓ Add to PATH
   - ✓ Create desktop icon
5. Complete installation

### Step 3: Verify and Test

Open PowerShell/Command Prompt:

```powershell
code --version
node -e "console.log('Node.js is working!')"
```

---

## Linux Setup

### Step 1: Install Node.js

#### Using Package Manager (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install nodejs npm
```

#### Using NodeSource Repository (Latest Versions):

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:

```bash
node --version
npm --version
```

### Step 2: Install VS Code

```bash
sudo apt install software-properties-common apt-transport-https wget
wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"
sudo apt update
sudo apt install code
```

### Step 3: Verify

```bash
code --version
```

---

## VsCode Overview

### VS Code Interface

**Left Sidebar (Activity Bar):**
- File Explorer — Browse project files
- Search — Find text across files
- Source Control — Git integration
- Run and Debug — Debugging tools
- Extensions — Install and manage extensions

**Main Editor Area:**
- Open files as tabs
- Side-by-side editing support
- Split view for multiple files

**Bottom Status Bar:**
- Line and column numbers
- File encoding
- Language mode
- Git branch info

### Essential VS Code Features

1. **Command Palette** — `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Quick access to all commands

2. **File Explorer** — `Ctrl+B` or click file icon
   - Navigate project structure

3. **Search** — `Ctrl+F`
   - Find text in current file

4. **Replace** — `Ctrl+H`
   - Find and replace text

5. **Go to Definition** — `F12` or `Ctrl+Click`
   - Jump to function/variable definition

6. **Integrated Terminal** — `Ctrl+`` (backtick)
   - Run commands without leaving editor

---

## VsCode Extensions and Settings

### Essential Extensions for Node.js Development

1. **ES7+ React/Redux/React-Native snippets** (dsznajder.es7-react-js-snippets)
   - Code snippets for JavaScript

2. **Prettier - Code formatter** (esbenp.prettier-vscode)
   - Auto-format code on save

3. **ESLint** (dbaeumer.vscode-eslint)
   - Real-time linting

4. **Thunder Client** or **REST Client** (humao.rest-client)
   - Test APIs directly in VS Code

5. **Postman** (postmanlabs.postman)
   - API testing and documentation

6. **Live Server** (ritwickdey.liveserver)
   - Live reload for development

7. **Code Runner** (formulahendry.code-runner)
   - Execute code snippets instantly

### Recommended Settings (settings.json)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### How to Install Extensions

1. Click Extensions icon in sidebar (or `Ctrl+Shift+X`)
2. Search for extension by name
3. Click "Install"
4. VS Code handles dependencies automatically

---

## Executing Your First .js File

### Create Your First Program

1. Open VS Code
2. Create a new folder: `my-node-app`
3. Open the folder in VS Code: `File > Open Folder...`
4. Create a new file: `index.js`
5. Write your code:

```javascript
// index.js
console.log("Hello, Node.js!");
console.log("Welcome to backend development!");
```

### Method 1: Using Terminal in VS Code

1. Open integrated terminal: `Ctrl+`` (backtick)
2. Run the file:

```bash
node index.js
```

**Output:**
```
Hello, Node.js!
Welcome to backend development!
```

### Method 2: Using Code Runner Extension

1. Install "Code Runner" extension
2. Right-click in the editor
3. Select "Run Code"
4. Output appears in Output panel

### Method 3: Using External Terminal

```bash
cd path/to/my-node-app
node index.js
```

---

## What is REPL?

**REPL** stands for **Read-Eval-Print Loop**.

It's an interactive programming environment where you can:

1. **Read** — Accept input from the user
2. **Eval** — Evaluate (execute) the input
3. **Print** — Display the output
4. **Loop** — Wait for the next input

### REPL vs Script Mode

| Feature | REPL | Script Mode |
|---------|------|-------------|
| **Execution** | Line-by-line, interactive | Entire file at once |
| **Use Case** | Testing, experimentation, debugging | Production code |
| **Output** | Immediate | On completion |
| **Environment** | Temporary variables exist only in session | Persistent file |

### Benefits of REPL

- Quick testing without creating files
- Experiment with syntax and APIs
- Debug code interactively
- Learn JavaScript by trying commands

---

## Executing Code via REPL

### Starting the Node REPL

Open your terminal and type:

```bash
node
```

You'll see:

```
Welcome to Node.js v18.x.x.
Type ".help" for more information.
>
```

### Using the REPL

**Example 1: Basic Math**

```
> 2 + 2
4
> const x = 10;
undefined
> x * 5
50
```

**Example 2: Functions**

```
> function greet(name) { return `Hello, ${name}!`; }
undefined
> greet("Pulok")
'Hello, Pulok!'
```

**Example 3: Importing Modules**

```
> const fs = require('fs');
undefined
> fs.readdirSync('.')
[ 'index.js', 'package.json', 'node_modules' ]
```

### REPL Commands

| Command | Description |
|---------|------------|
| `.help` | Show all REPL commands |
| `.exit` | Exit REPL (or press `Ctrl+D` twice or `Ctrl+C`) |
| `.clear` | Clear current context |
| `.load filename` | Load a JavaScript file into the current session |
| `.save filename` | Save all commands executed to a file |

### Exiting REPL

```
> .exit
```

Or press:
- **Windows/Linux:** `Ctrl+C` twice
- **Mac:** `Ctrl+D`

---

## Key Takeaways

✓ An IDE provides integrated tools for efficient development  
✓ VS Code is lightweight, extensible, and ideal for Node.js development  
✓ Install Node.js and VS Code for your operating system  
✓ You can run JavaScript files using `node filename.js`  
✓ REPL is perfect for testing and learning interactively  
✓ Extensions enhance VS Code's functionality  
✓ Terminal integration allows you to run commands without leaving the editor