/**
 * @module js-hierarchy
 */
/**
 * Arbitrary data was not found
 */
export class DataNotFoundError extends Error implements Error {
    public name: string = 'DataNotFoundError';

    constructor(key: string) {
        super(`No data found with key ${key}`);
    }
}
