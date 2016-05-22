"use strict";
class JsonIncludePropertyFilter {
    constructor(properties) {
        this.apply = (source) => {
            const destination = new Array();
            if (this._containsAllPropertiesFilter()) {
                return source;
            }
            for (let rule of this._properties) {
                this._include(rule, source, destination);
            }
            return destination;
        };
        this._properties = properties;
    }
    _containsAllPropertiesFilter() {
        return this._properties.indexOf(JsonIncludePropertyFilter.ALL_PROPERTIES) > -1;
    }
    _include(rule, source, destination) {
        if (rule.match(JsonIncludePropertyFilter.ALL_ELEMENT_PROPERTIES)) {
            this._includeProperties(rule, source, destination);
        }
        else {
            this._includeSpecificPath(rule, source, destination);
        }
    }
    _includeProperties(rule, source, destination) {
        const formattedRule = rule.substr(0, rule.length - 1);
        for (const propertySourcePath in source) {
            const formattedPropertySourcePath = propertySourcePath.replace(JsonIncludePropertyFilter.ARRAY_INDEX, JsonIncludePropertyFilter.STRING_EMPTY);
            const propertySourceValue = source[propertySourcePath];
            if (formattedRule === JsonIncludePropertyFilter.STRING_EMPTY) {
                if (propertySourcePath.split(JsonIncludePropertyFilter.PATH_SEPARATOR).length === 1) {
                    destination[propertySourcePath] = propertySourceValue;
                }
            }
            else {
                const splittedPropertySourcePath = formattedPropertySourcePath.split(JsonIncludePropertyFilter.PATH_SEPARATOR);
                const splittedFormattedRule = formattedRule.split(JsonIncludePropertyFilter.PATH_SEPARATOR);
                if (splittedFormattedRule.length === splittedPropertySourcePath.length) {
                    destination[propertySourcePath] = propertySourceValue;
                }
            }
        }
    }
    _includeSpecificPath(rule, source, destination) {
        for (const propertySourcePath in source) {
            const formattedPropertySourcePath = propertySourcePath.replace(JsonIncludePropertyFilter.ARRAY_INDEX, JsonIncludePropertyFilter.STRING_EMPTY);
            if (rule === formattedPropertySourcePath) {
                destination[propertySourcePath] = source[propertySourcePath];
            }
        }
    }
}
JsonIncludePropertyFilter.ALL_PROPERTIES = "**";
JsonIncludePropertyFilter.ALL_ELEMENT_PROPERTIES = /\*$/g;
JsonIncludePropertyFilter.ARRAY_INDEX = /\[[0-9]+\]/g;
JsonIncludePropertyFilter.PATH_SEPARATOR = ".";
JsonIncludePropertyFilter.STRING_EMPTY = "";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JsonIncludePropertyFilter;
