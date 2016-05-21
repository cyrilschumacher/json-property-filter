"use strict";
const convertJsonToArray_1 = require("./convertJsonToArray");
const convertArrayToJson_1 = require("./convertArrayToJson");
class JsonPropertyFilter {
    constructor(args) {
        this.apply = (source) => {
            let destination = new Array();
            if (this._containsAllPropertiesFilter()) {
                return source;
            }
            else {
                let keys = new Array();
                convertJsonToArray_1.default(source, keys);
                for (let rule of this._propertiesToInclude) {
                    this._include(rule, keys, destination);
                }
            }
            return convertArrayToJson_1.default(destination);
        };
        const properties = this._formatProperties(args);
        this._propertiesToInclude = this._extractProperties(properties);
    }
    _containsAllPropertiesFilter() {
        return this._propertiesToInclude.indexOf(JsonPropertyFilter.ALL_PROPERTIES) > -1;
    }
    _include(rule, source, destination) {
        if (rule.endsWith(JsonPropertyFilter.ALL_ROOT_PROPERTIES)) {
            const formattedRule = rule.substr(0, rule.length - 1);
            for (const propertySourcePath in source) {
                const formattedPropertySourcePath = propertySourcePath.replace(JsonPropertyFilter.ARRAY_INDEX, "");
                const propertySourceValue = source[propertySourcePath];
                if (formattedRule === "") {
                    if (propertySourcePath.split(".").length === 1) {
                        destination[propertySourcePath] = propertySourceValue;
                    }
                }
                else if (propertySourcePath.startsWith(formattedRule) || formattedPropertySourcePath.startsWith(formattedRule)) {
                    const splittedPropertySourcePath = formattedPropertySourcePath.split(".");
                    const splittedFormattedRule = formattedRule.split(".");
                    if (splittedFormattedRule.length === splittedPropertySourcePath.length) {
                        destination[propertySourcePath] = propertySourceValue;
                    }
                }
            }
        }
        else {
            for (const propertySourcePath in source) {
                const formattedPropertySourcePath = propertySourcePath.replace(JsonPropertyFilter.ARRAY_INDEX, "");
                if (rule === formattedPropertySourcePath) {
                    destination[propertySourcePath] = source[propertySourcePath];
                }
            }
        }
    }
    _extractProperties(properties) {
        let include = new Array();
        for (let property of properties) {
            if (property.startsWith("+")) {
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
JsonPropertyFilter.ALL_PROPERTIES = "**";
JsonPropertyFilter.ALL_ROOT_PROPERTIES = "*";
JsonPropertyFilter.ARRAY_INDEX = /\[[0-9]+\]/g;
exports.JsonPropertyFilter = JsonPropertyFilter;
