import * as util from "./util";

import debug from "debug";

const log = debug("json-property-filter:exclusion");

export function extract(filters: string[]) {
    debug("Extract filters");

    const extractDebug = log.extend("extract");
    const exclusionFilters: string[] = [];
    for (let i = filters.length; i--; ) {
        const value = filters[i];
        const firstCharacter = value[0];

        if (value.length && firstCharacter === "-") {
            extractDebug("Extracting filter: %s", value);

            const filterWithoutSymbol = firstCharacter === "-" ? value.substring(1) : value;
            exclusionFilters.push(filterWithoutSymbol);
        }
    }

    return exclusionFilters;
}

export function filter(source: object, filters: string[]) {
    log("Apply filters: %o", filters);

    const destination = Array.isArray(source) ? [] : {};
    apply(source, filters, destination, util.EMPTY_CONTEXT);

    return destination;
}

function apply(source: object, filters: string[], destination: object, context: util.Context) {
    const applyDebug = log.extend(context.absolutePath);

    for (const propertyName in source) {
        if (source.hasOwnProperty(propertyName)) {
            applyDebug("Read property: %s", propertyName);

            const propertyValue = source[propertyName];
            if (!isFiltered(filters, context, propertyName)) {
                let value = source[propertyName];

                if (typeof propertyValue === "object") {
                    const newContext = util.createContext(context, source, propertyName);
                    value = Array.isArray(propertyValue) ? [] : {};
                    apply(propertyValue, filters, value, newContext);
                }

                applyDebug("Add property: %s", propertyName);
                const index = +propertyName;
                if (Array.isArray(destination) && !isNaN(index)) {
                    destination.splice(index, 0, value);
                } else {
                    destination[propertyName] = value;
                }
            }
        }
    }
}

function isFiltered(filters: string[], context: util.Context, propertyName: string) {
    const expectedRootPropertiesFilter = context.relativePath !== "" ? context.relativePath + ".*" : "*";
    const expectedAllPropertiesFilter = context.relativePath !== "" ? context.relativePath + ".**" : "**";

    const relativePath = context.relativePath ? `${context.relativePath}.${propertyName}` : propertyName;
    const segments = context.segments ? context.segments.concat(propertyName) : [propertyName];
    const absolutePath = segments.join(".");

    return (
        filters.includes(absolutePath) ||
        filters.includes(relativePath) ||
        filters.includes(context.absolutePath) ||
        filters.includes(context.relativePath) ||
        filters.includes(expectedAllPropertiesFilter) ||
        filters.includes(expectedRootPropertiesFilter)
    );
}
