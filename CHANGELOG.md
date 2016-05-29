# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.2] - 2015-05-29
### Fixed
- Fix TypeScript definition path.

## [1.0.1] - 2015-05-29
### Added
- Add TypeScript definition in "lib" directory.

## [1.0.0] - 2015-05-29
### Added
- Add more validation on parameters.
- Add exclude filters.

### Changed
- Update the "include" behavior: if no properties, then the original object is returned.

### Fixed
- The `apply` method of `JsonPropertyFilter` class can return a wrong filtered object if it contains an array of `string`/`number`/`boolean`.
- The symbol "" causes an undesirable side effect: all properties are added without distinction.

## [0.0.8] - 2015-05-28
### Changed
- Update the filter `**`: it can also be applied to a specific property.

[1.0.2]: https://github.com/cyrilschumacher/json-property-filter/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/cyrilschumacher/json-property-filter/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/cyrilschumacher/json-property-filter/compare/0.0.8...1.0.0
[0.0.8]: https://github.com/cyrilschumacher/json-property-filter/compare/0.0.6...0.0.8
