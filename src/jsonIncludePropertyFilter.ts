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
export default class JsonIncludePropertyFilter {
    private static ALL_PROPERTIES = "**";
    private static ALL_ELEMENT_PROPERTIES = /\*$/g;
    private static ARRAY_INDEX = /\[[0-9]+\]/g;
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
        const destination = new Array<string>();
        if (this._containsAllPropertiesFilter()) {
            return source;
        }

        for (let rule of this._properties) {
            this._include(rule, source, destination);
        }

        return destination;
    }

    private _containsAllPropertiesFilter() {
        return this._properties.indexOf(JsonIncludePropertyFilter.ALL_PROPERTIES) > -1;
    }

    private _include(rule: string, source: Array<string>, destination: Array<string>) {
        if (rule.match(JsonIncludePropertyFilter.ALL_ELEMENT_PROPERTIES)) {
            this._includeProperties(rule, source, destination);
        } else {
            this._includeSpecificPath(rule, source, destination);
        }
    }

    private _includeProperties(rule: string, source: Array<string>, destination: Array<string>) {
        const formattedRule = rule.substr(0, rule.length - 1);

        for (const propertySourcePath in source) {
            const formattedPropertySourcePath = propertySourcePath.replace(JsonIncludePropertyFilter.ARRAY_INDEX, JsonIncludePropertyFilter.STRING_EMPTY);
            const propertySourceValue = source[propertySourcePath];
            if (formattedRule === JsonIncludePropertyFilter.STRING_EMPTY) {
                if (propertySourcePath.split(JsonIncludePropertyFilter.PATH_SEPARATOR).length === 1) {
                    destination[propertySourcePath] = propertySourceValue;
                }
            } else {
                if (formattedPropertySourcePath.match(`^${formattedRule}`)) {
                  const splittedFormattedPropertySourcePath = formattedPropertySourcePath.split(".");
                  const splittedFormattedRule = formattedRule.split(".");

                  if (splittedFormattedPropertySourcePath.length === splittedFormattedRule.length) {
                    destination[propertySourcePath] = propertySourceValue;
                  }
                }
            }
        }
    }

    private _includeSpecificPath(rule: string, source: Array<string>, destination: Array<string>) {
        for (const propertySourcePath in source) {
            const formattedPropertySourcePath = propertySourcePath.replace(JsonIncludePropertyFilter.ARRAY_INDEX, JsonIncludePropertyFilter.STRING_EMPTY);

            if (rule === formattedPropertySourcePath) {
                destination[propertySourcePath] = source[propertySourcePath];
            }
        }
    }
}
