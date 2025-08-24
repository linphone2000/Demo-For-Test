export interface Property {
  id: string;
  name: string;
  segment: string;
  currentValueMMK: number;
  description: string;
  location: string;
  yearBuilt: number;
  totalUnits: number;
  occupancyRate: number;
  // CIS Property Investment Fields
  totalShares: number; // Total shares available for this property
  availableShares: number; // Shares available for purchase
  sharePriceMMK: number; // Price per share
  cisOwnershipPct: number; // Percentage owned by CIS company
}

export interface Holding {
  propertyId: string;
  userSharePct: number;
  userValueMMK: number;
  pnlAbs: number;
  pnlPct: number;
  purchaseDate: string;
  purchaseValueMMK: number;
  // CIS Property Investment Fields
  sharesOwned: number; // Number of shares owned in this property
  currentSharePriceMMK: number; // Current price per share
  averagePurchasePriceMMK: number; // Average price paid per share
}

export interface Snapshot {
  companyValueMMK: number;
  companyShares: number;
  weightedSharePct: number;
  propertiesCount: number;
}

export interface Activity {
  id: string;
  type: "buy" | "sell" | "injection";
  propertyId: string;
  amountMMK: number;
  ts: number;
  description: string;
}

export interface Portfolio {
  userId: string;
  cashMMK: number;
  totalValueMMK: number;
  netPnlAbs: number;
  netPnlPct: number;
  holdings: Holding[];
  snapshot: Snapshot;
  activities: Activity[];
  lastUpdated: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  lastLogin: string;
}
