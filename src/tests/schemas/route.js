module.exports = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://unib.us/schemas/route",
  title: "Route",
  type: "object",
  properties: {
    routeNumber: {
      type: "number"
    },
    stops: {
      type: "array",
      properties: {
        stop: {
          type: "string"
        },
        time: {
          type: "string"
        }
      },
      required: ['stop', 'time']
    },
  },
  required: ['routeNumber', 'stops']
}