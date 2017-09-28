/**
 * Example that include and excludes given JSON keys.
 */

const fs = require("fs");
const lib = require("../../lib/jsonPropertyFilter");

const buffer = fs.readFileSync("source.json");
const source = JSON.parse(buffer.toString());

const filter = new lib.JsonPropertyFilter(["**", "-$schema", "-type", "-properties.id.type"]);
const filtered = filter.apply(source);

console.log(filtered); // { title: 'Product', description: 'A product from Acme\'s catalog', properties: { id: { description: 'The unique identifier for a product' } }, required: [ 'id' ] }
