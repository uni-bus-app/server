const fetch = require('node-fetch');

const localUrl = 'http://localhost:8080';

const apiCall = async (path, body) => {
  const reqInit = body
    ? {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(versions),
      }
    : undefined;
  const res = await fetch(`${localUrl}${path}`, reqInit);
  return await res.json();
};

const getStops = () => apiCall('/stops');

const getTimes = (stop) => apiCall(`${localUrl}/stops/${stop.id}/times`);

const getRoutes = () => apiCall('/routes');

const sync = (versions) => apiCall('/sync', versions);

module.exports = {
  getStops,
  getTimes,
  getRoutes,
  sync,
};
