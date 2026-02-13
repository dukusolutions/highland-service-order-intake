import {
  IntakeFormData,
  LeakingProperty,
  ValidationErrors,
} from "@/types/emergencyLeakService";

export const EMPTY_PROPERTY: LeakingProperty = {
  siteName: "",
  siteAddress: "",
  siteAddress2: "",
  siteCity: "",
  siteZip: "",
  tenantBusinessName: "",
  tenantContactName: "",
  tenantContactPhone: "",
  tenantContactCell: "",
  tenantContactEmail: "",
  hoursOfOperation: "",
  leakLocation: "Middle",
  leakNear: "Other",
  leakNearOther: "",
  hasAccessCode: false,
  accessCode: "",
  isSaturdayAccessPermitted: false,
  isKeyRequired: false,
  isLadderRequired: false,
  roofPitch: "FlatRoof",
  comments: "",
};

export const INITIAL_FORM_DATA: IntakeFormData = {
  leakingProperties: [{ ...EMPTY_PROPERTY }],
  clientAccountName: "",
  clientAccountContactName: "",
  clientEmail: "",
  clientPhone: "",
  billingEntityBillToName: "",
  billingBillToAddress: "",
  billingBillToAddress2: "",
  billingBillToCity: "",
  billingBillToZip: "",
  billingBillToEmail: "",
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isPhone(value: string) {
  return /^[0-9+()\-\s]{10,}$/.test(value.trim());
}

export function validateEmergencyLeakServiceForm(
  data: IntakeFormData,
): ValidationErrors {
  const errors: ValidationErrors = {};
  const property = data.leakingProperties[0];

  if (!data.clientAccountName.trim()) {
    errors.clientAccountName = "Account Name is required.";
  }
  if (!data.clientAccountContactName.trim()) {
    errors.clientAccountContactName = "Account Contact Name is required.";
  }
  if (!isEmail(data.clientEmail)) {
    errors.clientEmail = "Enter a valid email address.";
  }
  if (!isPhone(data.clientPhone)) {
    errors.clientPhone = "Enter a valid phone number.";
  }
  if (!property.siteName.trim()) {
    errors.siteName = "Site Name is required.";
  }
  if (!property.siteAddress.trim()) {
    errors.siteAddress = "Site Address is required.";
  }
  if (!property.siteCity.trim()) {
    errors.siteCity = "Site City is required.";
  }
  if (!property.siteZip.trim()) {
    errors.siteZip = "Site Zip is required.";
  }
  if (data.billingBillToEmail.trim() && !isEmail(data.billingBillToEmail)) {
    errors.billingBillToEmail = "Enter a valid billing email address.";
  }

  return errors;
}
