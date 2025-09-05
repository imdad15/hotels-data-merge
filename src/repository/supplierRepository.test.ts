import { createSuppliers } from "./supplierRepository";
import { AcmeAdapter } from "../adapters/acmeAdapter";
import { PatagoniaAdapter } from "../adapters/patagoniaAdapter";
import { PaperfliesAdapter } from "../adapters/paperfliesAdapter";

jest.mock("../adapters/acmeAdapter");
jest.mock("../adapters/patagoniaAdapter");
jest.mock("../adapters/paperfliesAdapter");

const mockSuppliers = {
  acme: { url: "https://acme.test", enabled: true },
  patagonia: { url: "https://patagonia.test", enabled: true },
  paperflies: { url: "https://paperflies.test", enabled: true },
};

jest.mock("../config/suppliers", () => ({
  get SUPPLIERS() {
    return { ...mockSuppliers };
  },
}));

describe("supplierRepository", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();

    Object.assign(mockSuppliers, {
      acme: { url: "https://acme.test", enabled: true },
      patagonia: { url: "https://patagonia.test", enabled: true },
      paperflies: { url: "https://paperflies.test", enabled: true },
    });

    process.env = {
      ...originalEnv,
      ACME_SUPPLIER_URL: "https://acme.test",
      PATAGONIA_SUPPLIER_URL: "https://patagonia.test",
      PAPERFLIES_SUPPLIER_URL: "https://paperflies.test",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should create all enabled suppliers with correct configuration", () => {
    const suppliers = createSuppliers();

    expect(suppliers).toHaveLength(3);
    expect(AcmeAdapter).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://acme.test",
        enabled: true,
      }),
    );
    expect(PatagoniaAdapter).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://patagonia.test",
        enabled: true,
      }),
    );
    expect(PaperfliesAdapter).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://paperflies.test",
        enabled: true,
      }),
    );
  });

  it("should only create enabled suppliers", () => {
    mockSuppliers.patagonia.enabled = false;

    const suppliers = createSuppliers();

    expect(suppliers).toHaveLength(2);
    expect(AcmeAdapter).toHaveBeenCalled();
    expect(PatagoniaAdapter).not.toHaveBeenCalled();
    expect(PaperfliesAdapter).toHaveBeenCalled();
  });

  it("should create no suppliers if all are disabled", () => {
    Object.values(mockSuppliers).forEach((supplier) => {
      supplier.enabled = false;
    });

    const suppliers = createSuppliers();

    expect(suppliers).toHaveLength(0);
    expect(AcmeAdapter).not.toHaveBeenCalled();
    expect(PatagoniaAdapter).not.toHaveBeenCalled();
    expect(PaperfliesAdapter).not.toHaveBeenCalled();
  });

  it("should use environment variables for URLs when available", () => {
    const customUrl = "https://custom-acme-url.test";
    process.env.ACME_SUPPLIER_URL = customUrl;

    const originalSuppliers = { ...mockSuppliers };
    mockSuppliers.acme.url = process.env.ACME_SUPPLIER_URL || "";

    createSuppliers();

    expect(AcmeAdapter).toHaveBeenCalledWith(
      expect.objectContaining({
        url: customUrl,
        enabled: true,
      }),
    );

    mockSuppliers.acme.url = originalSuppliers.acme.url;
  });
});
