import axios from "axios";
import { PatagoniaAdapter } from "./patagoniaAdapter";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PatagoniaAdapter", () => {
  let adapter: PatagoniaAdapter;
  const mockConfig = {
    url: "https://example.com/api/patagonia",
    enabled: true,
  };

  beforeEach(() => {
    adapter = new PatagoniaAdapter(mockConfig);
    jest.clearAllMocks();
  });

  it("should fetch and transform hotel data correctly", async () => {
    const mockApiResponse = {
      data: [
        {
          id: "iJhz",
          destination: 5432,
          name: "Beach Villas Singapore",
          address: "8 Sentosa Gateway, Beach Villas",
          lat: 1.264751,
          lng: 103.824898,
          info: "Luxury beachfront villas with private pools.",
          amenities: ["Pool", "Wifi", "Aircon", "TV", "Coffee machine"],
          images: {
            rooms: [
              {
                url: "https://example.com/room1.jpg",
                description: "Deluxe Room",
              },
              { url: "https://example.com/room2.jpg", description: "Suite" },
            ],
            amenities: [
              {
                url: "https://example.com/pool.jpg",
                description: "Swimming Pool",
              },
            ],
          },
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
          lat: "1.264751",
          lng: "103.824898",
        },
        description: "Luxury beachfront villas with private pools.",
        amenities: {
          general: ["Pool", "Wifi", "Aircon", "TV", "Coffee machine"],
        },
        images: {
          rooms: [
            {
              link: "https://example.com/room1.jpg",
              description: "Deluxe Room",
            },
            { link: "https://example.com/room2.jpg", description: "Suite" },
          ],
          amenities: [
            {
              link: "https://example.com/pool.jpg",
              description: "Swimming Pool",
            },
          ],
        },
      },
    ]);
  });

  it("should filter out hotels missing required fields", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        // Valid hotel with all required fields
        {
          id: "valid1",
          destination: 123,
          name: "Valid Hotel",
          address: "123 Test St",
          info: "Test description",
        },
        // Invalid - missing name
        {
          id: "invalid1",
          destination: 123,
          address: "123 Test St",
        },
        // Invalid - missing address
        {
          id: "invalid2",
          destination: 123,
          name: "No Location Hotel",
        },
        // Invalid - empty name
        {
          id: "invalid3",
          destination: 123,
          name: "",
          address: "123 Test St",
        },
        // Invalid - null name
        {
          id: "invalid4",
          destination: 123,
          name: null,
          address: "123 Test St",
        },
      ],
    });

    const result = await adapter.fetchHotels();

    // Should only include the valid hotel
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "valid1",
      destinationId: 123,
      name: "Valid Hotel",
      location: {
        address: "123 Test St",
        lat: "",
        lng: "",
      },
      description: "Test description",
      amenities: {
        general: [],
      },
      images: {
        rooms: [],
        amenities: [],
      },
    });
  });

  it("should handle null/undefined values in nested objects", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: "test123",
          destination: 123,
          name: "Test Hotel",
          address: "123 Test St",
          images: {
            rooms: [
              { url: "test.jpg", description: null },
              { url: null, description: "Test" },
            ],
          },
        },
      ],
    });

    const result = await adapter.fetchHotels();
    expect(result[0].images.rooms).toEqual([
      { link: "test.jpg", description: "" },
      { link: "", description: "Test" },
    ]);
  });

  it("should require both name and location fields", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        // Missing name
        {
          id: "hotel1",
          destination: 123,
          address: "123 Test St",
        },
        // Missing location
        {
          id: "hotel2",
          destination: 123,
          name: "Test Hotel 2",
        },
        // Empty name
        {
          id: "hotel3",
          destination: 123,
          name: "",
          address: "123 Test St",
        },
        // Null address
        {
          id: "hotel4",
          destination: 123,
          name: "Test Hotel 4",
          address: null,
        },
        // Valid hotel
        {
          id: "hotel5",
          destination: 123,
          name: "Valid Hotel",
          address: "123 Test St",
        },
      ],
    });

    const result = await adapter.fetchHotels();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("hotel5");
  });
});
