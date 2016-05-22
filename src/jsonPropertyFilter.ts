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
import JsonIncludePropertyFilter from "./jsonIncludePropertyFilter";

/**
 * Filter JSON property.
 * @class
 */
export class JsonPropertyFilter {
    private static INCLUDE_SYMBOL = "+";

    private _include: JsonIncludePropertyFilter;

    /**
     * Constructor.
     * @constructors
     * @param {string|string[]} args Properties.
     */
    public constructor(args: string | Array<string>) {
        const properties: Array<string> = this._formatProperties(args);
        const propertiesToInclude = this._extractProperties(properties);

        this._include = new JsonIncludePropertyFilter(propertiesToInclude);
    }

    /**
     * Apply filter on a JSON object.
     * @param {Object} source A JSON object.
     * @return {Object} The filtered JSON object.
     */
    public apply(source: Object): Object {
        const keys = JsonSerializer.serializeToArray(source);
        const destination = this._include.apply(keys);
        const filtered = JsonSerializer.serializeToObject(destination);

        return filtered;
    }

    private _extractProperties(properties: Array<string>): Array<string> {
        let include = new Array<string>();

        for (let property of properties) {
            const isIncludeProperty = property.indexOf(JsonPropertyFilter.INCLUDE_SYMBOL) === 0;

            if (isIncludeProperty) {
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
