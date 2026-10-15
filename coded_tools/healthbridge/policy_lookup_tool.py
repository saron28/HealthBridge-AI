
import json
from typing import Any

from neuro_san.interfaces.coded_tool import CodedTool
from coded_tools.healthbridge.policy_lookup import lookup_policy


class PolicyLookupTool(CodedTool):
    """Retrieve a fictional HealthBridge insurance policy."""

    def invoke(
        self,
        args: dict[str, Any],
        sly_data: dict[str, Any]
    ) -> str:

        policy_id = args.get("policy_id")

        if not isinstance(policy_id, str) or not policy_id.strip():
            return json.dumps({
                "success": False,
                "error": "A valid policy_id is required."
            })

        policy_id = policy_id.strip().upper()

        # Development-only tool using synthetic data.
        # Customer authorization will be added before website use.
        result = lookup_policy(policy_id)

        if "error" in result:
            return json.dumps({
                "success": False,
                "error": result["error"]
            })

        return json.dumps({
            "success": True,
            "policy": result
        })
