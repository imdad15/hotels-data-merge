import { SUPPLIERS } from "../config/suppliers";
import { BaseAdapter } from "../adapters/baseAdapter";
import { AcmeAdapter } from "../adapters/acmeAdapter";
import { PatagoniaAdapter } from "../adapters/patagoniaAdapter";
import { PaperfliesAdapter } from "../adapters/paperfliesAdapter";

export function createSuppliers(): BaseAdapter[] {
  const suppliers: BaseAdapter[] = [];

  Object.entries(SUPPLIERS).forEach(([key, cfg]) => {
    if (!cfg.enabled) return;

    switch (key) {
      case "acme":
        suppliers.push(new AcmeAdapter(cfg));
        break;
      case "patagonia":
        suppliers.push(new PatagoniaAdapter(cfg));
        break;
      case "paperflies":
        suppliers.push(new PaperfliesAdapter(cfg));
        break;
    }
  });

  return suppliers;
}
