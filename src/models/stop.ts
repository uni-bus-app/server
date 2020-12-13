export interface Stop {
  id: string;
  routeOrder: number;
  name: string;
  location: { lat: number; lng: number };
}
