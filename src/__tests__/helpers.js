const fetch = require('node-fetch');

const localUrl = 'http://localhost:8080';

async function getStops() {
  const res = await fetch(`${localUrl}/stops`);
  return await res.json();
}

async function getTimes(stop) {
  const res = await fetch(`${localUrl}/stops/${stop.id}/times`);
  return await res.json();
}

async function getRoutes() {
  const res = await fetch(`${localUrl}/routes`);
  return await res.json();
}

async function sync(versions) {
  const res = await fetch(`${localUrl}/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(versions),
  });
  return await res.json();
}

module.exports = {
  getStops,
  getTimes,
  getRoutes,
  sync,
};
