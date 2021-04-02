module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://unib.us/schemas/time',
  title: 'Time',
  type: 'object',
  properties: {
    routeNumber: {
      type: 'number',
    },
    scheduled: {
      type: 'string',
    },
  },
  required: ['routeNumber', 'scheduled'],
};
