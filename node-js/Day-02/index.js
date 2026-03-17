const os = require('os');
const path = require('path');
const fs = require('fs');

function add(a, b) {
	return a + b;
}

function subtract(a, b) {
	return a - b;
}

function showSystemInfo() {
	console.log('--- System Info ---');
	console.log('Platform:', os.platform());
	console.log('Architecture:', os.arch());
	console.log('CPU Cores:', os.cpus().length);
}

function runMathDemo() {
	console.log('\n--- Math Module Demo ---');
	console.log('add(10, 5) =', add(10, 5));
	console.log('subtract(10, 5) =', subtract(10, 5));
}

function runFileDemo() {
	const filePath = path.join(__dirname, 'sample.txt');
	const content = 'Hello from Day 02 Node.js practice!';

	console.log('\n--- File System Demo ---');

	fs.writeFile(filePath, content, 'utf8', (writeErr) => {
		if (writeErr) {
			console.error('Error writing file:', writeErr.message);
			return;
		}

		console.log('File created at:', filePath);

		fs.readFile(filePath, 'utf8', (readErr, data) => {
			if (readErr) {
				console.error('Error reading file:', readErr.message);
				return;
			}

			console.log('File content:', data);
		});
	});
}

function main() {
	console.log('Day 02 - Node.js Modules and Core Modules Practice');
	showSystemInfo();
	runMathDemo();
	runFileDemo();
}

main();
