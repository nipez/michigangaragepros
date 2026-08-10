export type ClaimRequest = {
  companyName: string;
  city: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  companySlug: string;
  notes: string;
};

export const EMPTY_CLAIM: ClaimRequest = {
  companyName: "",
  city: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  companySlug: "",
  notes: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateClaim(claim: ClaimRequest): string | null {
  if (!claim.companyName.trim()) return "Company name is required";
  if (!claim.city.trim()) return "City is required";
  if (!claim.contactName.trim()) return "Your name is required";
  if (!claim.email.trim() || !EMAIL_RE.test(claim.email.trim())) {
    return "A valid work email is required";
  }
  if (!claim.phone.trim() || claim.phone.replace(/\D/g, "").length < 10) {
    return "A valid phone number is required";
  }
  return null;
}
