export interface Route {
  id: string;
  routeNumber: number;
  stops: { stop: string; time: string }[];
}
