import { BaseAdapter, SupplierConfig } from "./baseAdapter";
import axios from "axios";

export class AcmeAdapter extends BaseAdapter {
  constructor(config: SupplierConfig) {
    super(config);
  }

  async fetchHotels() {
    const { data } = await axios.get(this.config.url, { timeout: 5000 });

    return data
      .filter((h: any) => h.Name?.trim() && h.Address?.trim())
      .map((h: any) => ({
        id: h.Id,
        destinationId: h.DestinationId,
        name: h.Name.trim(),
        location: {
          address: h.Address.trim(),
          city: h.City || "",
          country: h.Country || "",
          lat: h.Latitude || null,
          lng: h.Longitude || null,
        },
        description: h.Description?.trim() || "",
        amenities: {
          general: Array.from(new Set(h.Facilities || [])),
        },
        images: {
          rooms: [],
          amenities: [],
        },
      }));
  }
}
