export type PreferredContactMethod = "Phone" | "Email" | "Text";

export type LeakingProperty = {
  propertyNameId: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  serviceDescription: string;
};

export type IntakeFormData = {
  leakingProperties: LeakingProperty[];
  contactName: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  preferredContactMethod: PreferredContactMethod;
  billingContactName: string;
  billingPhone: string;
  billingEmail: string;
  billingAddress: string;
  additionalNotes: string;
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
