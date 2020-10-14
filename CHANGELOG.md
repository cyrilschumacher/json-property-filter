# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2020-10-14

### Changed

- Update `export`:  the class `JsonPropertyFilter` is replaced by a function `apply(object, string[])`;
- Update filtering mechanism;

## [1.3.1] - 2017-09-30

### Changed

- Update `package.json` description;

### Fixed

- Fix line separator: convert `CRLF` to `LF`;

## [1.3.0] - 2017-09-28

### Added

- Add `Date` and `Function` types support;

### Changed

- Update NPM dependencies;
- Improve TypeScript documentation;

### Fixed

- Fix CLI version;
- Fix CLI;
- Fix Regular expression on including and excluding filters;

## [1.2.0] - 2016-06-20

### Added

- Add getters/setters for `JsonPropertyFilter` class to obtain/set the exclude/include filters;
- Add the possibility to define the symbols of include/exclude;
- Add CLI support;

### Changed

- Update `JsonPropertyFilter` constructor to add optional arguments;
- Update validation on filter arguments;

## [1.1.1] - 2016-06-12

### Fixed

- Fix filter for embedded array;

## [1.1.0] - 2016-06-12

### Added

- Add arrays support;

## [1.0.2] - 2016-05-29

### Fixed

- Fix TypeScript definition path;

## [1.0.1] - 2016-05-29

### Added

- Add TypeScript definition in `lib` directory;

## [1.0.0] - 2016-05-29

### Added

- Add more validation on parameters;
- Add exclude filters;

### Changed

- Update the "include" behavior: if no properties, then the original object is returned;

### Fixed

- Fix filter if it contains an array of `string`/`number`/`boolean`;
- Fix filter with an empty symbol;

[2.0.0]: https://github.com/cyrilschumacher/json-property-filter/compare/1.3.1...2.0.0
[1.3.1]: https://github.com/cyrilschumacher/json-property-filter/compare/1.3.0...1.3.1
[1.3.0]: https://github.com/cyrilschumacher/json-property-filter/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/cyrilschumacher/json-property-filter/compare/1.1.1...1.2.0
[1.1.1]: https://github.com/cyrilschumacher/json-property-filter/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/cyrilschumacher/json-property-filter/compare/1.0.2...1.1.0
[1.0.2]: https://github.com/cyrilschumacher/json-property-filter/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/cyrilschumacher/json-property-filter/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/cyrilschumacher/json-property-filter/compare/0.0.8...1.0.0
