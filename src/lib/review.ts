export type ReviewSubmit = {
  companySlug: string;
  authorName: string;
  /** Optional email or phone for follow-up — not shown publicly. */
  contact: string;
  rating: number;
  body: string;
  /** Honeypot — must stay empty. */
  website: string;
};

export type PublicReview = {
  id: number;
  authorName: string;
  rating: number;
  body: string;
  createdAt: string;
};

export type ReviewSummary = {
  average: number;
  count: number;
};

export const EMPTY_REVIEW: ReviewSubmit = {
  companySlug: "",
  authorName: "",
  contact: "",
  rating: 5,
  body: "",
  website: "",
};

const MAX_NAME = 80;
const MAX_CONTACT = 120;
const MAX_BODY = 600;
const MIN_BODY = 12;

export function validateReview(input: ReviewSubmit): string | null {
  if (!input.companySlug.trim()) return "Company is required";
  if (!input.authorName.trim()) return "Name is required";
  if (input.authorName.trim().length > MAX_NAME) {
    return `Name must be ${MAX_NAME} characters or fewer`;
  }
  if (input.contact.trim().length > MAX_CONTACT) {
    return `Contact must be ${MAX_CONTACT} characters or fewer`;
  }
  if (
    !Number.isInteger(input.rating) ||
    input.rating < 1 ||
    input.rating > 5
  ) {
    return "Rating must be 1 to 5 stars";
  }
  const body = input.body.trim();
  if (body.length < MIN_BODY) {
    return `Review must be at least ${MIN_BODY} characters`;
  }
  if (body.length > MAX_BODY) {
    return `Review must be ${MAX_BODY} characters or fewer`;
  }
  return null;
}
