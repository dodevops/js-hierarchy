(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jshierarchy = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/**
 * js-hierarchy - Typescript and Javascript hierarchy management
 */
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleNode_1 = require("./lib/SimpleNode");
exports.SimpleNode = SimpleNode_1.SimpleNode;
var AbstractNode_1 = require("./lib/AbstractNode");
exports.AbstractNode = AbstractNode_1.AbstractNode;
var Direction_1 = require("./lib/Direction");
exports.Direction = Direction_1.Direction;
var DataNotFoundError_1 = require("./lib/error/DataNotFoundError");
exports.DataNotFoundError = DataNotFoundError_1.DataNotFoundError;
var InvalidDirectionError_1 = require("./lib/error/InvalidDirectionError");
exports.InvalidDirectionError = InvalidDirectionError_1.InvalidDirectionError;
var NodeNotFoundError_1 = require("./lib/error/NodeNotFoundError");
exports.NodeNotFoundError = NodeNotFoundError_1.NodeNotFoundError;

},{"./lib/AbstractNode":2,"./lib/Direction":3,"./lib/SimpleNode":4,"./lib/error/DataNotFoundError":5,"./lib/error/InvalidDirectionError":6,"./lib/error/NodeNotFoundError":7}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Direction_1 = require("./Direction");
const DownWalker_1 = require("./walker/DownWalker");
const LeftWalker_1 = require("./walker/LeftWalker");
const RightWalker_1 = require("./walker/RightWalker");
const UpWalker_1 = require("./walker/UpWalker");
const InvalidDirectionError_1 = require("./error/InvalidDirectionError");
const NodeNotFoundError_1 = require("./error/NodeNotFoundError");
const DataNotFoundError_1 = require("./error/DataNotFoundError");
const loglevel = require("loglevel");
class AbstractNode {
    constructor(data) {
        this._log = null;
        this._children = [];
        this._parent = null;
        this._data = {};
        if (data) {
            this._data = data;
        }
        this._log = loglevel.getLogger(`js-hierarchy:${this.constructor.name}`);
    }
    getChildren() {
        if (this._log.getLevel() === 0 /* TRACE */) {
            let description = [];
            for (let child of this._children) {
                description.push(child.toJSON());
            }
            this._log.trace(`Returning children: ${description}`);
        }
        return this._children;
    }
    addChild(child, position) {
        if (this._log.getLevel() <= 1 /* DEBUG */) {
            this._log.debug(`Adding child ${child.toJSON()}`);
            this._log.debug(`Setting child's parent to ${this.toJSON()}`);
        }
        child.setParent(this);
        if (position) {
            this._log.debug(`Adding child at position ${position}`);
            this._children.splice(position, 0, child);
        }
        else {
            this._log.debug('Adding child at end of children list');
            this._children.push(child);
        }
        return child;
    }
    removeChild(child) {
        if (typeof child === 'number') {
            if (child < 0 ||
                child > this._children.length - 1) {
                let error = new NodeNotFoundError_1.NodeNotFoundError(`Node with id ${child} was not found`);
                this._log.error(error.message);
                throw error;
            }
            this._log.debug(`Removing child at position ${child}`);
            if (this._log.getLevel() <= 1 /* DEBUG */) {
                this._log.debug(this._children[child].toJSON());
            }
            this._children.splice(child, 1);
        }
        else {
            if (this._log.getLevel() <= 1 /* DEBUG */) {
                this._log.debug(`Removing child ${child.toJSON()}`);
            }
            this._children.splice(this.findChild(child), 1);
        }
    }
    findChild(child) {
        if (this._log.getLevel() === 0 /* TRACE */) {
            this._log.trace(`Finding child ${child.toJSON()}`);
        }
        for (let i = 0; i < this._children.length; i++) {
            if (this._children[i] === child) {
                this._log.trace(`Found child at position ${i}`);
                return i;
            }
        }
        let error = new NodeNotFoundError_1.NodeNotFoundError(`Invalid Node ${child.toJSON()}`);
        this._log.error(error.message);
        throw error;
    }
    getParent() {
        if (this._log.getLevel() === 0 /* TRACE */) {
            this._log.trace(`Returning parent ${this._parent.toJSON()}`);
        }
        return this._parent;
    }
    setParent(node) {
        if (this._log.getLevel() === 0 /* TRACE */) {
            this._log.trace(`Setting parent to ${node.toJSON()}`);
        }
        this._parent = node;
    }
    isRoot() {
        if (this._parent === null) {
            this._log.debug('This node is root.');
            return true;
        }
        this._log.debug('This node is not root.');
        return false;
    }
    walk(direction, action) {
        let _direction;
        if (!Array.isArray(direction)) {
            _direction = [direction];
        }
        else {
            _direction = direction;
        }
        for (let currentDirection of _direction) {
            let walker;
            switch (currentDirection) {
                case Direction_1.Direction.down:
                    walker = new DownWalker_1.DownWalker();
                    break;
                case Direction_1.Direction.left:
                    walker = new LeftWalker_1.LeftWalker();
                    break;
                case Direction_1.Direction.right:
                    walker = new RightWalker_1.RightWalker();
                    break;
                case Direction_1.Direction.up:
                    walker = new UpWalker_1.UpWalker();
                    break;
                default:
                    throw new InvalidDirectionError_1.InvalidDirectionError(`Invalid direction ${currentDirection}`);
            }
            this._log.debug(`Walking this node using ${walker.constructor.name}`);
            walker.walk(this, action);
        }
    }
    setData(key, value) {
        this._log.trace(`Setting ${key} to ${value}`);
        this._data[key] = value;
        return this;
    }
    getData(key) {
        if (!this._data.hasOwnProperty(key)) {
            let error = new DataNotFoundError_1.DataNotFoundError(`No data found with key ${key}`);
            this._log.error(error.message);
            throw error;
        }
        this._log.trace(`Returning ${this._data[key]} for key ${key}`);
        return this._data[key];
    }
    toJSON() {
        return JSON.stringify({
            _class: this.constructor.name,
            _isRoot: this.isRoot(),
            _data: this._data,
            _children: this._children
        });
    }
}
exports.AbstractNode = AbstractNode;

},{"./Direction":3,"./error/DataNotFoundError":5,"./error/InvalidDirectionError":6,"./error/NodeNotFoundError":7,"./walker/DownWalker":8,"./walker/LeftWalker":9,"./walker/RightWalker":10,"./walker/UpWalker":11,"loglevel":12}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A direction to walk the tree
 */
var Direction;
(function (Direction) {
    /**
     * Walk through all parent nodes until reaching the root node
     */
    Direction[Direction["up"] = 0] = "up";
    /**
     * Walk through each children and all grandchildren of the current node
     * until no nodes are left
     */
    Direction[Direction["down"] = 1] = "down";
    /**
     * Walk through all children of the parent node of this node while
     * decrementing the index (thus walking left) until you reached
     * the first node.
     */
    Direction[Direction["left"] = 2] = "left";
    /**
     * Walk through all children of the parent node of this node while
     * incrementing the index (thus walking right) until you reached
     * the last node.
     */
    Direction[Direction["right"] = 3] = "right";
})(Direction = exports.Direction || (exports.Direction = {}));

},{}],4:[function(require,module,exports){
"use strict";
/**
 * A node implementation offering basic features
 */
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractNode_1 = require("./AbstractNode");
/**
 * A node implementation offering basic features
 */
class SimpleNode extends AbstractNode_1.AbstractNode {
}
exports.SimpleNode = SimpleNode;
;

},{"./AbstractNode":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Arbitrary was not found
 */
class DataNotFoundError extends Error {
}
exports.DataNotFoundError = DataNotFoundError;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An invalid direction was specified
 */
class InvalidDirectionError extends Error {
}
exports.InvalidDirectionError = InvalidDirectionError;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The specified node can not be found
 */
class NodeNotFoundError extends Error {
}
exports.NodeNotFoundError = NodeNotFoundError;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loglevel = require("loglevel");
/**
 * A walker, that climbs the hierarchy down
 */
class DownWalker {
    walk(node, action) {
        let log = loglevel.getLogger('js-hierarchy:DownWalker');
        if (log.getLevel() === 0 /* TRACE */) {
            log.trace(`Walking node ${node.toJSON()}`);
        }
        if (!node.isRoot()) {
            log.trace('Have not reached root. Calling action.');
            action(node.getParent());
            log.trace('Walking further down.');
            this.walk(node.getParent(), action);
        }
    }
}
exports.DownWalker = DownWalker;

},{"loglevel":12}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loglevel = require("loglevel");
/**
 * A walker, that runs all parents children from the current
 * child to the left.
 */
class LeftWalker {
    walk(node, action) {
        let log = loglevel.getLogger('js-hierarchy:LeftWalker');
        let parent = node.getParent();
        for (let i = parent.findChild(node) - 1; i >= 0; i--) {
            if (log.getLevel() === 0 /* TRACE */) {
                log.trace(`Calling action on child #${i}: ${parent.getChildren()[i].toJSON()}`);
            }
            action(parent.getChildren()[i]);
        }
    }
}
exports.LeftWalker = LeftWalker;

},{"loglevel":12}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loglevel = require("loglevel");
/**
 * A walker, that runs all parents children from the current
 * child to the right.
 */
class RightWalker {
    walk(node, action) {
        let log = loglevel.getLogger('js-hierarchy:LeftWalker');
        let parent = node.getParent();
        for (let i = parent.findChild(node) + 1; i < parent.getChildren().length; i++) {
            if (log.getLevel() === 0 /* TRACE */) {
                log.trace(`Calling action on child #${i}: 
                    ${parent.getChildren()[i].toJSON()}`);
            }
            action(parent.getChildren()[i]);
        }
    }
}
exports.RightWalker = RightWalker;

},{"loglevel":12}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loglevel = require("loglevel");
/**
 * A walker, that climbs the hierarchy up
 */
class UpWalker {
    walk(node, action) {
        let log = loglevel.getLogger('js-hierarchy:UpWalker');
        if (log.getLevel() === 0 /* TRACE */) {
            log.trace(`Walking node ${node.toJSON()}`);
        }
        for (let childNode of node.getChildren()) {
            log.trace(`Calling action child node.`);
            action(childNode);
            this.walk(childNode, action);
        }
    }
}
exports.UpWalker = UpWalker;

},{"loglevel":12}],12:[function(require,module,exports){
/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(definition);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
}(this, function () {
    "use strict";
    var noop = function() {};
    var undefinedType = "undefined";

    function realMethod(methodName) {
        if (typeof console === undefinedType) {
            return false; // We can't build a real method without a console to log to
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // these private functions always need `this` to be set properly

    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }
    }

    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      var storageKey = "loglevel";
      if (name) {
        storageKey += ":" + name;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public API
       *
       */

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Package-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    return defaultLogger;
}));

},{}]},{},[1])(1)
});