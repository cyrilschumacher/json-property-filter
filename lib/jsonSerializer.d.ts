export default class JsonSerializer {
    static serializeToArray(jsonObject: Object, keys?: Array<string>, path?: string): Array<string>;
    static serializeToObject(arr: Array<string>): Object;
}
