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
export default class JsonPropertyFilter {
    /**
     * Properties to include.
     * @private
     * @type {string[]}
     */
    private _propertiesToInclude: Array<string>;

    /**
     * Constructor.
     * @constructors
     * @param {string[]} properties Properties.
     */
    public constructor(...properties: string[]) {
        this._propertiesToInclude = new Array<string>();

        for (let property of properties) {
            if (property.startsWith("+")) {
                this._propertiesToInclude.push(property.substring(1));
            } else {
                this._propertiesToInclude.push(property);
            }
        }
    }

    public apply = (source: Object): Object => {
        let destination = new Array<string>();

        if (this._propertiesToInclude.indexOf("**") > -1) {
            return source;
        } else {
            let v = new Array<string>();
            convertJsonToArray(source, v);
            for (let rule of this._propertiesToInclude) {
                this._include(rule, v, destination);
            }
        }

        return convertArrayToJson(destination);
    }

    public _include = (rule: string, source: Array<string>, destination: Array<string>): void => {
        if (rule.endsWith("*")) {
            const formattedRule = rule.substr(0, rule.length - 1);
            for (const propertySourcePath in source) {
                const propertySourceValue = source[propertySourcePath];
                if (formattedRule === "") {
                    if (propertySourcePath.split(".").length === 1) {
                        destination[propertySourcePath] = propertySourceValue;
                    }
                } else if (propertySourcePath.startsWith(formattedRule)) {
                    destination[propertySourcePath] = propertySourceValue;
                }
            }
        } else {
            for (const propertySourcePath in source) {
                if (rule === propertySourcePath) {
                    destination[propertySourcePath] = source[propertySourcePath];
                }
            }
        }
    }
}
