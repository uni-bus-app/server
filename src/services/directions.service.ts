import {
  Client,
  TravelMode,
  UnitSystem,
} from '@googlemaps/google-maps-services-js';
import db from '../db';

const client = new Client({});

const getClosestStop = async (position: any) => {
  const stops = await db.getStops();
  try {
    const res = await client.distancematrix({
      params: {
        origins: [position],
        destinations: stops.map((item) => ({
          lat: item.location._latitude,
          lng: item.location._longitude,
        })),
        key: 'AIzaSyDkT81ky0Yn3JYuk6bFCsq4PVmjXawppFI',
        units: UnitSystem.imperial,
        mode: TravelMode.walking,
      },
    });
    // console.log(res.data, res.data.rows[0].elements);
    // console.log(
    //   res.data.rows[0].elements.reduce((prev: any, curr: any) =>
    //     prev.duration.value < curr.duration.value ? prev : curr
    //   )
    // );
    const closest = res.data.rows[0].elements.reduce((prev: any, curr: any) =>
      prev.duration.value < curr.duration.value ? prev : curr
    );
    const closestStop = stops[res.data.rows[0].elements.indexOf(closest)];
    console.log(closestStop);
    // console.log(
    //   res.data.rows[0].elements.findIndex(
    //     (x) =>
    //       x.location._latitude ===
    //       Number(res.data.destination_addresses[0].split(',')[0])
    //   )
    // );
    return { stop: closestStop, distance: closest };
  } catch (error) {
    console.log(error);
  }
};

export default { getClosestStop };
