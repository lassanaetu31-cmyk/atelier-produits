import { createContext, useContext } from "react";
import type { LicensePayload } from "@atelier/core";

export const PRODUCT_ID = "proposal-generator";
export const PRODUCT_NAME = "Proposal Generator";
/** Permalink du produit sur Gumroad — à mettre à jour après création du produit. */
export const GUMROAD_PERMALINK = "proposal-generator";

export interface LicenseCtx {
  license: LicensePayload | null;
  deactivate: () => void;
}

export const LicenseContext = createContext<LicenseCtx>({
  license: null,
  deactivate: () => {},
});

export const useLicense = () => useContext(LicenseContext);
