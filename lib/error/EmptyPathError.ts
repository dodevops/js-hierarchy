/**
 * @module js-hierarchy
 */
/**
 * The request path was empty
 */
export class EmptyPathError extends Error implements Error {
    public name: string = 'EmptyPathError';

    constructor() {
        super('The request path was empty');
    }
}
