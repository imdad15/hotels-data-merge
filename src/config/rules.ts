export const rulesConfig = {
  amenities: {
    validGeneral: [
      "outdoor pool",
      "indoor pool",
      "business center",
      "childcare",
      "wifi",
      "dry cleaning",
      "breakfast",
      "parking",
      "bar",
      "concierge",
    ],
    validRoom: [
      "aircon",
      "tv",
      "coffee machine",
      "kettle",
      "hair dryer",
      "iron",
      "bathtub",
      "minibar",
      "tub",
    ],
  },
  name: {
    normalize: true,
    preference: ["acme", "patagonia", "paperflies"],
  },
  description: {
    preference: ["paperflies", "acme", "patagonia"],
  },
  booking_conditions: {
    pick: "paperflies",
  },
};
