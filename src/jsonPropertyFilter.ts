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

import serializeToArray from "./serializer/serializeToArray";
import serializeToObject from "./serializer/serializeToObject";
import JsonExcludePropertyFilter from "./filter/jsonExcludePropertyFilter";
import JsonIncludePropertyFilter from "./filter/jsonIncludePropertyFilter";

/**
 * Filter JSON property.
 * @class
 */
export class JsonPropertyFilter {
    private static DEFAULT_INCLUDE_SYMBOL = /^()[^+-]/g;
    private static EXCLUDE_SYMBOL = /^(\-)/g;
    private static FILTER_SEPARATOR = ",";
    private static INCLUDE_SYMBOL = /^(\+)/g;

    private _exclude: JsonExcludePropertyFilter;
    private _include: JsonIncludePropertyFilter;

    /**
     * Constructor.
     * @constructors
     * @param {string|string[]} properties Properties.
     * @param {string} separator A separator for filters.
     */
    public constructor(properties: string | Array<string>, separator?: string) {
        this._assertProperties(properties);
        this._assertSeparator(separator);

        const formattedProperties = this._formatProperties(properties, separator);

        const includeSymbols = [JsonPropertyFilter.INCLUDE_SYMBOL, JsonPropertyFilter.DEFAULT_INCLUDE_SYMBOL];
        const propertiesToInclude = this._extractProperties(formattedProperties, includeSymbols);
        this._include = new JsonIncludePropertyFilter(propertiesToInclude);

        const excludeSymbols = [JsonPropertyFilter.EXCLUDE_SYMBOL];
        const propertiesToExclude = this._extractProperties(formattedProperties, excludeSymbols);
        this._exclude = new JsonExcludePropertyFilter(propertiesToExclude);
    }

    /**
     * Apply filter on a JSON object.
     * @param {Object} source A JSON object.
     * @return {Object} The filtered JSON object.
     */
    public apply(source: Object): Object {
        const keys = serializeToArray(source);
        let destination = new Array<string>();
        destination = this._include.apply(keys);
        destination = this._exclude.apply(destination);

        return serializeToObject(destination);
    }

    private _assertProperties(properties: string | Array<string>) {
        if (!Array.isArray(properties) && (typeof properties !== "string")) {
            throw new Error("_assertProperties(): Parameter 'args' is not a string or array type.");
        }
    }

    private _assertSeparator(separator?: string) {
        if (separator && (separator !== "string")) {
            throw new Error("_assertSeparator(): Parameter 'separator' is not a string type.");
        }
    }

    private _extractProperties(properties: Array<string>, symbols: Array<RegExp>): Array<string> {
        let extract = new Array<string>();

        for (let property of properties) {
            const formattedProperty = this._extractProperty(property, symbols);

            if (formattedProperty) {
                extract.push(formattedProperty);
            }
        }

        return extract;
    }

    private _extractProperty(property: string, symbols: Array<RegExp>): string {
        for (const symbol of symbols) {
            const matches = symbol.exec(property);
            symbol.lastIndex = 0;

            if (matches) {
                const start = matches[1];

                if (start.length) {
                    return property.substring(start.length);
                } else {
                    return property;
                }
            }
        }

        return undefined;
    }

    private _formatProperties(properties: string | Array<string>, separator?: string): Array<string> {
        separator = separator || JsonPropertyFilter.FILTER_SEPARATOR;

        if (typeof properties === "string") {
            return properties.split(separator);
        } else {
            return properties;
        }
    }
}
