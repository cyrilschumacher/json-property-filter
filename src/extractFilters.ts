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

function _extractFilterBySymbol(filter: string, symbol: string) {
    if (symbol.length) {
        return filter.substring(symbol.length);
    } else {
        return filter;
    }
}

function _extractFilterBySymbols(filter: string, symbolPatterns: Array<RegExp>): string|null {
    for (const symbolPattern of symbolPatterns) {
        const symbol = _getSymbol(filter, symbolPattern);
        if (symbol !== null) {
            return _extractFilterBySymbol(filter, symbol);
        }
    }

    return null;
}

function _getSymbol(filter: string, symbol: RegExp): string|null {
    const matches = symbol.exec(filter);
    symbol.lastIndex = 0;

    if (matches && (matches.length > 1)) {
        return matches[1];
    }

    return null;
}

/**
 * Extract filters according symbols.
 * @version 1.2.0
 * @param {string[]} filters Filters to extract.
 * @param {RegExp[]} symbols Symbol patterns.
 * @return {string[]} Filters.
 */
export default function extractFilters(filters: Array<string>, symbolPatterns: Array<RegExp>): Array<string> {
    let extract = new Array<string>();

    for (let filter of filters) {
        const formattedFilter = _extractFilterBySymbols(filter, symbolPatterns);
        if (formattedFilter) {
            extract.push(formattedFilter);
        }
    }

    return extract;
}
