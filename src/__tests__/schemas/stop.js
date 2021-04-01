module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://unib.us/schemas/stop',
  title: 'Stop',
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    location: {
      type: 'object',
      properties: {
        _latitude: {
          type: 'number',
        },
        _longitude: {
          type: 'number',
        },
      },
      required: ['_latitude', '_longitude'],
    },
    routeOrder: {
      type: 'number',
    },
  },
  required: ['name', 'location', 'routeOrder'],
};
