"use strict";
const jsonSerializer_1 = require("./jsonSerializer");
const JsonIncludePropertyFilter_1 = require("./JsonIncludePropertyFilter");
class JsonPropertyFilter {
    constructor(args) {
        const properties = this._formatProperties(args);
        const propertiesToInclude = this._extractProperties(properties);
        this._include = new JsonIncludePropertyFilter_1.default(propertiesToInclude);
    }
    apply(source) {
        const keys = jsonSerializer_1.default.serializeToArray(source);
        const destination = this._include.apply(keys);
        const filtered = jsonSerializer_1.default.serializeToObject(destination);
        return filtered;
    }
    _extractProperties(properties) {
        let include = new Array();
        for (let property of properties) {
            const isIncludeProperty = property.indexOf(JsonPropertyFilter.INCLUDE_SYMBOL) === 0;
            if (isIncludeProperty) {
                include.push(property.substring(1));
            }
            else {
                include.push(property);
            }
        }
        return include;
    }
    _formatProperties(properties) {
        if (typeof properties === "string") {
            return properties.split(",");
        }
        else {
            return properties;
        }
    }
}
JsonPropertyFilter.INCLUDE_SYMBOL = "+";
exports.JsonPropertyFilter = JsonPropertyFilter;
