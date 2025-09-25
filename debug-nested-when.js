/**
 * @vitest-environment jsdom
 */

// Quick debug script to understand the nested when behavior
import { JSDOM } from 'jsdom';

// Set up DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.Node = dom.window.Node;
global.Comment = dom.window.Comment;

import { when, updateWhenRuntimes } from './src/when/index.js';

// Test nested when behavior
let showOuter = true;
let showInner = false;

const outerContainer = document.createElement('div');
document.body.appendChild(outerContainer);

console.log('=== Setting up nested when ===');
const innerWhen = when(() => showInner, 'Inner content').else('Inner fallback');
const outerWhen = when(() => showOuter, 'Outer: ', innerWhen).else('Outer fallback');

console.log('=== Initial render ===');
outerWhen(outerContainer, 0);
updateWhenRuntimes();
console.log('Container HTML:', outerContainer.innerHTML);
console.log('Container text:', outerContainer.textContent);

console.log('=== Setting showInner = true ===');
showInner = true;
updateWhenRuntimes();
console.log('Container HTML:', outerContainer.innerHTML);
console.log('Container text:', outerContainer.textContent);

console.log('=== Setting showOuter = false ===');
showOuter = false;
updateWhenRuntimes();
console.log('Container HTML:', outerContainer.innerHTML);
console.log('Container text:', outerContainer.textContent);
console.log('Expected: "Outer fallback"');