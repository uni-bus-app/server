/* global test, expect */

const path = require('path');
const requireDir = require('require-directory');
const Ajv = require('ajv');
const { getStops, getTimes, getRoutes } = require('./helpers');

const schemaURI = 'https://unib.us/schemas';
const schemas = requireDir(module, path.join(__dirname, 'schemas'));
const ajv = new Ajv({
  schemas: Object.values(schemas),
  allErrors: true,
  jsonPointers: true,
});

test('Stops test', async () => {
  const stops = await getStops();
  expect(Array.isArray(stops)).toBe(true);
  stops.forEach((element) => {
    const validate = ajv.getSchema(`${schemaURI}/stop`);
    const valid = validate(element);
    expect(valid).toBe(true);
  });
});

test('Times test', async () => {
  const stops = await getStops();
  const times = await getTimes(stops[0]);
  expect(Array.isArray(times)).toBe(true);
  times.forEach((element) => {
    const validate = ajv.getSchema(`${schemaURI}/time`);
    const valid = validate(element);
    expect(valid).toBe(true);
  });
});

test('Routes test', async () => {
  const routes = await getRoutes();
  expect(Array.isArray(routes)).toBe(true);
  routes.forEach((element) => {
    const validate = ajv.getSchema(`${schemaURI}/route`);
    const valid = validate(element);
    expect(valid).toBe(true);
  });
});