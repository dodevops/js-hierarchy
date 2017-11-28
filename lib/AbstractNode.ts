/**
 * A starting point Node implementation to extend from
 */
import {Node} from './Node';
import {Direction} from './Direction';
import {ActionFunction} from './ActionFunction';
import {Walker} from './walker/Walker';
import {DownWalker} from './walker/DownWalker';
import {LeftWalker} from './walker/LeftWalker';
import {RightWalker} from './walker/RightWalker';
import {UpWalker} from './walker/UpWalker';
import {InvalidDirectionError} from './error/InvalidDirectionError';
import {NodeNotFoundError} from './error/NodeNotFoundError';
import {DataNotFoundError} from './error/DataNotFoundError';
import * as loglevel from 'loglevel';
import Bluebird = require('bluebird');

export abstract class AbstractNode implements Node {

    private _log: loglevel.Logger = null;

    private _children: Node[] = [];
    private _parent: Node = null;
    private _data: { [key: string]: any } = {};

    constructor(data?: { [p: string]: any }) {
        if (data) {
            this._data = data;
        }

        this._log = loglevel.getLogger(`js-hierarchy:${this.constructor.name}`);
    }

    public getChildren(): Node[] {
        if (this._log.getLevel() === loglevel.levels.TRACE) {
            let description: string[] = [];

            for (let child of this._children) {
                description.push(child.toJSON());
            }

            this._log.trace(`Returning children: ${description}`);
        }
        return this._children;
    }

    public addChild(child: Node, position?: number): Node {
        if (this._log.getLevel() <= loglevel.levels.DEBUG) {
            this._log.debug(`Adding child ${child.toJSON()}`);
            this._log.debug(`Setting child's parent to ${this.toJSON()}`);
        }

        child.setParent(this);

        if (position) {
            this._log.debug(`Adding child at position ${position}`);
            this._children.splice(position, 0, child);
        } else {
            this._log.debug('Adding child at end of children list');
            this._children.push(child);
        }

        return child;
    }

    public removeChild(child: Node | number): void {
        if (typeof child === 'number') {
            if (
                child < 0 ||
                child > this._children.length - 1
            ) {
                let error = new NodeNotFoundError(
                    `Node with id ${child} was not found`
                );
                this._log.error(error.message);
                throw error;
            }
            this._log.debug(`Removing child at position ${<number> child}`);
            if (this._log.getLevel() <= this._log.levels.DEBUG) {
                this._log.debug(this._children[<number> child].toJSON());
            }
            this._children.splice(<number> child, 1);
        } else {
            if (this._log.getLevel() <= this._log.levels.DEBUG) {
                this._log.debug(
                    `Removing child ${(
                        <Node> child
                    ).toJSON()}`
                );
            }
            this._children.splice(this.findChild(<Node> child), 1);
        }
    }

    public findChild(child: Node): number {
        if (this._log.getLevel() === this._log.levels.TRACE) {
            this._log.trace(`Finding child ${child.toJSON()}`);
        }
        for (let i = 0; i < this._children.length; i++) {
            if (this._children[i] === child) {
                this._log.trace(`Found child at position ${i}`);
                return i;
            }
        }

        let error = new NodeNotFoundError(
            `Invalid Node ${child.toJSON()}`
        );
        this._log.error(error.message);
        throw error;
    }

    public getParent(): Node {
        if (this._log.getLevel() === this._log.levels.TRACE) {
            this._log.trace(`Returning parent ${this._parent.toJSON()}`);
        }
        return this._parent;
    }

    public setParent(node: Node): void {
        if (this._log.getLevel() === this._log.levels.TRACE) {
            this._log.trace(`Setting parent to ${node.toJSON()}`);
        }
        this._parent = node;
    }

    public isRoot(): boolean {
        if (this._parent === null) {
            this._log.debug('This node is root.');
            return true;
        }
        this._log.debug('This node is not root.');
        return false;
    }

    public walk(
        direction: Direction | Direction[],
        action: ActionFunction
    ): Bluebird<void> {
        let _direction: Direction[];
        if (!Array.isArray(direction)) {
            _direction = [direction];
        } else {
            _direction = direction;
        }

        return Bluebird.reduce(
            _direction,
            (total, currentDirection) => {
                let walker: Walker;
                switch (currentDirection) {
                    case Direction.down:
                        walker = new DownWalker();
                        break;
                    case Direction.left:
                        walker = new LeftWalker();
                        break;
                    case Direction.right:
                        walker = new RightWalker();
                        break;
                    case Direction.up:
                        walker = new UpWalker();
                        break;
                    default:
                        return Bluebird.reject(
                            new InvalidDirectionError(
                                `Invalid direction ${currentDirection}`
                            )
                        );
                }
                this._log.debug(
                    `Walking this node using ${walker.constructor.name}`
                );
                return walker.walk(this, action)
                    .thenReturn([]);
            },
            []
        ).thenReturn();

    }

    public setData(key: string, value: any): Node {
        this._log.trace(`Setting ${key} to ${value}`);
        this._data[key] = value;
        return this;
    }

    public getData(key: string): any {
        if (!this._data.hasOwnProperty(key)) {
            let error = new DataNotFoundError(`No data found with key ${key}`);
            this._log.error(error.message);
            throw error;
        }
        this._log.trace(`Returning ${this._data[key]} for key ${key}`);
        return this._data[key];
    }

    public toJSON(): string {
        return JSON.stringify(
            {
                _class: this.constructor.name,
                _isRoot: this.isRoot(),
                _data: this._data,
                _children: this._children
            }
        );
    }
}
