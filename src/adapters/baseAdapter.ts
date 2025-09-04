export interface SupplierConfig {
  url: string;
  enabled: boolean;
}

export abstract class BaseAdapter {
  protected config: SupplierConfig;

  constructor(config: SupplierConfig) {
    this.config = config;
  }

  abstract fetchHotels(): Promise<any[]>;
}
