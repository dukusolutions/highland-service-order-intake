import {
  IntakeFormData,
  LeakingProperty,
  ValidationErrors,
} from "@/types/emergencyLeakService";

export const EMPTY_PROPERTY: LeakingProperty = {
  propertyNameId: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  propertyType: "",
  serviceDescription: "",
};

export const INITIAL_FORM_DATA: IntakeFormData = {
  leakingProperties: [{ ...EMPTY_PROPERTY }],
  contactName: "",
  companyName: "",
  phoneNumber: "",
  email: "",
  preferredContactMethod: "Phone",
  billingContactName: "",
  billingPhone: "",
  billingEmail: "",
  billingAddress: "",
  additionalNotes: "",
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

  if (!property.propertyNameId.trim()) {
    errors.propertyNameId = "Property Name/ID is required.";
  }
  if (!property.streetAddress.trim()) {
    errors.streetAddress = "Street Address is required.";
  }
  if (!property.city.trim()) {
    errors.city = "City is required.";
  }
  if (!property.state.trim()) {
    errors.state = "State is required.";
  }
  if (!property.zipCode.trim()) {
    errors.zipCode = "Zip Code is required.";
  }
  if (!property.propertyType.trim()) {
    errors.propertyType = "Property Type is required.";
  }
  if (!property.serviceDescription.trim()) {
    errors.serviceDescription = "Description of Services is required.";
  }
  if (!data.contactName.trim()) {
    errors.contactName = "Your Name is required.";
  }
  if (!data.companyName.trim()) {
    errors.companyName = "Company Name is required.";
  }
  if (!isPhone(data.phoneNumber)) {
    errors.phoneNumber = "Enter a valid phone number.";
  }
  if (!isEmail(data.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!data.billingContactName.trim()) {
    errors.billingContactName = "Billing Contact Name is required.";
  }
  if (!isPhone(data.billingPhone)) {
    errors.billingPhone = "Enter a valid billing phone number.";
  }
  if (!isEmail(data.billingEmail)) {
    errors.billingEmail = "Enter a valid billing email address.";
  }
  if (!data.billingAddress.trim()) {
    errors.billingAddress = "Billing Address is required.";
  }

  return errors;
}
