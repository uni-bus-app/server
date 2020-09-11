const fetch = require('node-fetch');

async function getStops() {
  const res = await fetch('http://localhost:8080/stops');
  return await res.json();
}

async function getTimes(stop) {
  const res = await fetch(`http://localhost:8080/stops/${stop.id}/times`);
  return await res.json();
}

module.exports = {
  getStops,
  getTimes
}