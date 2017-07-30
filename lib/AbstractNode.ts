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

export abstract class AbstractNode implements Node {

    private _children: Node[] = [];
    private _parent: Node = null;
    private _data: { [key: string]: any } = {};

    constructor(data?: { [p: string]: any }) {
        if (data) {
            this._data = data;
        }
    }

    public getChildren(): Node[] {
        return this._children;
    }

    public addChild(child: Node, position?: number): Node {
        child.setParent(this);

        if (position) {
            this._children.splice(position, 0, child);
        } else {
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
                throw new NodeNotFoundError(
                    `Node with id ${child} was not found`
                );
            }
            this._children.splice(<number> child, 1);
        } else {
            this._children.splice(this.findChild(<Node> child), 1);
        }
    }

    public findChild(child: Node): number {
        for (let i = 0; i < this._children.length; i++) {
            if (this._children[i] === child) {
                return i;
            }
        }

        throw new NodeNotFoundError(
            `Invalid Node ${child.toJSON()}`
        );
    }

    public getParent(): Node {
        return this._parent;
    }

    public setParent(node: Node): void {
        this._parent = node;
    }

    public isRoot(): boolean {
        return this._parent === null;
    }

    public walk(
        direction: Direction | Direction[],
        action: ActionFunction
    ): void {
        let _direction: Direction[];
        if (!Array.isArray(direction)) {
            _direction = [direction];
        } else {
            _direction = direction;
        }

        for (let currentDirection of _direction) {
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
                    throw new InvalidDirectionError(
                        `Invalid direction ${currentDirection}`
                    );
            }
            walker.walk(this, action);
        }
    }

    public setData(key: string, value: any): Node {
        this._data[key] = value;
        return this;
    }

    public getData(key: string): any {
        if (!this._data.hasOwnProperty(key)) {
            throw new DataNotFoundError(`No data found with key ${key}`);
        }
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
