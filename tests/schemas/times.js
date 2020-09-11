module.exports = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://unib.us/schemas/time",
  title: "Time",
  type: "object",
  properties: {
    stopID: {
      type: "string"
    },
    times: {
      type: "array",
      properties: {
        routeNumber: {
          type: "string"
        },
        scheduled: {
          type: "number"
        }
      }
    },
  }
}