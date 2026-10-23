import type { InsurancePlan, Policy, RenewalCheck } from "../types/insurance";

export const plans: InsurancePlan[] = [
  {
    id: "bronze",
    name: "HealthBridge Bronze",
    tier: "Bronze",
    monthlyPremium: 245,
    deductible: 6500,
    outOfPocketMax: 8500,
    summary: "Essential coverage for those who want a lower monthly premium.",
    features: ["Preventive care covered", "Virtual care access", "Nationwide emergency care"],
  },
  {
    id: "silver",
    name: "HealthBridge Silver",
    tier: "Silver",
    monthlyPremium: 320,
    deductible: 3500,
    outOfPocketMax: 6500,
    summary: "A balanced plan with dependable coverage for everyday care.",
    features: ["Preventive care covered", "Primary care from $25", "Prescription coverage"],
    recommended: true,
  },
  {
    id: "gold",
    name: "HealthBridge Gold",
    tier: "Gold",
    monthlyPremium: 450,
    deductible: 1500,
    outOfPocketMax: 4500,
    summary: "More predictable costs with richer coverage when you need it.",
    features: ["Preventive care covered", "Primary care from $15", "Enhanced specialist coverage"],
  },
];

export const policies: Policy[] = [
  {
    policyId: "HB-1001",
    planName: "HealthBridge Silver",
    status: "Active",
    monthlyPremium: 320,
    renewalDate: "2026-12-31",
    memberName: "Jordan Lee",
    email: "jordan.lee@example.test",
    phone: "(555) 014-2026",
    address: "120 Harbor Street, Portland, OR 97205",
  },
  {
    policyId: "HB-1002",
    planName: "HealthBridge Gold",
    status: "Active",
    monthlyPremium: 450,
    renewalDate: "2026-11-15",
    memberName: "Taylor Morgan",
    email: "taylor.morgan@example.test",
    phone: "(555) 018-4412",
    address: "48 Willow Avenue, Austin, TX 78701",
  },
];

export const renewalChecks: Record<string, RenewalCheck> = {
  "HB-1001": {
    success: true,
    policy: {
      policyId: "HB-1001",
      planName: "HealthBridge Silver",
      status: "Active",
      monthlyPremium: 320,
      renewalDate: "2026-12-31",
    },
    renewal: {
      eligibleForDemoRenewal: false,
      issues: ["Outside the 60-day renewal window"],
    },
  },
  "HB-1002": {
    success: true,
    policy: {
      policyId: "HB-1002",
      planName: "HealthBridge Gold",
      status: "Active",
      monthlyPremium: 450,
      renewalDate: "2026-11-15",
    },
    renewal: {
      eligibleForDemoRenewal: true,
      issues: [],
    },
  },
};
