export type Lead = {
  service: string;
  issue: string;
  zip: string;
  name: string;
  phone: string;
  email: string;
  timing: string;
};

export type LeadState = {
  step: number;
  done: boolean;
  lead: Lead;
};

export const emptyLead = (): Lead => ({
  service: "",
  issue: "",
  zip: "",
  name: "",
  phone: "",
  email: "",
  timing: "",
});

export function isStepValid(step: number, lead: Lead): boolean {
  switch (step) {
    case 1:
      return !!lead.service;
    case 2:
      return !!lead.issue;
    case 3:
      return lead.zip.trim().length >= 3;
    case 4:
      return !!lead.name.trim() && (!!lead.phone.trim() || !!lead.email.trim());
    case 5:
      return !!lead.timing;
    default:
      return false;
  }
}
