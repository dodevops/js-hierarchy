/**
 * @module js-hierarchy
 */
/**
 */
import {ActionFunction} from './ActionFunction';
import {Direction} from './Direction';
import Bluebird = require('bluebird');

/**
 * A node in the hierarchy
 */
export interface Node {
    /**
     * A name for this node
     */
    name: string;

    /**
     * Get all children of this node, if any.
     * @returns {Node[]} the children of this node. If the node doesn't contain
     *   any children, an empty array is returned
     */
    getChildren(): Node[];

    /**
     * Get a child based on the given name
     * @param {string} name the name of the child node
     * @return {Node} the found node or null
     */
    getChildByName(name: string): Node;

    /**
     * Add a new child to this node, optionally specifying the index
     * @param {Node} child The new child node
     * @param {number} position The index where the new node should be inserted
     *   (optional)
     * @returns {Node} the inserted node
     */
    addChild(child: Node, position?: number): Node;

    /**
     * Remove a child by specifying the node or index that should be removed.
     *
     * @param {Node} child The child node or index to be removed
     * @throws [[NodeNotFoundError]]
     */
    removeChild(child: Node | number): void;

    /**
     * Find the specified node and return the index
     * @param {Node} child the node to search for
     * @returns {number} the index or null, if no node was found
     * @throws [[NodeNotFoundError]]
     */
    findChild(child: Node): number;

    /**
     * Return the parent node of this node
     * @returns {Node} the parent node or null, if no parent node exists
     */
    getParent(): Node;

    /**
     * Set the parent of this node
     * @param Node the new parent
     */
    setParent(node: Node): void;

    /**
     * Return, wether this node is the root node (has now parent)
     * @returns {boolean} true, if this node is the root node
     */
    isRoot(): boolean;

    /**
     * Walk the tree in the given direction and call the action function on
     * each node you encounter.
     *
     * The direction can also be an array of directions. In this case,
     * the next direction will be called, if there's no node left in the
     * first direction.
     *
     * For example, specify [Direction.left, Direction.right] will walk
     * through the children in the left direction. After the first child
     * is encountered, the parent node is walked and so on.
     *
     * @param {Direction | Direction[]} direction
     * @param {ActionFunction} action
     * @throws [[InvalidDirectionError]]
     * @throws [[NodeNotFoundError]]
     */
    walk(
        direction: Direction | Direction[],
        action: ActionFunction
    ): Bluebird<void>;

    /**
     * Set arbitrary data to the node
     * @param {string} key A key
     * @param value The value
     * @returns {Node} A reference back to the node
     */
    setData(key: string, value: any): Node;

    /**
     * Retrieve arbitrary data from the node
     * @param {string} key
     * @returns {any} the value
     * @throws [[DataNotFoundError]]
     */
    getData(key: string): any;

    /**
     * Return a JSON representation of the node
     * @returns {string}
     */
    toJSON(): string;

    /**
     * Return a path to this node. Different nodes are separated by slashes /, if not specified otherwise
     * @param {string} pathSeparator The optional path separator
     * @return {string}
     */
    getPath(pathSeparator?: string): Bluebird<string>;

    /**
     * Get a node by specifying its path
     * @param {string} path The path string
     * @param {string} pathSeparator an optional path separator
     * @return {Node}
     */
    getNodeByPath(path: string, pathSeparator?: string): Bluebird<Node>;

    /**
     * Get the root this node belongs to
     * @return {Node}
     */
    getRoot(): Node;

    /**
     * The distance of this node from the root node.
     *
     * If it IS the root node, it's 0. If it's parent is the root node it's 1 and so on.
     * @return {number}
     */
    getLevel(): number;

}
