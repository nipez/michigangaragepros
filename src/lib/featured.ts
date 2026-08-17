export type FeaturedInterest = {
  companyName: string;
  city: string;
  plan: string;
  contactName: string;
  email: string;
  phone: string;
  companySlug: string;
  notes: string;
};

export const EMPTY_FEATURED: FeaturedInterest = {
  companyName: "",
  city: "",
  plan: "city",
  contactName: "",
  email: "",
  phone: "",
  companySlug: "",
  notes: "",
};

export function validateFeaturedInterest(
  data: FeaturedInterest,
): string | null {
  if (!data.companyName.trim()) return "Company name is required";
  if (!data.city.trim()) return "City is required";
  if (!data.plan.trim()) return "Select a Featured plan";
  if (!data.contactName.trim()) return "Your name is required";
  if (!data.email.trim() || !data.email.includes("@")) {
    return "A valid work email is required";
  }
  if (!data.phone.trim() || data.phone.replace(/\D/g, "").length < 10) {
    return "A valid phone number is required";
  }
  return null;
}
