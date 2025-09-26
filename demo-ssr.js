// Simple Node.js demo of SSR functionality
const fs = require('fs');

// Mock DOM globals for Node.js
global.document = {
  createElement: (tagName) => ({
    tagName: tagName.toUpperCase(),
    nodeName: tagName.toUpperCase(),
    nodeType: 1,
    childNodes: [],
    parentNode: null,
    attributes: new Map(),
    appendChild(child) {
      child.parentNode = this;
      this.childNodes.push(child);
    },
    insertBefore(newChild, referenceChild) {
      newChild.parentNode = this;
      const index = referenceChild ? this.childNodes.indexOf(referenceChild) : this.childNodes.length;
      this.childNodes.splice(index >= 0 ? index : this.childNodes.length, 0, newChild);
    },
    setAttribute(name, value) {
      this.attributes.set(name, value);
    },
    getAttribute(name) {
      return this.attributes.get(name) || null;
    },
    removeAttribute(name) {
      this.attributes.delete(name);
    },
    get textContent() {
      return this.childNodes
        .filter(child => child.nodeType === 3)
        .map(child => child.textContent)
        .join('');
    },
    set textContent(value) {
      this.childNodes = [];
      if (value) {
        this.appendChild({
          nodeType: 3,
          nodeName: '#text',
          textContent: value,
          parentNode: this
        });
      }
    }
  }),
  createTextNode: (data) => ({
    nodeType: 3,
    nodeName: '#text',
    textContent: data,
    parentNode: null
  }),
  createComment: (data) => ({
    nodeType: 8,
    nodeName: '#comment',
    textContent: data,
    parentNode: null
  })
};

global.Node = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
  COMMENT_NODE: 8
};

// Import view-craft after setting up globals
const { renderToString, setRuntimeMode } = require('./dist/view-craft.cjs');

// Demo app
function createApp() {
  return (parent, index) => {
    // Create virtual div element
    const div = {
      tagName: 'DIV',
      nodeType: 1,
      childNodes: [],
      parentNode: null,
      attributes: new Map([['class', 'container']]),
      appendChild(child) {
        child.parentNode = this;
        this.childNodes.push(child);
      },
      setAttribute(name, value) {
        this.attributes.set(name, value);
      }
    };
    
    // Add some text content
    const text = {
      nodeType: 3,
      textContent: 'Hello from SSR!',
      parentNode: div
    };
    
    div.childNodes.push(text);
    parent.appendChild(div);
    
    return div;
  };
}

try {
  console.log('Testing SSR functionality...');
  
  // Set SSR mode
  setRuntimeMode('ssr');
  
  // Render to string
  const html = renderToString(createApp());
  
  console.log('Generated HTML:');
  console.log(html);
  
  // Write to file for inspection
  fs.writeFileSync('ssr-output.html', `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SSR Demo</title>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `);
  
  console.log('HTML written to ssr-output.html');
  
} catch (error) {
  console.error('SSR Error:', error.message);
  console.error(error.stack);
}