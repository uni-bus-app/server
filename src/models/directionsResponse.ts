import {Route as BusRoute} from './route';
import { Time } from './time';

export interface DirectionsResponse {
    totalTime: string;
    routes: Route[];
    busRoute: BusRoute;
    departureTime: string;
    departureTimeValue: string;
    arrivalTimeValue: string;
    arrivalTime: string;
    overallPathBounds: any;
}

interface Route {
    time: string;
    distance: string;
    path: LatLng[];
    transitMode: string;
    busRoute: BusRouteSegment;
}

interface BusRouteSegment {

}

interface LatLng {
    latitude: number;
    longitude: number;
}
