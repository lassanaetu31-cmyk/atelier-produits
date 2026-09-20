import { createContext, useContext } from "react";
import type { LicensePayload } from "@atelier/core";

export const PRODUCT_ID = "catalog-builder";
export const PRODUCT_NAME = "Catalog Builder";

export interface LicenseCtx {
  license: LicensePayload | null;
  deactivate: () => void;
}

export const LicenseContext = createContext<LicenseCtx>({
  license: null,
  deactivate: () => {},
});

export const useLicense = () => useContext(LicenseContext);
