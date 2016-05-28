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

import JsonSerializer from "./jsonSerializer";
import JsonExcludePropertyFilter from "./jsonExcludePropertyFilter";
import JsonIncludePropertyFilter from "./jsonIncludePropertyFilter";

/**
 * Filter JSON property.
 * @class
 */
export class JsonPropertyFilter {
    private static INCLUDE_SYMBOL = "+";
    private static EXCLUDE_SYMBOL = "-";
    private static FILTER_SEPARATOR = ",";

    private _exclude: JsonExcludePropertyFilter;
    private _include: JsonIncludePropertyFilter;

    /**
     * Constructor.
     * @constructors
     * @param {string|string[]} args Properties.
     * @param {string} separator A separator for filters.
     */
    public constructor(args: string | Array<string>, separator?: string) {
        const properties = this._formatProperties(args, separator);
        const propertiesToInclude = this._extractProperties(properties, [JsonPropertyFilter.INCLUDE_SYMBOL, ""]);
        const propertiesToExclude = this._extractProperties(properties, [JsonPropertyFilter.EXCLUDE_SYMBOL]);

        this._exclude = new JsonExcludePropertyFilter(propertiesToExclude);
        this._include = new JsonIncludePropertyFilter(propertiesToInclude);
    }

    /**
     * Apply filter on a JSON object.
     * @param {Object} source A JSON object.
     * @return {Object} The filtered JSON object.
     */
    public apply(source: Object): Object {
        const keys = JsonSerializer.serializeToArray(source);
        let destination = new Array<string>();
        destination = this._include.apply(keys);
        destination = this._exclude.apply(destination);

        const filtered = JsonSerializer.serializeToObject(destination);

        return filtered;
    }

    private _extractProperties(properties: Array<string>, symbols: Array<string>): Array<string> {
        let include = new Array<string>();

        for (let property of properties) {
            const formattedProperty = this._extractProperty(property, symbols);
            if (formattedProperty) {
                include.push(formattedProperty);
            }
        }

        return include;
    }

    private _extractProperty(property: string, symbols: Array<string>): string {
        for (const symbol of symbols) {
            const inProperty = property.indexOf(symbol);
            if (inProperty === 0) {
                return property.substring(symbol.length);
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
