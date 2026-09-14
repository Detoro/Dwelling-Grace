import { api } from "./client";

export interface NewsletterSubscribeResponse {
  status: string;
  email: string;
}

export async function subscribeNewsletter(email: string): Promise<NewsletterSubscribeResponse> {
  return await api.post<NewsletterSubscribeResponse>("/newsletter", { email });
}