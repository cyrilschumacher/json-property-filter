export declare class JsonPropertyFilter {
    private static INCLUDE_SYMBOL;
    private _include;
    constructor(args: string | Array<string>);
    apply(source: Object): Object;
    private _extractProperties(properties);
    private _extractProperty(property);
    private _formatProperties(properties);
}
