import axios from "axios";
import { AcmeAdapter } from "./acmeAdapter";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AcmeAdapter", () => {
  let adapter: AcmeAdapter;
  const mockConfig = {
    url: "https://example.com/api/acme",
    enabled: true,
  };

  beforeEach(() => {
    adapter = new AcmeAdapter(mockConfig);
    jest.clearAllMocks();
  });

  it("should fetch and transform hotel data correctly", async () => {
    const mockApiResponse = {
      data: [
        {
          Id: "iJhz",
          DestinationId: 5432,
          Name: "Beach Villas Singapore",
          Address: "8 Sentosa Gateway, Beach Villas",
          City: "Singapore",
          Country: "SG",
          Latitude: 1.264751,
          Longitude: 103.824898,
          Description:
            "This 5 star hotel is located on the coastline of Singapore.",
          Facilities: [
            "Pool",
            "Wifi",
            "Aircon",
            "TV",
            "Coffee machine",
            "Kettle",
            "Hair dryer",
          ],
        },
        // Should be filtered out - missing name
        {
          Id: "noName",
          DestinationId: 123,
          Address: "123 Test St",
          Facilities: [],
        },
        // Should be filtered out - missing address
        {
          Id: "noAddress",
          DestinationId: 123,
          Name: "No Address Hotel",
          Facilities: [],
        },
        // Should be filtered out - empty name
        {
          Id: "emptyName",
          DestinationId: 123,
          Name: "   ",
          Address: "123 Test St",
          Facilities: [],
        },
        // Should be filtered out - empty address
        {
          Id: "emptyAddress",
          DestinationId: 123,
          Name: "Empty Address",
          Address: "   ",
          Facilities: [],
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
          city: "Singapore",
          country: "SG",
          lat: "1.264751",
          lng: "103.824898",
        },
        description:
          "This 5 star hotel is located on the coastline of Singapore.",
        amenities: {
          general: [
            "Pool",
            "Wifi",
            "Aircon",
            "TV",
            "Coffee machine",
            "Kettle",
            "Hair dryer",
          ],
        },
      },
    ]);

    expect(mockedAxios.get).toHaveBeenCalledWith(mockConfig.url, {
      timeout: 5000,
    });
  });

  it("should filter out hotels with empty name or address", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        // Empty name - should be filtered out
        {
          Id: "emptyName",
          DestinationId: 123,
          Name: "   ",
          Address: "123 Test St",
          Facilities: ["Wifi"],
        },
        // Empty address - should be filtered out
        {
          Id: "emptyAddress",
          DestinationId: 123,
          Name: "Empty Address Hotel",
          Address: "   ",
          Facilities: ["Pool"],
        },
        // Valid hotel with empty facilities
        {
          Id: "valid1",
          DestinationId: 123,
          Name: "Valid Hotel",
          Address: "123 Test St",
          Facilities: [],
        },
      ],
    });

    const result = await adapter.fetchHotels();

    // Should only include the valid hotel
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("valid1");
    expect(result[0].amenities?.general).toEqual([]);
  });

  it("should handle missing optional fields", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          Id: "test123",
          DestinationId: 123,
          Name: "Test Hotel",
          Address: "123 Test St",
          // Missing optional fields
        },
      ],
    });

    const result = await adapter.fetchHotels();

    expect(result).toEqual([
      {
        id: "test123",
        destinationId: 123,
        name: "Test Hotel",
        location: {
          address: "123 Test St",
          city: "",
          country: "",
          lat: "",
          lng: "",
        },
        description: "",
        amenities: {
          general: [],
        },
      },
    ]);
  });
});
