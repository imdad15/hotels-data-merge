export interface Amenities {
  general: string[];
  room: string[];
}

export interface Image {
  link: string;
  description: string;
}

export interface HotelImages {
  rooms: Image[];
  site: Image[];
  amenities: Image[];
}

export interface Location {
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export interface BookingConditions {
  conditions: string[];
}

export interface Hotel {
  id: string;
  destination_id: number;
  name: string;
  location: Location;
  description: string;
  amenities: Amenities;
  images: HotelImages;
  booking_conditions: BookingConditions;
}
