import axios from "axios";
import { PaperfliesAdapter } from "./paperfliesAdapter";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PaperfliesAdapter", () => {
  let adapter: PaperfliesAdapter;
  const mockConfig = {
    url: "https://example.com/api/paperflies",
    enabled: true,
  };

  beforeEach(() => {
    adapter = new PaperfliesAdapter(mockConfig);
    jest.clearAllMocks();
  });

  describe("fetchHotels", () => {
    it("should fetch and transform hotel data correctly", async () => {
      const mockApiResponse = {
        data: [
          {
            hotel_id: "iJhz",
            destination_id: 5432,
            hotel_name: "Beach Villas Singapore",
            location: {
              address: "8 Sentosa Gateway, Beach Villas",
              country: "Singapore",
            },
            details: "Luxury beachfront villas with private pools.",
            amenities: {
              general: ["Pool", "Wifi", "Aircon"],
              room: ["TV", "Minibar"],
            },
            images: {
              rooms: [
                {
                  link: "https://example.com/room1.jpg",
                  caption: "Deluxe Room",
                },
                { link: "https://example.com/room2.jpg", caption: "Suite" },
              ],
              site: [
                {
                  link: "https://example.com/site1.jpg",
                  caption: "Hotel View",
                },
              ],
              amenities: [],
            },
            booking_conditions: [
              "Cancellation policy may vary depending on the rate and dates.",
              "No pets allowed.",
            ],
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

      const result = await adapter.fetchHotels();

      expect(result).toEqual([
        {
          id: "iJhz",
          destinationId: 5432,
          name: "Beach Villas Singapore",
          location: {
            address: "8 Sentosa Gateway, Beach Villas",
            country: "Singapore",
          },
          description: "Luxury beachfront villas with private pools.",
          amenities: {
            general: ["Pool", "Wifi", "Aircon"],
            room: ["TV", "Minibar"],
          },
          images: {
            rooms: [
              {
                link: "https://example.com/room1.jpg",
                description: "Deluxe Room",
              },
              { link: "https://example.com/room2.jpg", description: "Suite" },
            ],
            site: [
              {
                link: "https://example.com/site1.jpg",
                description: "Hotel View",
              },
            ],
            amenities: [],
          },
          booking_conditions: [
            "Cancellation policy may vary depending on the rate and dates.",
            "No pets allowed.",
          ],
        },
      ]);
    });

    it("should handle missing optional fields", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [
          {
            hotel_id: "test123",
            destination_id: 123,
            hotel_name: "Test Hotel",
            location: {
              address: "123 Test St",
              country: "US",
            },
            // Missing other fields
          },
        ],
      });

      const result = await adapter.fetchHotels();
      expect(result[0]).toMatchObject({
        id: "test123",
        destinationId: 123,
        name: "Test Hotel",
        location: {
          address: "123 Test St",
          country: "US",
        },
        description: "",
        amenities: {
          general: [],
          room: [],
        },
        images: {
          rooms: [],
          site: [],
          amenities: [],
        },
        booking_conditions: [],
      });
    });
  });
});
