export interface SupplierConfig {
  url: string;
  enabled: boolean;
}

export const SUPPLIERS: Record<string, SupplierConfig> = {
  acme: {
    url:
      process.env.ACME_SUPPLIER_URL ||
      "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme",
    enabled: true,
  },
  patagonia: {
    url:
      process.env.PATAGONIA_SUPPLIER_URL ||
      "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia",
    enabled: true,
  },
  paperflies: {
    url:
      process.env.PAPERFLIES_SUPPLIER_URL ||
      "https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies",
    enabled: true,
  },
} as const;

export type SupplierName = keyof typeof SUPPLIERS;
