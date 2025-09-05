import { normalizeAmenity } from "./normalizer";

describe("normalizeAmenity", () => {
  it("should convert string to lowercase", () => {
    expect(normalizeAmenity("WiFi")).toBe("wifi");
    expect(normalizeAmenity("AirCon")).toBe("aircon");
  });

  it("should remove spaces but preserve hyphens and underscores", () => {
    expect(normalizeAmenity("Swimming Pool")).toBe("swimming pool");
    expect(normalizeAmenity("air-conditioning")).toBe("air-conditioning");
    expect(normalizeAmenity("room_service")).toBe("room_service");
  });

  it("should handle strings with multiple spaces and special characters", () => {
    expect(normalizeAmenity("  Air  Conditioner  ")).toBe("air conditioner");
  });
});
