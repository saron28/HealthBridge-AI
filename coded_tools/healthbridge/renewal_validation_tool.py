
import json
from datetime import date, timedelta
from typing import Any

from neuro_san.interfaces.coded_tool import CodedTool
from coded_tools.healthbridge.policy_lookup import lookup_policy


class RenewalValidationTool(CodedTool):
    """Validate fictional policy renewal readiness."""

    def invoke(
        self,
        args: dict[str, Any],
        sly_data: dict[str, Any]
    ) -> str:

        policy_id = args.get("policy_id")

        if not isinstance(policy_id, str) or not policy_id.strip():
            return json.dumps({
                "success": False,
                "error": "A valid policy ID is required."
            })

        policy = lookup_policy(policy_id.strip().upper())

        if "error" in policy:
            return json.dumps({
                "success": False,
                "error": policy["error"]
            })

        issues = []

        if policy["status"] != "Active":
            issues.append("Policy is not active.")

        if not policy.get("address"):
            issues.append("Customer address is missing.")

        if policy["monthly_premium"] <= 0:
            issues.append("Invalid monthly premium.")

        try:
            renewal_date = date.fromisoformat(
                policy["renewal_date"]
            )
        except (TypeError, ValueError):
            return json.dumps({
                "success": False,
                "error": "Invalid renewal date."
            })

        today = date.today()
        days_until_renewal = (renewal_date - today).days

        if days_until_renewal < 0:
            issues.append("Renewal date has passed.")
        elif days_until_renewal > 60:
            issues.append(
                "Outside the demo 60-day renewal window."
            )

        return json.dumps({
            "success": True,
            "policy_id": policy["policy_id"],
            "renewal_date": policy["renewal_date"],
            "days_until_renewal": days_until_renewal,
            "eligible_for_demo_renewal": len(issues) == 0,
            "issues": issues,
            "next_action": (
                "Request customer confirmation"
                if not issues
                else "Review renewal issues"
            )
        })
