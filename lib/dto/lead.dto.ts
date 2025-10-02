
export class LeadDTO {
  id: string;
  provider: string;
  providerUserId: string;
  displayName?: string;
  createdAt: string;

  constructor(params: {
    id: string;
    provider: string;
    providerUserId: string;
    displayName?: string;
    createdAt?: string;
  }) {
    this.id = params.id;
    this.provider = params.provider;
    this.providerUserId = params.providerUserId;
    this.displayName = params.displayName;
    this.createdAt = params.createdAt ?? new Date().toISOString();
  }
}
