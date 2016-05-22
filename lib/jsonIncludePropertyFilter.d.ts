export default class JsonIncludePropertyFilter {
    private static ALL_PROPERTIES;
    private static ALL_ELEMENT_PROPERTIES;
    private static ARRAY_INDEX;
    private static PATH_SEPARATOR;
    private static STRING_EMPTY;
    private _properties;
    constructor(properties: Array<string>);
    apply: (source: string[]) => string[];
    private _containsAllPropertiesFilter();
    private _include(rule, source, destination);
    private _includeProperties(rule, source, destination);
    private _includeSpecificPath(rule, source, destination);
}
