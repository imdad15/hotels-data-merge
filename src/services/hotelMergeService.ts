import { Hotel } from '../types/hotel';
import { rulesConfig } from '../config/rules';
import { normalizeAmenity } from '../utils/normalizer';

interface SupplierHotel {
  hotel: Hotel;
  supplier: string;
}

export function mergeHotels(allHotels: { supplier: string; hotels: Hotel[] }[]): Hotel[] {
  const hotelMap = new Map<string, SupplierHotel>();

  const flatHotels: SupplierHotel[] = allHotels.flatMap((h) =>
    h.hotels.map((hotel) => ({ hotel, supplier: h.supplier }))
  );

  flatHotels.forEach(({ hotel, supplier }) => {
    const existingEntry = hotelMap.get(hotel.id);

    if (!existingEntry) {
      hotelMap.set(hotel.id, { hotel: applyRules(hotel), supplier });
    } else {
      const mergedHotel = mergeTwoHotels(existingEntry.hotel, hotel, existingEntry.supplier, supplier);
      hotelMap.set(hotel.id, { hotel: mergedHotel, supplier: existingEntry.supplier });
    }
  });

  return Array.from(hotelMap.values()).map((entry) => entry.hotel);
}

export function applyRules(hotel: Hotel): Hotel {
  const copy: Hotel = { ...hotel, amenities: { ...hotel.amenities }, images: { ...hotel.images } };

  if (!copy.amenities) {
    copy.amenities = {
      general: [],
      room: []
    };
  }

  copy.amenities.general = filterAmenities(copy.amenities?.general || [], rulesConfig.amenities.validGeneral);
  copy.amenities.room = filterAmenities(copy.amenities?.room || [], rulesConfig.amenities.validRoom);

  if (rulesConfig.name.normalize && copy.name) {
    copy.name = copy.name.trim();
  }

  return copy;
}

function mergeTwoHotels(existing: Hotel, incoming: Hotel, existingSupplier: string, incomingSupplier: string): Hotel {
  const merged: Hotel = { ...existing };

  merged.name = selectBySupplierPriority(existing.name, incoming.name, existingSupplier, incomingSupplier, rulesConfig.name.preference);

  merged.description = selectBySupplierPriority(
    existing.description,
    incoming.description,
    existingSupplier,
    incomingSupplier,
    rulesConfig.description.preference
  );

  if (!merged.amenities) {
    merged.amenities = {
      general: [],
      room: []
    };
  }

  merged.amenities.general = Array.from(new Set([...existing.amenities?.general || [], ...incoming.amenities?.general || []]));
  merged.amenities.room = Array.from(new Set([...existing.amenities?.room || [], ...incoming.amenities?.room || []]));

  if (!merged.images) {
    merged.images = {
      rooms: [],
      site: [],
      amenities: []
    };
  }

  merged.images.rooms = [...existing.images?.rooms || [], ...incoming.images?.rooms || []];
  merged.images.site = [...existing.images?.site || [], ...incoming.images?.site || []];
  merged.images.amenities = [...existing.images?.amenities || [], ...incoming.images?.amenities || []];

  if (rulesConfig.booking_conditions.pick === incomingSupplier) {
    merged.bookingConditions = incoming.bookingConditions;
  }

  return merged;
}

export function selectBySupplierPriority(
  existingValue: string | undefined,
  incomingValue: string | undefined,
  existingSupplier: string,
  incomingSupplier: string,
  priorityList: string[]
): string {
  if (!existingValue && incomingValue) return incomingValue?.trim() || '';
  if (!existingValue) return '';

  const existingIndex = priorityList.indexOf(existingSupplier);
  const incomingIndex = priorityList.indexOf(incomingSupplier);

  if (incomingValue && incomingIndex < existingIndex) return incomingValue?.trim() || '';
  return existingValue?.trim() || '';
}

export function filterAmenities(amenities: string[] | undefined, validList: string[]): string[] {
  const normalizedValid = validList.map(normalizeAmenity);
  const originalByNormalized = Object.fromEntries(validList.map((v) => [normalizeAmenity(v), v]));

  return Array.from(
    new Set(
      amenities?.map((a) => normalizeAmenity(a))
        .filter((a) => normalizedValid.includes(a))
        .map((a) => originalByNormalized[a])
    )
  );
}
