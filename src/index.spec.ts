import path from 'path';
import requireDir from 'require-directory';
import Ajv from 'ajv';
import request from 'supertest';
import { app, server } from './index';
import hash from 'object-hash';

const schemaURI = 'https://unib.us/schemas';
const schemas = requireDir(module, path.join(__dirname, '__tests__/schemas'));
const ajv = new Ajv({
  schemas: Object.values(schemas),
  allErrors: true,
  jsonPointers: true,
});

describe('API Tests', () => {
  describe('Stops test', () => {
    it('should match the schema', async () => {
      const response = await request(app).get('/api/stops');

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((element: any) => {
        const validate = ajv.getSchema(`${schemaURI}/stop`);
        const valid = validate(element);
        expect(valid).toBe(true);
      });
    });
  });

  describe('Times test', () => {
    it('should match the schema', async () => {
      const stops = await request(app).get('/api/stops');
      const times = await request(app).get(
        `/api/stops/${stops.body[0].id}/times`
      );
      expect(Array.isArray(times.body)).toBe(true);
      times.body.forEach((element: any) => {
        const validate = ajv.getSchema(`${schemaURI}/time`);
        const valid = validate(element);
        expect(valid).toBe(true);
      });
    });
  });

  describe('Routes test', () => {
    it('should match the schema', async () => {
      const routes = await request(app).get('/api/routes');
      expect(Array.isArray(routes.body)).toBe(true);
      routes.body.forEach((element: any) => {
        const validate = ajv.getSchema(`${schemaURI}/route`);
        const valid = validate(element);
        expect(valid).toBe(true);
      });
    });
  });

  afterAll(() => {
    server.close();
  });
});

// test('Sync test', async () => {
//   // Test sync works with incorrect/missing version
//   const data = await sync({
//     stopsVersion: 'incorrect',
//     timesVersion: 'incorrect',
//   });
//   expect(data.updates).toBe(true);
//   expect(data.stops).toBeTruthy();
//   expect(data.times).toBeTruthy();
//   data.stops.forEach((element: any) => {
//     const validate = ajv.getSchema(`${schemaURI}/stop`);
//     const valid = validate(element);
//     expect(valid).toBe(true);
//   });
//   data.times.forEach((element: any) => {
//     element.times.forEach((time: any) => {
//       const validate = ajv.getSchema(`${schemaURI}/time`);
//       const valid = validate(time);
//       expect(valid).toBe(true);
//     });
//   });

//   // Generate correct version from times/stops data
//   const stopsVersion = hash(data.stops, { respectType: false });
//   const timesVersion = hash(data.times, { unorderedArrays: true });

//   // Test sync route returns no updates if correct versions are sent
//   const data1 = await sync({ stopsVersion, timesVersion });
//   expect(data1.updates).toBe(false);
// });
