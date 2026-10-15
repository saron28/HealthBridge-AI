
import sqlite3
from pathlib import Path

DB_PATH = (
    Path(__file__).resolve().parents[2]
    / "data"
    / "healthbridge.db"
)


def lookup_policy(policy_id: str) -> dict:
    """Retrieve a fictional insurance policy."""

    if not DB_PATH.exists():
        return {"error": "Policy database not found"}

    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row

    try:
        cursor = connection.execute(
            """
            SELECT policy_id, customer_name, plan_name,
                   status, monthly_premium, renewal_date,
                   address
            FROM policies
            WHERE policy_id = ?
            """,
            (policy_id,),
        )

        policy = cursor.fetchone()

        if policy is None:
            return {"error": "Policy not found"}

        return dict(policy)

    finally:
        connection.close()


if __name__ == "__main__":
    print(lookup_policy("HB-1001"))
