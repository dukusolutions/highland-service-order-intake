export type LeakLocationName = "Front" | "Middle" | "Back";

export type LeakNearTypeName =
  | "HVACDuct"
  | "Skylight"
  | "Wall"
  | "Drain"
  | "Other";

export type RoofPitchTypeName = "FlatRoof" | "SteepShingleTile";

export type LeakingProperty = {
  siteName: string;
  siteAddress: string;
  siteAddress2: string;
  siteCity: string;
  siteZip: string;
  tenantBusinessName: string;
  tenantContactName: string;
  tenantContactPhone: string;
  tenantContactCell: string;
  tenantContactEmail: string;
  hoursOfOperation: string;
  leakLocation: LeakLocationName;
  leakNear: LeakNearTypeName;
  leakNearOther: string;
  hasAccessCode: boolean;
  accessCode: string;
  isSaturdayAccessPermitted: boolean;
  isKeyRequired: boolean;
  isLadderRequired: boolean;
  roofPitch: RoofPitchTypeName;
  comments: string;
};

export type IntakeFormData = {
  leakingProperties: LeakingProperty[];
  clientAccountName: string;
  clientAccountContactName: string;
  clientEmail: string;
  clientPhone: string;
  billingEntityBillToName: string;
  billingBillToAddress: string;
  billingBillToAddress2: string;
  billingBillToCity: string;
  billingBillToZip: string;
  billingBillToEmail: string;
};

export type ValidationErrors = Partial<
  Record<keyof IntakeFormData | keyof LeakingProperty, string>
>;

export type PrefillLookupRequest = {
  companyName: string;
  email: string;
};

export type PrefillLookupData = Partial<
  Omit<IntakeFormData, "leakingProperties">
> & {
  leakingProperties?: Partial<LeakingProperty>[];
};

export type PrefillLookupResponse = {
  found: boolean;
  data?: PrefillLookupData;
  message?: string;
};

export type ClientInfoPayload = {
  AccountName: string;
  AccountContactName: string;
  Email: string;
  Phone: string;
};

export type BillingInfoPayload = {
  EntityBillToName: string;
  BillToAddress: string;
  BillToAddress2: string;
  BillToCity: string;
  BillToZip: string;
  BillToEmail: string;
};

export type LeakDetailsPayload = {
  SiteName: string;
  SiteAddress: string;
  SiteAddress2: string;
  SiteCity: string;
  SiteZip: string;
  TenantBusinessName: string;
  TenantContactName: string;
  TenantContactPhone: string;
  TenantContactCell: string;
  TenantContactEmail: string;
  HoursOfOperation: string;
  LeakLocation: LeakLocationName;
  LeakNear: LeakNearTypeName;
  LeakNearOther: string;
  HasAccessCode: boolean;
  AccessCode: string;
  IsSaturdayAccessPermitted: boolean;
  IsKeyRequired: boolean;
  IsLadderRequired: boolean;
  RoofPitch: RoofPitchTypeName;
  Comments: string;
};

export type ServiceOrderRequestPayload = {
  requestDate: string;
  client: ClientInfoPayload;
  billing: BillingInfoPayload;
  leakDetails: LeakDetailsPayload;
  additionalLeaks: LeakDetailsPayload[];
};

export type ServiceOrderLookupItem = {
  Id: number;
  RequestDate: string;
  Client: ClientInfoPayload;
  Billing: BillingInfoPayload;
  LeakDetails: LeakDetailsPayload;
  AdditionalLeaks: LeakDetailsPayload[];
};

export type ServiceOrderLookupResponse = {
  clients: ClientInfoPayload[];
  billings: BillingInfoPayload[];
  leaks: LeakDetailsPayload[];
  serviceOrders: ServiceOrderLookupItem[];
  message?: string;
};
