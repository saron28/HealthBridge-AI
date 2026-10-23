import { plans, policies, renewalChecks } from "../mocks/policies";
import type {
  ChatMessage,
  EnrollmentRequest,
  EnrollmentResponse,
  InsurancePlan,
  Policy,
  RenewalCheck,
} from "../types/insurance";

const apiMode = import.meta.env.VITE_API_MODE ?? "mock";
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

interface BackendPolicy {
  policy_id: string;
  plan_name: string;
  status: Policy["status"];
  monthly_premium: number;
  renewal_date: string;
  member_name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface BackendRenewalCheck {
  success: boolean;
  policy: Pick<BackendPolicy, "policy_id" | "plan_name" | "status" | "monthly_premium" | "renewal_date">;
  renewal: {
    eligible_for_demo_renewal: boolean;
    issues: string[];
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL must be set when VITE_API_MODE=backend.");
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("We couldn't reach HealthBridge right now. Please try again shortly.");
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `The request failed (${response.status}). Please try again.`);
  }
  return (await response.json()) as T;
}

function normalizePolicy(policy: BackendPolicy): Policy {
  return {
    policyId: policy.policy_id,
    planName: policy.plan_name,
    status: policy.status,
    monthlyPremium: policy.monthly_premium,
    renewalDate: policy.renewal_date,
    memberName: policy.member_name ?? "Not provided",
    email: policy.email ?? "Not provided",
    phone: policy.phone ?? "Not provided",
    address: policy.address ?? "Not provided",
  };
}

const delay = (milliseconds = 350) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

export async function getPlans(): Promise<InsurancePlan[]> {
  if (apiMode === "backend") return request<InsurancePlan[]>("/api/plans");
  await delay(150);
  return plans;
}

export async function getPolicy(policyId: string): Promise<Policy> {
  if (apiMode === "backend") {
    return normalizePolicy(await request<BackendPolicy>(`/api/policies/${encodeURIComponent(policyId)}`));
  }
  await delay();
  const policy = policies.find((item) => item.policyId === policyId.trim().toUpperCase());
  if (!policy) throw new Error("We couldn't find a demo policy with that ID. Try HB-1001 or HB-1002.");
  return policy;
}

export async function checkRenewal(policyId: string): Promise<RenewalCheck> {
  if (apiMode === "backend") {
    const response = await request<BackendRenewalCheck>("/api/renewal/check", {
      method: "POST",
      body: JSON.stringify({ policy_id: policyId }),
    });
    return {
      success: response.success,
      policy: {
        policyId: response.policy.policy_id,
        planName: response.policy.plan_name,
        status: response.policy.status,
        monthlyPremium: response.policy.monthly_premium,
        renewalDate: response.policy.renewal_date,
      },
      renewal: {
        eligibleForDemoRenewal: response.renewal.eligible_for_demo_renewal,
        issues: response.renewal.issues,
      },
    };
  }
  await delay(600);
  const result = renewalChecks[policyId.trim().toUpperCase()];
  if (!result) throw new Error("We couldn't find a demo policy with that ID. Try HB-1001 or HB-1002.");
  return result;
}

export async function createEnrollment(
  enrollment: EnrollmentRequest,
): Promise<EnrollmentResponse> {
  if (apiMode === "backend") {
    return request<EnrollmentResponse>("/api/enrollment", {
      method: "POST",
      body: JSON.stringify(enrollment),
    });
  }
  await delay(550);
  return {
    success: true,
    referenceId: `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    message: "Your demo enrollment request has been recorded. No insurance coverage has been issued.",
  };
}

export async function sendChatMessage(message: string): Promise<string> {
  if (apiMode === "backend") {
    const response = await request<{ reply: string }>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
    return response.reply;
  }
  await delay(900);
  const normalized = message.toLowerCase();
  if (normalized.includes("renew")) {
    return "I can help you check a demo policy's renewal eligibility. Visit Renew my policy and enter HB-1001 or HB-1002. The result shown there comes from the demo eligibility service.";
  }
  if (normalized.includes("enroll") || normalized.includes("plan")) {
    return "You can compare our fictional Bronze, Silver, and Gold demo plans on the Enroll page. No real coverage is offered through this prototype.";
  }
  if (normalized.includes("policy") || normalized.includes("address") || normalized.includes("contact")) {
    return "For this demo, you can look up synthetic policy details on Manage my policy. Contact or address changes are not submitted until a verified backend workflow is available.";
  }
  return "I'm the HealthBridge demo assistant. I can help you explore fictional plans, find the policy lookup, or explain the renewal demo. What would you like to do?";
}

export function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, role, content };
}

export const usesMockApi = apiMode !== "backend";
