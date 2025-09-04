import { BaseAdapter, SupplierConfig } from "./baseAdapter";
import axios from "axios";

export class PaperfliesAdapter extends BaseAdapter {
  constructor(config: SupplierConfig) {
    super(config);
  }

  async fetchHotels() {
    const { data } = await axios.get(this.config.url, { timeout: 5000 });

    return data
      .filter((h: any) => h.hotel_name?.trim() && h.location?.address?.trim())
      .map((h: any) => ({
        id: h.hotel_id,
        destinationId: h.destination_id,
        name: h.hotel_name?.trim(),
        location: {
          address: h.location?.address?.trim() || "",
          country: h.location?.country || "",
        },
        description: h.details?.trim() || "",
        amenities: {
          general: h.amenities?.general || [],
          room: h.amenities?.room || [],
        },
        images: {
          rooms: (h.images?.rooms || []).map((img: any) => ({
            link: img.link,
            description: img.caption,
          })),
          site: (h.images?.site || []).map((img: any) => ({
            link: img.link,
            description: img.caption,
          })),
          amenities: (h.images?.amenities || []).map((img: any) => ({
            link: img.link,
            description: img.caption,
          })),
        },
        booking_conditions: h.booking_conditions || [],
      }));
  }
}
