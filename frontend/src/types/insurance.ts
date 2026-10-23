export type PlanTier = "Bronze" | "Silver" | "Gold";

export interface InsurancePlan {
  id: string;
  name: string;
  tier: PlanTier;
  monthlyPremium: number;
  deductible: number;
  outOfPocketMax: number;
  summary: string;
  features: string[];
  recommended?: boolean;
}

export interface Policy {
  policyId: string;
  planName: string;
  status: "Active" | "Pending" | "Expired";
  monthlyPremium: number;
  renewalDate: string;
  memberName: string;
  email: string;
  phone: string;
  address: string;
}

export interface RenewalCheck {
  success: boolean;
  policy: Pick<Policy, "policyId" | "planName" | "status" | "monthlyPremium" | "renewalDate">;
  renewal: {
    eligibleForDemoRenewal: boolean;
    issues: string[];
  };
}

export interface EnrollmentRequest {
  fullName: string;
  email: string;
  dateOfBirth: string;
  planId: string;
}

export interface EnrollmentResponse {
  success: boolean;
  referenceId: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
