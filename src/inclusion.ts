import * as util from "./util";

import debug from "debug";

const log = debug("json-property-filter:inclusion");

export function extract(filters: string[]) {
    debug("Extract filters");

    const extractDebug = log.extend("extract");
    const inclusionFilters: string[] = [];
    for (let i = filters.length; i--; ) {
        const value = filters[i];
        const firstCharacter = value[0];

        if (value.length && firstCharacter !== "-") {
            extractDebug("Extracting filter: '%s'", value);

            const filterWithoutSymbol = firstCharacter === "+" ? value.substring(1) : value;
            inclusionFilters.push(filterWithoutSymbol);
        }
    }

    return inclusionFilters;
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

            const allPropertiesFilter = context.relativePath ? context.relativePath + ".**" : "**";
            const rootPropertiesFilter = context.relativePath ? context.relativePath + ".*" : "*";
            if (typeof propertyValue !== "object" && filters.includes(rootPropertiesFilter)) {
                destination[propertyName] = propertyValue;
            } else if (filters.includes(allPropertiesFilter)) {
                destination[propertyName] = propertyValue;
            } else if (filters.includes(context.absolutePath) || filters.includes(context.relativePath)) {
                destination[propertyName] = propertyValue;
            } else if (typeof propertyValue === "object") {
                const nestedDestination = Array.isArray(propertyValue) ? [] : {};
                const nestedContext = util.createContext(context, source, propertyName);
                apply(propertyValue, filters, nestedDestination, nestedContext);

                if (Object.keys(nestedDestination).length) {
                    applyDebug("Include property: %s", propertyName);

                    const index = +propertyName;
                    if (Array.isArray(destination) && !isNaN(index)) {
                        destination.splice(index, 0, nestedDestination);
                    } else {
                        destination[propertyName] = nestedDestination;
                    }
                }
            } else {
                const segments = context.segments ? context.segments.concat(propertyName) : [propertyName];
                const absolutePath = segments.join(".");
                const relativePath = context.relativePath ? `${context.relativePath}.${propertyName}` : propertyName;

                if (
                    filters.includes(absolutePath) ||
                    filters.includes(relativePath) ||
                    filters.includes(context.absolutePath) ||
                    filters.includes(context.relativePath)
                ) {
                    applyDebug("Include property: %s", propertyName);

                    const index = +propertyName;
                    if (Array.isArray(destination) && !isNaN(index)) {
                        destination.splice(index, 0, propertyValue);
                    } else {
                        destination[propertyName] = propertyValue;
                    }
                }
            }
        }
    }
}
