# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.3.1] - 2017-09-30
### Changed
- Update package.json description.

### Fixed
- Fix line separator: convert `CRLF` to `LF`.

## [1.3.0] - 2017-09-28
### Added
- Add `Date` and `Function` types support.
- Add examples.

### Changed
- Update: `README.md`.
- Update NPM dependencies.
- Improve unit/integration tests.
- Improve TypeScript documentation.

### Fixed
- Fix CLI version.
- Fix CLI.
- Fix Regular expression on including and excluding filters.

## [1.2.0] - 2016-06-20
### Added
- Add getters/setters for `JsonPropertyFilter` class to obtain/set the exclude/include filters.
- Add the posibility to define the symbols of include/exclude.
- Add CLI support.

### Changed
- All constructor arguments of the `JsonPropertyFilter` class are optionals.
- The `TypeError` object is used to assert separator and filters arguments.

## [1.1.1] - 2016-06-12
### Fixed
- A array contained in a base array can be ignored when filtering.

## [1.1.0] - 2016-06-12
### Added
- Add arrays support.

## [1.0.2] - 2016-05-29
### Fixed
- Fix TypeScript definition path.

## [1.0.1] - 2016-05-29
### Added
- Add TypeScript definition in "lib" directory.

## [1.0.0] - 2016-05-29
### Added
- Add more validation on parameters.
- Add exclude filters.

### Changed
- Update the "include" behavior: if no properties, then the original object is returned.

### Fixed
- The `apply` method of `JsonPropertyFilter` class can return a wrong filtered object if it contains an array of `string`/`number`/`boolean`.
- The symbol "" causes an undesirable side effect: all properties are added without distinction.

## [0.0.8] - 2016-05-28
### Changed
- Update the filter `**`: it can also be applied to a specific property.

[Unreleased]: https://github.com/cyrilschumacher/json-property-filter/compare/1.3.1...HEAD
[1.3.0]: https://github.com/cyrilschumacher/json-property-filter/compare/1.3.0...1.3.1
[1.2.0]: https://github.com/cyrilschumacher/json-property-filter/compare/1.1.1...1.2.0
[1.1.1]: https://github.com/cyrilschumacher/json-property-filter/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/cyrilschumacher/json-property-filter/compare/1.0.2...1.1.0
[1.0.2]: https://github.com/cyrilschumacher/json-property-filter/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/cyrilschumacher/json-property-filter/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/cyrilschumacher/json-property-filter/compare/0.0.8...1.0.0
[0.0.8]: https://github.com/cyrilschumacher/json-property-filter/compare/0.0.6...0.0.8
