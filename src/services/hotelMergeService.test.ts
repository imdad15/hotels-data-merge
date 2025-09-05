import {
  mergeHotels,
  selectBySupplierPriority,
  filterAmenities,
  applyRules,
} from "./hotelMergeService";
import { Hotel } from "../types/hotel";

const mockHotel1: Hotel = {
  id: "1",
  destinationId: 1,
  name: "Hotel A",
  description: "Description A",
  location: { address: "123 Street" },
  amenities: {
    general: ["Business Center", "wifi"],
    room: ["tv", "aircon"],
  },
  images: {
    rooms: [{ link: "room1.jpg", description: "Room 1" }],
    site: [{ link: "site1.jpg", description: "Site 1" }],
  },
  bookingConditions: ["condition1", "condition2"],
};

const mockHotel2: Hotel = {
  id: "1",
  destinationId: 1,
  name: "Hotel B",
  description: "Description B",
  location: { address: "456 Avenue" },
  amenities: {
    general: ["wifi", "gym"],
    room: ["minibar"],
  },
  images: {
    rooms: [{ link: "room2.jpg", description: "Room 2" }],
    amenities: [{ link: "amenity1.jpg", description: "Amenity 1" }],
  },
  bookingConditions: ["condition3"],
};

describe("hotelMergeService", () => {
  describe("selectBySupplierPriority", () => {
    const priorityList = ["supplier1", "supplier2", "supplier3"];

    it("should return incoming value when no existing value", () => {
      const result = selectBySupplierPriority(
        undefined,
        "New Value",
        "supplier1",
        "supplier2",
        priorityList,
      );
      expect(result).toBe("New Value");
    });

    it("should return existing value when no incoming value", () => {
      const result = selectBySupplierPriority(
        "Existing Value",
        undefined,
        "supplier1",
        "supplier2",
        priorityList,
      );
      expect(result).toBe("Existing Value");
    });

    it("should prefer value from higher priority supplier", () => {
      // supplier1 has higher priority than supplier2 in the list
      const result = selectBySupplierPriority(
        "Supplier2 Value",
        "Supplier1 Value",
        "supplier2",
        "supplier1",
        priorityList,
      );
      expect(result).toBe("Supplier1 Value");
    });
  });

  describe("filterAmenities", () => {
    const validAmenities = ["pool", "wifi", "gym"];

    it("should filter out invalid amenities", () => {
      const amenities = ["pool", "invalid", "wifi", "gym", "invalid2"];
      const result = filterAmenities(amenities, validAmenities);
      expect(result).toEqual(["pool", "wifi", "gym"]);
    });

    it("should handle undefined input", () => {
      const result = filterAmenities(undefined, validAmenities);
      expect(result).toEqual([]);
    });
  });

  describe("mergeTwoHotels", () => {
    it("should merge amenities from both hotels", () => {
      const merged = mergeHotels([
        { supplier: "supplier1", hotels: [mockHotel1] },
        { supplier: "supplier2", hotels: [mockHotel2] },
      ]);

      const result = merged[0];
      expect(result.amenities?.general).toEqual([
        "business center",
        "wifi",
        "gym",
      ]);
      expect(result.amenities?.room).toEqual(["tv", "aircon", "minibar"]);
    });
  });

  describe("mergeHotels", () => {
    it("should merge hotels from different suppliers", () => {
      const supplier1 = {
        supplier: "supplier1",
        hotels: [mockHotel1],
      };

      const supplier2 = {
        supplier: "supplier2",
        hotels: [mockHotel2],
      };

      const result = mergeHotels([supplier1, supplier2]);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(mockHotel1.name); // Should prefer supplier1's name
      expect(result[0].amenities?.general).toEqual([
        "business center",
        "wifi",
        "gym",
      ]);
      expect(result[0].amenities?.room).toEqual(["tv", "aircon", "minibar"]);
      expect(result[0].images?.rooms).toHaveLength(2);
      expect(result[0].bookingConditions).toEqual(mockHotel1.bookingConditions);
    });

    it("should handle empty hotel lists", () => {
      const supplier1 = {
        supplier: "supplier1",
        hotels: [],
      };

      const result = mergeHotels([supplier1]);
      expect(result).toEqual([]);
    });
  });

  describe("applyRules", () => {
    it("should trim hotel name when normalization is enabled", () => {
      const hotelWithExtraSpaces = {
        ...mockHotel1,
        name: "  Hotel With Spaces  ",
      };

      // Mock the rules config
      const originalRules = require("../config/rules").rulesConfig;
      require("../config/rules").rulesConfig = {
        ...originalRules,
        name: { normalize: true },
      };

      const result = applyRules(hotelWithExtraSpaces);

      expect(result.name).toBe("Hotel With Spaces");

      // Restore original rules
      require("../config/rules").rulesConfig = originalRules;
    });
  });
});
