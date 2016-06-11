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

/**
 * Filter include JSON property.
 * @class
 */
export default class JsonExcludePropertyFilter {
    private static ALL_PROPERTIES_REGEX = /\*\*$/g;
    private static ALL_ELEMENT_PROPERTIES_REGEX = /\*$/g;
    private static ARRAY_INDEX = /\[[0-9]+\]/g;
    private static ARRAY_INDEX_START = /^\[([0-9]+)\]./;
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
            for (let rule of this._properties) {
                this._exclude(rule, source);
            }

            return source;
        }

        return source;
    }

    private _cleanupPath(path: string) {
        return path.replace(JsonExcludePropertyFilter.ARRAY_INDEX_START, "");
    }

    private _exclude(rule: string, source: Array<string>) {
        if (rule.match(JsonExcludePropertyFilter.ALL_PROPERTIES_REGEX)) {
            this._excludeProperties(rule, source);
        } else if (rule.match(JsonExcludePropertyFilter.ALL_ELEMENT_PROPERTIES_REGEX)) {
            this._excludeRootProperties(rule, source);
        } else {
            this._excludeSpecificPath(rule, source);
        }
    }

    private _excludeProperty(rule: string, source: Array<string>, path: string) {
        const cleanPath = this._cleanupPath(path);
        const regexp = `^${rule}`;

        if (cleanPath.match(regexp)) {
            delete source[path];
        }
    }

    private _excludeProperties(rule: string, source: Array<string>) {
        const formattedRule = rule.substr(0, rule.length - 2);

        for (const path in source) {
            if (path) {
                this._excludeProperty(formattedRule, source, path);
            }
        }
    }

    private _excludeRootProperty(rule: string, path: string, source: Array<string>) {
        const pathWithoutIndex = path.replace(JsonExcludePropertyFilter.ARRAY_INDEX, JsonExcludePropertyFilter.STRING_EMPTY);

        if (rule === JsonExcludePropertyFilter.STRING_EMPTY) {
            const cleanPath = this._cleanupPath(path);
            const splittedPath = cleanPath.split(JsonExcludePropertyFilter.PATH_SEPARATOR);

            if (splittedPath.length === 1) {
                delete source[path];
            }
        } else {
            const regexp = `^${rule}`;

            if (pathWithoutIndex.match(regexp)) {
                const pathItems = pathWithoutIndex.split(JsonExcludePropertyFilter.PATH_SEPARATOR);
                const ruleItems = rule.split(JsonExcludePropertyFilter.PATH_SEPARATOR);

                if (pathItems.length === ruleItems.length) {
                    delete source[path];
                }
            }
        }
    }

    private _excludeRootProperties(rule: string, source: Array<string>) {
        const ruleWithoutRootSymbol = rule.substr(0, rule.length - 1);

        for (const path in source) {
            if (path) {
                this._excludeRootProperty(ruleWithoutRootSymbol, path, source);
            }
        }
    }

    private _excludeSpecificPath(rule: string, source: Array<string>) {
        const regexp = `^${rule}`;
        for (const path in source) {
            if (path) {
                const cleanPath = this._cleanupPath(path);
                const pathWithoutIndex = cleanPath.replace(JsonExcludePropertyFilter.ARRAY_INDEX, JsonExcludePropertyFilter.STRING_EMPTY);

                if (pathWithoutIndex.match(regexp)) {
                    const pathWithoutIndexItems = pathWithoutIndex.split(".");
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
}
