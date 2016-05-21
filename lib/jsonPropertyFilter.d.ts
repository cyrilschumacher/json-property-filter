export declare class JsonPropertyFilter {
    private static ALL_PROPERTIES;
    private static ALL_ROOT_PROPERTIES;
    private static ARRAY_INDEX;
    private _propertiesToInclude;
    constructor(args: string | Array<string>);
    apply: (source: Object) => Object;
    private _containsAllPropertiesFilter();
    private _include(rule, source, destination);
    private _extractProperties(properties);
    private _formatProperties(properties);
}
