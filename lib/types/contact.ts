// Proper enum for contact reasons (export for reuse )
export enum ContactReason {
  Technical = "Technical",
  Suggestion = "Suggestion",
  Billing = "Billing",
  Other = "Other",
}

// Shape of the form state
export interface ContactForm {
  reason: ContactReason;
  title: string;
  message: string;
  email: string; // optional so you can contact back
  username: string;
}
