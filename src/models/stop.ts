export interface Stop {
  id: string;
  routeOrder: number;
  name: string;
  location: { _latitude: number; _longitude: number };
}
