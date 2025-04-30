export interface VenueLocation { latitude: string; longitude: string; }
export interface Venue { name: string; city: { name: string; }; location: VenueLocation; }
export interface EventImage { url: string; ratio?: string; width?: number; height?: number; }

export interface Event {
  id: string; name: string;
  dates: { start: { localDate: string; localTime?: string; }; };
  url: string; _embedded?: { venues?: Venue[]; }; images?: EventImage[];
}