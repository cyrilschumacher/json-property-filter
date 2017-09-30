# json-property-filter

> Filter a JSON object by including/excluding given properties.

[![MIT License][license-image]][license-url]
[![npm version][npmjs-image]][npmjs-url]
[![TypeScript][typescript-image]][typescript-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![typescript-standard-style][standard-image]][standard-url]
[![david-dm dependency Status][david-image]][david-url]
[![david-dm devDependency Status][david-dev-dependencies-image]][david-dev-dependencies-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]

**json-property-filter** is a JavaScript library for JSON data filtering by including or excluding properties. This library can be of interest if you need to provide JSON data and the caller wants to get specific properties (and thus avoid a relatively heavy response).

This library was developed with the programming language: [TypeScript](http://www.typescriptlang.org/) and is compatible Node 5+.

## Getting Started

### Usage

To install to using [npm](https://www.npmjs.com/) package manager or [Yarn](https://yarnpkg.com/):

```bash
$ npm install json-property-filter
$ yarn add json-property-filter
```

After installation, You can use the library this way:

```javascript
import { JsonPropertyFilter } from "json-property-filter";

const filter = new JsonPropertyFilter(["**"]);
filter.apply({ key: "value" });
```

If you want to have to have a quick overview of all features of this library, take a look at the [example](example), [integration tests](test/integration) or on [RunKit website](https://tonicdev.com/cyrilschumacher/json-property-filter).

### Command-Line

You have possibility to run in command-line this library without create a small JavaScript file. This executable provides all the options that are available at the code level. To see all the options, run the following line:

```bash
json-property-filter --help
```

### Filters

The following filters will allow you to include or exclude your object properties.

#### All properties

For include or exclude all the properties children and their children, you can use the symbol: `**`. Example: `**`, `root.**`, `root.node.**`.

#### Root properties

For include or exclude only properties located in the root, you can use the
symbol: `*`. Example: `root.*`, `root.node.*`.

#### Specific property

For include or include a specific property, you can set the path to your
property. Example: `root.element`, `root.node.element`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

[david-dev-dependencies-image]: https://david-dm.org/cyrilschumacher/json-property-filter/dev-status.svg
[david-dev-dependencies-url]: https://david-dm.org/cyrilschumacher/json-property-filter#info=devDependencies

[david-image]: https://david-dm.org/cyrilschumacher/json-property-filter.svg
[david-url]: https://david-dm.org/cyrilschumacher/json-property-filter

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
