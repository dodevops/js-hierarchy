/**
 * The type definition of the action function, that is called using
 * Node#walk.
 *
 * The function is given the currently encountered node while walking the
 * tree.
 */
import { Node } from './Node';
export declare type ActionFunction = (node: Node) => void;
