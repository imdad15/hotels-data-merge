import logger from "../infrastructure/logger";
import { BaseAdapter, SupplierConfig } from "./baseAdapter";
import axios from "axios";
import { Hotel } from "../types/hotel";

export class AcmeAdapter extends BaseAdapter {
  constructor(config: SupplierConfig) {
    super(config);
  }

  async fetchHotels(): Promise<Hotel[]> {
    const response = await axios.get<Array<Record<string, any>>>(
      this.config.url,
      {
        timeout: 5000,
      },
    );

    if (!response?.data || !Array.isArray(response.data)) {
      logger.warn("Invalid response format from ACME API");
      return [];
    }

    const hotels: Hotel[] = [];

    for (const item of response.data) {
      if (!item?.Name?.trim() || !item?.Address?.trim()) {
        continue;
      }

      const hotel: Hotel = {
        id: String(item.Id || ""),
        destinationId: Number(item.DestinationId) || 0,
        name: String(item.Name).trim(),
        location: {
          address: String(item.Address).trim(),
          city: item.City ? String(item.City) : "",
          country: item.Country ? String(item.Country) : "",
          lat: item.Latitude ? String(item.Latitude) : "",
          lng: item.Longitude ? String(item.Longitude) : "",
        },
        description: item.Description ? String(item.Description) : "",
        amenities: {
          general: Array.isArray(item.Facilities)
            ? [...new Set(item.Facilities.map((f) => String(f)))]
            : [],
        },
      };

      hotels.push(hotel);
    }

    return hotels;
  }
}
