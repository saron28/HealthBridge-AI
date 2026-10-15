
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from neuro_san.interfaces.coded_tool import CodedTool
from coded_tools.healthbridge.renewal_validation_tool import RenewalValidationTool

DB_PATH = (
    Path(__file__).resolve().parents[2]
    / "data"
    / "healthbridge.db"
)


class RenewalRequestTool(CodedTool):
    """Create a simulated renewal request after validation."""

    def invoke(
        self,
        args: dict[str, Any],
        sly_data: dict[str, Any]
    ) -> str:

        policy_id = args.get("policy_id")
        confirmed = args.get("customer_confirmed")

        if not isinstance(policy_id, str) or not policy_id.strip():
            return json.dumps({
                "success": False,
                "error": "A valid policy ID is required."
            })

        policy_id = policy_id.strip().upper()

        if confirmed is not True:
            return json.dumps({
                "success": False,
                "error": "Explicit customer confirmation is required."
            })

        validation = json.loads(
            RenewalValidationTool().invoke(
                {"policy_id": policy_id}, {}
            )
        )

        if not validation.get("eligible_for_demo_renewal"):
            return json.dumps({
                "success": False,
                "error": "Policy is not eligible for demo renewal.",
                "issues": validation.get("issues", [])
            })

        if not DB_PATH.exists():
            return json.dumps({
                "success": False,
                "error": "Policy database not found."
            })

        connection = sqlite3.connect(DB_PATH)

        try:
            connection.execute("BEGIN IMMEDIATE")

            existing = connection.execute(
                """
                SELECT request_id
                FROM renewal_requests
                WHERE policy_id = ?
                  AND status = 'Pending Review'
                """,
                (policy_id,)
            ).fetchone()

            if existing:
                connection.rollback()
                return json.dumps({
                    "success": False,
                    "error": "A pending renewal request already exists.",
                    "request_id": existing[0]
                })

            request_id = "REN-" + uuid4().hex[:10].upper()
            request_date = datetime.now(
                timezone.utc
            ).isoformat()

            connection.execute(
                """
                INSERT INTO renewal_requests
                (request_id, policy_id, request_date,
                 status, customer_confirmed)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    request_id,
                    policy_id,
                    request_date,
                    "Pending Review",
                    1
                )
            )

            connection.commit()

            return json.dumps({
                "success": True,
                "request_id": request_id,
                "policy_id": policy_id,
                "status": "Pending Review",
                "message": "Simulated renewal request created."
            })

        except sqlite3.Error:
            connection.rollback()
            return json.dumps({
                "success": False,
                "error": "Database operation failed."
            })

        finally:
            connection.close()
