import { SUPPLIERS } from "../config/suppliers";
import { cache } from "../infrastructure/cache";
import logger from "../infrastructure/logger";
import { mergeHotels } from "../services/hotelMergeService";
import { AcmeAdapter } from "../adapters/acmeAdapter";
import { PatagoniaAdapter } from "../adapters/patagoniaAdapter";
import { PaperfliesAdapter } from "../adapters/paperfliesAdapter";
import fetchAndCacheHotels from "./ingestHotels";

jest.mock("../adapters/acmeAdapter");
jest.mock("../adapters/patagoniaAdapter");
jest.mock("../adapters/paperfliesAdapter");
jest.mock("../services/hotelMergeService");
jest.mock("../infrastructure/cache");
jest.mock("../infrastructure/logger");

describe("cron job fetchAndCacheHotels", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches hotels from enabled suppliers and caches merged results", async () => {
    (AcmeAdapter as jest.Mock).mockImplementation(() => ({
      fetchHotels: jest.fn().mockResolvedValue([{ id: "acme1" }]),
    }));
    (PatagoniaAdapter as jest.Mock).mockImplementation(() => ({
      fetchHotels: jest.fn().mockResolvedValue([{ id: "pat1" }]),
    }));
    (PaperfliesAdapter as jest.Mock).mockImplementation(() => ({
      fetchHotels: jest.fn().mockResolvedValue([{ id: "paper1" }]),
    }));

    (mergeHotels as jest.Mock).mockReturnValue([
      { id: "merged1" },
      { id: "merged2" },
    ]);

    const cacheSetSpy = jest.spyOn(cache, "set").mockResolvedValue();

    await fetchAndCacheHotels();

    expect(mergeHotels).toHaveBeenCalledWith([
      { supplier: "acme", hotels: [{ id: "acme1" }] },
      { supplier: "patagonia", hotels: [{ id: "pat1" }] },
      { supplier: "paperflies", hotels: [{ id: "paper1" }] },
    ]);
    expect(cacheSetSpy).toHaveBeenCalledWith("mergedHotels", [
      { id: "merged1" },
      { id: "merged2" },
    ]);
    expect(logger.info).toHaveBeenCalledWith(
      "Hotel data cached. Total: 2"
    );
  });

  it("logs an error if fetching fails", async () => {
    (AcmeAdapter as jest.Mock).mockImplementation(() => ({
      fetchHotels: jest.fn().mockRejectedValue(new Error("fail")),
    }));
    (mergeHotels as jest.Mock).mockReturnValue([]);

    await fetchAndCacheHotels();

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to fetch hotels")
    );
  });
});
