# js-hierarchy

[![Sauce Test Status](https://saucelabs.com/buildstatus/js-hierarchy)](https://saucelabs.com/u/dodevops)
[![Travis](https://img.shields.io/travis/dodevops/js-hierarchy.svg)](https://travis-ci.org/dodevops/js-hierarchy)
[![node](https://img.shields.io/node/v/js-hierarchy.svg)](https://www.npmjs.com/package/js-hierarchy)
[![npm](https://img.shields.io/npm/v/js-hierarchy.svg)](https://www.npmjs.com/package/js-hierarchy)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/js-hierarchy.svg)](https://saucelabs.com/u/dodevops)

Proper hierarchy management for Node, Typescript and the Browser.

## Introduction

js-hierarchy enables you to build tree-like data structures and work
with them properly. It supports walking in multiple directions,
storage of arbitrary data and can be used as a base framework for
your special needs.

## Installation

### npm

Install the module using npm:

    npm install --save js-hierarchy

## Basic usage

### Typescript

The module includes the complete type definitions for Typescript
applications. Simply install the module and you're ready to go:

```typescript
import {SimpleNode} from 'js-hierarchy';

let rootNode: SimpleNode = new SimpleNode();
```

### Node.js

After installing the module, use it with require():

```javascript
var hierarchy = require('js-hierarchy');

var rootNode = new hierarchy.SimpleNode();
```

### Browser

Install the module and include the browser script:

```html
<script type="text/javascript" src="node_modules/js-hierarchy/browser.min.js"></script>
```

or use the jsDelivr CDN hosted version:
```html
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/js-hierarchy/browser.min.js"></script>
```

With this the global namespace will include a "jshierarchy" object:

```javascript
var rootNode = new jshierarchy.SimpleNode();
```

After that, everything's right as working in Node.js.

## Building the hierarchy

The tree-like data structures, that js-hierarchy can build are build
up from "Nodes". There can be several implementations of the Node
interface, but the simplest one is called "SimpleNode".

Just instantiate it to create a new node:

```javascript
rootNode = new SimpleNode();
```

If a node has no parent, it is considered the "root node". A node can
include a number of children, obviously. Simply use the "addChild"-
method to add one:

```javascript
rootNode = new SimpleNode();
rootNode.addChild(new SimpleNode());
```

Adding the child will automatically set the child's parent to
the node it was added to.

## Storing arbitrary data

Because nodes without any information aren't quite useful, js-hierarchy
supports storing arbitrary data in a key/value manner.

To add a new data to a node, use the method "setData":

```javascript
rootNode = new SimpleNode();
rootNode.setData('mykey', 'myvalue');
```

You can also directly set the data when instantiating the node:

```javascript
rootNode = new SimpleNode({'mykey': 'myValue'});
```

Use "getData" to retrieve node data again later:

```javascript
rootNode = new SimpleNode({'mykey': 'myValue'});
console.log(rootNode.getData('mykey'));
// will output: myValue
```

## Walking the tree

Most tree-like structures are used to store hierarchical data
and walk the tree from one node to the upper, lower or sibling nodes.

The "walk" method of a node will just do that and call a user
defined function on each node it encounters. Please note, that this
will not include the original node, the walk method was called from.

```javascript
rootNode = new SimpleNode({'name': 'root'});
childNode = new SimpleNode({'name': 'child'});
childNode.addChild(new SimpleNode({'name': 'grandChild'}));
rootNode.addChild(childNode);

rootNode.walk(Direction.down, (node) => {
    console.log(node.getData('name'));
});
// will output both 'child' and 'grandChild'
```

Please look at this example tree:

```
                                    +----------------+
      +                             | grandchild 3.1 |
      |                             +-------^--------+
down  |                                     |
      |                                     |
      |                                     |
      |                                     |
      |     +---------+  +---------+   +----+----+
      v     | child 1 |  | child 2 |   | child 3 |
            +---^-----+  +----^----+   +----^----+
      ^         |             |             |
      |         |             |             |
      |         |   <----+    |   +----->   |
 up   |         |    left     |    right    |
      |         |             |             |
      |         |             |             |
      |         |          +--+---+         |
      +         +----------+ root +---------+
                           +------+
```

Now, these directions are available:

* up: Walks through all child nodes. Then to their child nodes and
  so on until no node is available anymore (from root to child 1-3
  to grandchild)
* down: Walks to the parent node, then the next parent node and so on
  until the root node is reached. (from grandchild to child 1-3 to root)
* left: Walks all siblings (the parent node's children) from the current
  node to the left (children having a smaller array index) until the
  first node is reached (from child2 to child1)
* right: Walks all siblings (the parent node's children) from the current
  node to the right (children having a larger array index) until the
  last node is reached (from child2 to child3)

You can also specify an array of directions, meaning that, after the
last node has been reached in the first direction, the next direction
is walked and so on.

## Extending

If you need a specialized nodes with functions suitable for your
usage, you should extend "AbstractNode" and implement "Node".
AbstractNode already has all needed features, so you can just
concentrate on the needed features without caring about the basic
ones.

Please read the API documentation for details

## Building

To test and build this package, simply use grunt:

    grunt release

This will run all unit tests and a coverage report.

## Contributing

First of all: Thank you for your will to contribute!

To request a new feature or report a bug, please
create a github issue.

Pull requests are always welcome!

If you can, please submit a pull request adding the feature
or solving the bug you just reported.

While developing for your pull request, please first create a test, that
produces your error or checks your new feature, run the test suite
using

    grunt test

to see them fail. Then, solve the bug or implement the feature and
run the tests once again to see them succeed. Please write good tests
and keep the coverage up.

We will review the pull request and optionally comment your code
and probably ask you to fix one or two things, before we can merge
your code.

## Browser compatibility tests

Browser compatibility tests are run using SauceLabs. To run them,
first add this line to your local hosts file:

    127.0.0.1 saucelabs.test

Then, when running ```grunt browsertest```, set these two environment
variables:

    SAUCE_USERNAME=<your SauceLabs username>
    SAUCE_ACCESS_KEY=<your SauceLabs access key>