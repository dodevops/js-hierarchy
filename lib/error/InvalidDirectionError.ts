/**
 * @module js-hierarchy
 */
/**
 * An invalid direction was specified
 */
export class InvalidDirectionError extends Error implements Error {

    public name: string = 'InvalidDirectionError';

    constructor(direction: string) {
        super(`Invalid direction ${direction}`);
    }
}
