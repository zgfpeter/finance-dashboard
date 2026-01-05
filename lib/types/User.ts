import { CurrencyCode } from "./dashboard";

export type User = {
  id: string;
  email: string;
  username: string;
  accessToken?: string;
  currency: CurrencyCode;
  avatarUrl?: string;
};

export type UserSettings = {
  username: string;
  currency: CurrencyCode;
  avatarUrl: string;
};
