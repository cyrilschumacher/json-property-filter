/* The MIT License (MIT)
 *
 * Copyright (c) 2016 Cyril Schumacher.fr
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import convertJsonToArray from "./convertJsonToArray";
import convertArrayToJson from "./convertArrayToJson";

/**
 * Filter JSON property.
 * @class
 */
export class JsonPropertyFilter {
    private static ALL_PROPERTIES = "**";
    private static ALL_ROOT_PROPERTIES = "*";
    private static ARRAY_INDEX = /\[[0-9]+\]/g;

    private _propertiesToInclude: Array<string>;

    /**
     * Constructor.
     * @constructors
     * @param {string[]} args Properties.
     */
    public constructor(args: string | Array<string>) {
        const properties: Array<string> = this._formatProperties(args);
        this._propertiesToInclude = this._extractProperties(properties);
    }

    /**
     * Apply filter on a JSON object.
     * @param {Object} source A JSON object.
     * @return {Object} The filtered JSON object.
     */
    public apply = (source: Object): Object => {
        let destination = new Array<string>();

        if (this._containsAllPropertiesFilter()) {
            return source;
        } else {
            let keys = new Array<string>();
            convertJsonToArray(source, keys);
            for (let rule of this._propertiesToInclude) {
                this._include(rule, keys, destination);
            }
        }

        return convertArrayToJson(destination);
    }

    private _containsAllPropertiesFilter() {
        return this._propertiesToInclude.indexOf(JsonPropertyFilter.ALL_PROPERTIES) > -1;
    }

    private _include(rule: string, source: Array<string>, destination: Array<string>) {
        if (rule.endsWith(JsonPropertyFilter.ALL_ROOT_PROPERTIES)) {
            const formattedRule = rule.substr(0, rule.length - 1);
            for (const propertySourcePath in source) {
                const formattedPropertySourcePath = propertySourcePath.replace(JsonPropertyFilter.ARRAY_INDEX, "");
                const propertySourceValue = source[propertySourcePath];

                if (formattedRule === "") {
                    if (propertySourcePath.split(".").length === 1) {
                        destination[propertySourcePath] = propertySourceValue;
                    }
                } else if (propertySourcePath.startsWith(formattedRule) || formattedPropertySourcePath.startsWith(formattedRule)) {
                    const splittedPropertySourcePath = formattedPropertySourcePath.split(".");
                    const splittedFormattedRule = formattedRule.split(".");

                    if (splittedFormattedRule.length === splittedPropertySourcePath.length) {
                        destination[propertySourcePath] = propertySourceValue;
                    }
                }
            }
        } else {
            for (const propertySourcePath in source) {
                const formattedPropertySourcePath = propertySourcePath.replace(JsonPropertyFilter.ARRAY_INDEX, "");
                if (rule === formattedPropertySourcePath) {
                    destination[propertySourcePath] = source[propertySourcePath];
                }
            }
        }
    }

    private _extractProperties(properties: Array<string>): Array<string> {
        let include = new Array<string>();
        for (let property of properties) {
            if (property.startsWith("+")) {
                include.push(property.substring(1));
            } else {
                include.push(property);
            }
        }

        return include;
    }

    private _formatProperties(properties: string | Array<string>): Array<string> {
        if (typeof properties === "string") {
            return properties.split(",");
        } else {
            return properties;
        }
    }
}
