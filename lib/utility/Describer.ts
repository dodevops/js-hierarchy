/**
 * A tool to get the name of the class.
 * Taken from
 * https://www.stevefenton.co.uk/2013/04/obtaining-a-class-name-at-runtime-in-typescript/
 */
export class Describer {
    public static getName(inputClass) {
        let funcNameRegex = /function (.{1,})\(/;
        let results = (funcNameRegex).exec((<any> inputClass).constructor.toString());
        return (results && results.length > 1) ? results[1] : '';
    }
}
