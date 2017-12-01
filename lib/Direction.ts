/**
 * @module js-hierarchy
 */
/**
 * A direction to walk the tree
 */
export enum Direction {
    /**
     * Walk through each children and all grandchildren of the current node
     * until no nodes are left
     */
    up,
    /**
     * Walk through all parent nodes until reaching the root node
     */
    down,
    /**
     * Walk through all children of the parent node of this node while
     * decrementing the index (thus walking left) until you reached
     * the first node.
     */
    left,
    /**
     * Walk through all children of the parent node of this node while
     * incrementing the index (thus walking right) until you reached
     * the last node.
     */
    right,
    /**
     * Go down until reaching the root and then back up calling the action function on each encountered node
     */
    rootUp
}
