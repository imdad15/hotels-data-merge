export interface Amenities {
  general?: string[];
  room?: string[];
}

export interface Image {
  link: string;
  description: string;
}

export interface HotelImages {
  rooms?: Image[];
  site?: Image[];
  amenities?: Image[];
}

export interface Location {
  address: string;
  city?: string;
  country?: string;
  lat?: string;
  lng?: string;
}

export interface Hotel {
  id: string;
  destinationId: number;
  name: string;
  location: Location;
  description?: string;
  amenities?: Amenities;
  images?: HotelImages;
  bookingConditions?: string[];
}
