import { parseStringPromise } from 'xml2js';

function simplifyObject(obj: any) {
  for (const key in obj) {
    if (Array.isArray(obj[key]) && obj[key].length === 1) {
      obj[key] = simplifyObject(obj[key][0]);
    } else if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map((item: any) => simplifyObject(item));
    } else if (typeof obj[key] === 'object') {
      obj[key] = simplifyObject(obj[key]);
    }
  }
  return obj;
}

const getVehicles = async () => {
  const data = await fetch(
    `https://data.bus-data.dft.gov.uk/api/v1/datafeed/11393/?api_key=${process.env.GOV_UK_API_KEY}&lineRef=U1&operatorRef=FHAM`
  );
  const text = await data.text();
  const object = await parseStringPromise(text);
  const u1 =
    object.Siri.ServiceDelivery[0].VehicleMonitoringDelivery[0].VehicleActivity.filter(
      (item: any) =>
        item.MonitoredVehicleJourney?.[0]?.LineRef?.[0]?.toLowerCase() === 'u1'
    );
  const simplifiedData = simplifyObject(u1);
  return simplifiedData;
};

export default { getVehicles };
