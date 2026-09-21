import { createContext, useContext } from "react";
import type { LicensePayload } from "@atelier/core";

export const PRODUCT_ID = "proposal-generator";
export const PRODUCT_NAME = "Proposal Generator";

export interface LicenseCtx {
  license: LicensePayload | null;
  deactivate: () => void;
}

export const LicenseContext = createContext<LicenseCtx>({
  license: null,
  deactivate: () => {},
});

export const useLicense = () => useContext(LicenseContext);
