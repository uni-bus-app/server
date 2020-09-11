/* global QUnit */

const path = require('path');
const requireDir = require('require-directory');
const Ajv = require('ajv');
const { getStops, getTimes } = require('./helpers');

const schemaURI = 'https://unib.us/schemas';
const schemas = requireDir(module, path.join(__dirname, 'schemas'));
const ajv = new Ajv({ schemas: Object.values(schemas), allErrors: true, jsonPointers: true });

QUnit.test('Stops test', async assert => {
  const stops = await getStops();
  assert.ok(Array.isArray(stops), 'Expect the data to be an array');
  stops.forEach(element => {
    const validate = ajv.getSchema(`${schemaURI}/stop`);
    const valid = validate(element);
    assert.ok(valid, 'Check the structure of the stops matches the schema')
  });
});

QUnit.test('Times test', async assert => {
  const stops = await getStops();
  const times = await getTimes(stops[0]);
  assert.ok(Array.isArray(times), 'Expect the data to be an array');
  times.forEach(element => {
    const validate = ajv.getSchema(`${schemaURI}/time`);
    const valid = validate(element);
    assert.ok(valid, 'Check the structure of the times matches the schema')
  });
});