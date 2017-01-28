/* The MIT License (MIT)
 *
 * Copyright (c) 2017 Cyril Schumacher.fr
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

/**
 * Filter include JSON property.
 * @class
 * @version 1.1.1
 */
export default class JsonIncludePropertyFilter {
    private static ALL_PROPERTIES_REGEX = /\*\*$/g;
    private static ALL_ELEMENT_PROPERTIES_REGEX = /\*$/g;
    private static ARRAY_INDEX = /\[[0-9]+\]/g;
    private static ARRAY_INDEX_START = /^\[([0-9]+)\]\./;
    private static PATH_SEPARATOR = ".";
    private static STRING_EMPTY = "";

    private _properties: Array<string>;

    /**
     * Constructor.
     * @constructors
     * @param {string[]} properties Properties.
     */
    public constructor(properties: Array<string>) {
        this._properties = properties;
    }

    /**
     * Apply filter on a JSON object.
     * @param {Object} source A JSON object.
     * @return {Object} The filtered JSON object.
     */
    public apply = (source: Array<string>): Array<string> => {
        if (this._properties.length) {
            const destination = new Array<string>();

            for (let rule of this._properties) {
                this._include(rule, source, destination);
            }

            return destination;
        } else {
            return source;
        }
    }

    private _include(rule: string, source: Array<string>, destination: Array<string>) {
        if (rule.match(JsonIncludePropertyFilter.ALL_PROPERTIES_REGEX)) {
            this._includeProperties(rule, source, destination);
        } else if (rule.match(JsonIncludePropertyFilter.ALL_ELEMENT_PROPERTIES_REGEX)) {
            this._includeRootProperties(rule, source, destination);
        } else {
            this._includeSpecificPath(rule, source, destination);
        }
    }

    private _includeProperty(rule: string, path: string, value: string, destination: Array<string>) {
        const cleanPath = this._removeArrayIndexStart(path);
        const regexp = `^${rule}`;

        if (cleanPath.match(regexp)) {
            destination[path] = value;
        }
    }

    private _includeProperties(rule: string, source: Array<string>, destination: Array<string>) {
        const formattedRule = rule.substr(0, rule.length - 2);

        for (const path in source) {
            if (path) {
                const value = source[path];
                this._includeProperty(formattedRule, path, value, destination);
            }
        }
    }

    private _includeRootProperty(rule: string, path: string, value: string, source: Array<string>, destination: Array<string>) {
        const pathWithoutArrayIndexStart = this._removeArrayIndexStart(path);

        if (rule === JsonIncludePropertyFilter.STRING_EMPTY) {
            const splittedPath = pathWithoutArrayIndexStart.split(JsonIncludePropertyFilter.PATH_SEPARATOR);

            if (splittedPath.length === 1) {
                destination[path] = value;
            }
        } else {
            const regexp = `^${rule}`;

            if (pathWithoutArrayIndexStart.match(regexp)) {
                const pathItems = pathWithoutArrayIndexStart.split(JsonIncludePropertyFilter.PATH_SEPARATOR);
                const ruleItems = rule.split(JsonIncludePropertyFilter.PATH_SEPARATOR);

                if (pathItems.length === ruleItems.length) {
                    destination[path] = value;
                }
            }
        }
    }

    private _includeRootProperties(rule: string, source: Array<string>, destination: Array<string>) {
        const ruleWithoutRootSymbol = rule.substr(0, rule.length - 1);

        for (const path in source) {
            if (path) {
                const value = source[path];
                this._includeRootProperty(ruleWithoutRootSymbol, path, value, source, destination);
            }
        }
    }

    private _includeSpecificPath(rule: string, source: Array<string>, destination: Array<string>) {
        for (const path in source) {
            if (path) {
                const pathWithoutArrayIndexStart = this._removeArrayIndexStart(path);
                const pathWithoutIndex = this._removeArrayIndex(pathWithoutArrayIndexStart);
                const regexp = `^${rule}`;

                if (pathWithoutIndex.match(regexp)) {
                    destination[path] = source[path];
                }
            }
        }
    }

    private _removeArrayIndex(path: string) {
        return path.replace(JsonIncludePropertyFilter.ARRAY_INDEX, JsonIncludePropertyFilter.STRING_EMPTY);
    }

    private _removeArrayIndexStart(path: string) {
        return path.replace(JsonIncludePropertyFilter.ARRAY_INDEX_START, JsonIncludePropertyFilter.STRING_EMPTY);
    }
}
