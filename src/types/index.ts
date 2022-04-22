export interface Stop {
  id: string;
  routeOrder: number;
  name: string;
  location: { _latitude: number; _longitude: number };
}

export interface Time {
  routeNumber: number;
  scheduled: string;
  scheduledDeparture?: string;
}

export interface Route {
  id: string;
  routeNumber: number;
  stops: { stop: string; time: string }[];
}

export interface Times {
  id: string;
  stopID: string;
  times: Time[];
}

export interface Message {
  id: string;
  body: string;
  persistent: boolean;
  icon?: string;
  link?: string;
}

export interface DirectionsResponse {
  totalTime: string;
  routes: Route[];
  busRoute: Route;
  departureTime: string;
  departureTimeValue: string;
  arrivalTimeValue: string;
  arrivalTime: string;
  overallPathBounds: any;
}

// interface Route {
//   time: string;
//   distance: string;
//   path: LatLng[];
//   transitMode: string;
//   busRoute: BusRouteSegment;
// }

interface BusRouteSegment {}

interface LatLng {
  latitude: number;
  longitude: number;
}

export interface VersionInfo {
  routesVersion?: { key: string; value: string };
  stopsVersion?: { key: string; value: string };
  timesVersion?: { key: string; value: string };
}
