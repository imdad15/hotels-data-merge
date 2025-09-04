import { BaseAdapter, SupplierConfig } from "./baseAdapter";
import axios from "axios";

export class PatagoniaAdapter extends BaseAdapter {
  constructor(config: SupplierConfig) {
    super(config);
  }

  async fetchHotels() {
    const { data } = await axios.get(this.config.url, { timeout: 5000 });

    return data
      .filter((h: any) => h.name && h.address)
      .map((h: any) => ({
        id: h.id,
        destinationId: h.destination,
        name: h.name.trim(),
        location: {
          address: h.address ?? "",
          lat: h.lat ? String(h.lat) : "",
          lng: h.lng ? String(h.lng) : "",
        },
        description: h.info?.trim() ?? "",
        amenities: {
          general: Array.isArray(h.amenities)
            ? Array.from(new Set(h.amenities))
            : [],
        },
        images: {
          rooms: (h.images?.rooms || []).map((room: any) => ({
            link: room.url ?? "",
            description: room.description ?? "",
          })),
          amenities: (h.images?.amenities || []).map((amenity: any) => ({
            link: amenity.url ?? "",
            description: amenity.description ?? "",
          })),
        },
      }));
  }
}
