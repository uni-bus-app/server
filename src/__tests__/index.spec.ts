const path = require('path');
const requireDir = require('require-directory');
const Ajv = require('ajv');
import { Application } from 'express';
import { Server } from 'http';
import request from 'supertest';
import { app, server } from '../index';
const hash = require('object-hash');

const schemaURI = 'https://unib.us/schemas';
const schemas = requireDir(module, path.join(__dirname, 'schemas'));
const ajv = new Ajv({
  schemas: Object.values(schemas),
  allErrors: true,
  jsonPointers: true,
});

class IntegrationHelpers {
  public static appInstance?: Application;
  public static serverInstance?: Server;

  public static async getApp(): Promise<Application> {
    if (this.appInstance) {
      return this.appInstance;
    }
    this.appInstance = app;

    return this.appInstance;
  }

  public static async getServer(): Promise<Server> {
    if (this.serverInstance) {
      return this.serverInstance;
    }
    this.serverInstance = server;

    return this.serverInstance;
  }
}

describe('API Tests', () => {
  let app: Application;

  beforeAll(async () => {
    app = await IntegrationHelpers.getApp();
  });

  test('Stops test', async () => {
    const response = await request(app).get('/api/stops');
    console.log(response);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((element: any) => {
      const validate = ajv.getSchema(`${schemaURI}/stop`);
      const valid = validate(element);
      expect(valid).toBe(true);
    });
  });

  // test('Times test', async () => {
  //   const stops = await getStops();
  //   const times = await getTimes(stops.body[0]);
  //   expect(Array.isArray(times.body)).toBe(true);
  //   times.body.forEach((element: any) => {
  //     const validate = ajv.getSchema(`${schemaURI}/time`);
  //     const valid = validate(element);
  //     expect(valid).toBe(true);
  //   });
  // });

  // test('Routes test', async () => {
  //   const routes = await getRoutes();
  //   expect(Array.isArray(routes.body)).toBe(true);
  //   routes.body.forEach((element: any) => {
  //     const validate = ajv.getSchema(`${schemaURI}/route`);
  //     const valid = validate(element);
  //     expect(valid).toBe(true);
  //   });
  // });

  afterAll(async () => {
    (await IntegrationHelpers.getServer()).close();
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