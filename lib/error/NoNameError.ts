/**
 * @module js-hierarchy
 */
/**
 * Node has no name and getPath was used
 */
export class NoNameError extends Error implements Error {
    public name: string = 'NoNameError';

    constructor() {
        super('Node has no name and getPath was used');
    }
}
