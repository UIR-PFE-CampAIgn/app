
export class LeadDTO {
  id: string;
  provider: string;
  providerUserId: string;
  displayName?: string;
  score?: string;
  createdAt: string;

  constructor(params: {
    id: string;
    provider: string;
    providerUserId: string;
    displayName?: string;
    score?: string;
    createdAt?: string;
  }) {
    this.id = params.id;
    this.provider = params.provider;
    this.providerUserId = params.providerUserId;
    this.displayName = params.displayName;
    this.score = params.score;
    this.createdAt = params.createdAt ?? new Date().toISOString();
  }
}
