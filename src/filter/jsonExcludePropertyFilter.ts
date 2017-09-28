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
 *
 * @class
 * @version 1.1.1
 */
export class JsonExcludePropertyFilter {
    private static readonly ALL_PROPERTIES_REGEX = /\*\*$/g;
    private static readonly ALL_ELEMENT_PROPERTIES_REGEX = /\*$/g;
    private static readonly ARRAY_INDEX = /\[[0-9]+\]/g;
    private static readonly ARRAY_INDEX_START = /^\[([0-9]+)\]\./;
    private static readonly PATH_SEPARATOR = ".";
    private static readonly STRING_EMPTY = "";

    /**
     * Constructor.
     *
     * @constructor
     * @param {string[]} _properties Properties.
     */
    public constructor(private readonly _properties: string[]) {}

    /**
     * Apply filter on a JSON object.
     *
     * @param {Array} source A JSON object.
     * @return {Array} The filtered JSON object.
     */
    public apply(source: string[]) {
        if (this._properties.length) {
            for (const rule of this._properties) {
                this._exclude(rule, source);
            }

            return source;
        }

        return source;
    }

    private _exclude(rule: string, source: string[]) {
        if (rule.match(JsonExcludePropertyFilter.ALL_PROPERTIES_REGEX)) {
            this._excludeProperties(rule, source);
        } else if (rule.match(JsonExcludePropertyFilter.ALL_ELEMENT_PROPERTIES_REGEX)) {
            this._excludeRootProperties(rule, source);
        } else {
            this._excludeSpecificPath(rule, source);
        }
    }

    private _excludeProperty(rule: string, source: string[], path: string) {
        const pathWithoutArrayIndexStart = this._removeArrayIndexStart(path);
        const regexp = `^${rule.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")}`;

        if (pathWithoutArrayIndexStart.match(regexp)) {
            delete source[path];
        }
    }

    private _excludeProperties(rule: string, source: string[]) {
        const formattedRule = rule.substr(0, rule.length - 2);

        for (const path in source) {
            if (path) {
                this._excludeProperty(formattedRule, source, path);
            }
        }
    }

    private _excludeRootProperty(rule: string, path: string, source: string[]) {
        const pathWithoutIndex = this._removeArrayIndex(path);

        if (rule === JsonExcludePropertyFilter.STRING_EMPTY) {
            const pathWithoutArrayIndexStart = this._removeArrayIndexStart(path);
            const splittedPath = pathWithoutArrayIndexStart.split(JsonExcludePropertyFilter.PATH_SEPARATOR);

            if (splittedPath.length === 1) {
                delete source[path];
            }
        } else {
            const regexp = `^${rule.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")}`;

            if (pathWithoutIndex.match(regexp)) {
                const pathItems = pathWithoutIndex.split(JsonExcludePropertyFilter.PATH_SEPARATOR);
                const ruleItems = rule.split(JsonExcludePropertyFilter.PATH_SEPARATOR);

                if (pathItems.length === ruleItems.length) {
                    delete source[path];
                }
            }
        }
    }

    private _excludeRootProperties(rule: string, source: string[]) {
        const ruleWithoutRootSymbol = rule.substr(0, rule.length - 1);

        for (const path in source) {
            if (path) {
                this._excludeRootProperty(ruleWithoutRootSymbol, path, source);
            }
        }
    }

    private _excludeSpecificPath(rule: string, source: string[]) {
        const regexp = `^${rule.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")}`;
        for (const path in source) {
            if (path) {
                const pathWithoutArrayIndexStart = this._removeArrayIndexStart(path);
                const pathWithoutIndex = this._removeArrayIndex(pathWithoutArrayIndexStart);

                if (pathWithoutIndex.match(regexp)) {
                    const pathWithoutIndexItems = pathWithoutIndex.split(JsonExcludePropertyFilter.PATH_SEPARATOR);
                    const ruleItems = rule.split(".");
                    const pathWithoutIndexItem = pathWithoutIndexItems[ruleItems.length - 1];
                    const ruleItem = ruleItems[ruleItems.length - 1];

                    if (pathWithoutIndexItem === ruleItem) {
                        delete source[path];
                    }
                }
            }
        }
    }

    private _removeArrayIndex(path: string) {
        return path.replace(JsonExcludePropertyFilter.ARRAY_INDEX, JsonExcludePropertyFilter.STRING_EMPTY);
    }

    private _removeArrayIndexStart(path: string) {
        return path.replace(JsonExcludePropertyFilter.ARRAY_INDEX_START, JsonExcludePropertyFilter.STRING_EMPTY);
    }
}
