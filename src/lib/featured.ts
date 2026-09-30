import { FEATURED_PLANS } from "@/data/growth";

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

const PLAN_IDS = new Set(FEATURED_PLANS.map((p) => p.id));

export function validateFeaturedInterest(
  data: FeaturedInterest,
): string | null {
  if (!data.companyName.trim()) return "Company name is required";
  if (!data.city.trim()) return "City is required";
  if (!data.plan.trim()) return "Select a Featured plan";
  if (!PLAN_IDS.has(data.plan as (typeof FEATURED_PLANS)[number]["id"])) {
    return "Select a Featured plan";
  }
  if (!data.contactName.trim()) return "Your name is required";
  if (!data.email.trim() || !data.email.includes("@")) {
    return "A valid work email is required";
  }
  if (!data.phone.trim() || data.phone.replace(/\D/g, "").length < 10) {
    return "A valid phone number is required";
  }
  return null;
}
