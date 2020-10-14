# json-property-filter

> JavaScript library and application to filter a JSON object by including and excluding properties.

[![MIT License][license-image]][license-url]
[![npm version][npmjs-image]][npmjs-url]
[![TypeScript][typescript-image]][typescript-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![typescript-standard-style][standard-image]][standard-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]

**json-property-filter** is a JavaScript library, developed in TypeScript, providing a function to include and/or exclude JSON properties. In addition to providing a function, an executable is available to filter a JSON file.

The library can also be from a Web page: the generated code is ES5 compatible.

## Getting Started

### Usage

To install to using [npm](https://www.npmjs.com/) package manager:

```bash
npm install json-property-filter
```

After installation, You can use the library this way:

```typescript
import * as jsonPropertyFilter from "json-property-filter";

const source = { key: "value" };
const filters = ["**"];
const result = jsonPropertyFilter.apply(source, filters);
```

If you want to have to have a quick overview of all features of this library, take a look at the [unit tests](test) or on [RunKit website](https://tonicdev.com/cyrilschumacher/json-property-filter).

### Command-Line

You have possibility to run in command-line this library without create a small TypeScript file. This executable provides all the options that are available at the code level. To see all the options, run the following line:

```bash
json-property-filter --help
```

To filter a JSON file and produce a filtered JSON file containing only `message` and `timestamp` properties, the following options are used:

```bash
json-property-filter --in "source.json" --out "destination.json" --filters "message" --filters "timestamp"
```

To filter a JSON file and display the result formatted with 4 spaces in the console, the following options are used:

```bash
json-property-filter --in "source.json" --filters "message" --filters "timestamp" --pretty --pretty-space 4
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[npmjs-image]: https://badge.fury.io/js/json-property-filter.svg
[npmjs-url]: https://www.npmjs.com/package/json-property-filter

[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standard-url]: https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines

[travis-image]: https://travis-ci.org/cyrilschumacher/json-property-filter.svg
[travis-url]: https://travis-ci.org/cyrilschumacher/json-property-filter

[typescript-image]: https://badges.frapsoft.com/typescript/code/typescript.svg?v=101
[typescript-url]: https://github.com/ellerbrock/typescript-badges/

[snyk-image]: https://snyk.io/test/github/cyrilschumacher/json-property-filter/badge.svg
[snyk-url]: https://snyk.io/test/github/cyrilschumacher/json-property-filter

[coveralls-image]: https://coveralls.io/repos/github/cyrilschumacher/json-property-filter/badge.svg?branch=develop
[coveralls-url]: https://coveralls.io/github/cyrilschumacher/json-property-filter?branch=develop
