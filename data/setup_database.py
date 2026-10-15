
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "healthbridge.db"

def setup_database():
    connection = sqlite3.connect(DB_PATH)
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS policies (
            policy_id TEXT PRIMARY KEY,
            customer_name TEXT NOT NULL,
            plan_name TEXT NOT NULL,
            status TEXT NOT NULL,
            monthly_premium REAL NOT NULL,
            renewal_date TEXT NOT NULL,
            address TEXT NOT NULL
        )
    """)

    cursor.execute("""
        INSERT OR IGNORE INTO policies
        (policy_id, customer_name, plan_name, status,
         monthly_premium, renewal_date, address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "HB-1001",
        "Alex Morgan",
        "HealthBridge Silver",
        "Active",
        320.00,
        "2026-12-31",
        "123 Example Street, Austin, TX"
    ))
    
    cursor.execute("""
        INSERT OR IGNORE INTO policies
        (policy_id, customer_name, plan_name, status,
         monthly_premium, renewal_date, address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "HB-1002",
        "Taylor Brooks",
        "HealthBridge Gold",
        "Active",
        450.00,
        "2026-11-15",
        "456 Demo Avenue, Dallas, TX"
    ))

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS renewal_requests (
            request_id TEXT PRIMARY KEY,
            policy_id TEXT NOT NULL,
            request_date TEXT NOT NULL,
            status TEXT NOT NULL,
            customer_confirmed INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (policy_id) REFERENCES policies(policy_id)
        )
    """)

    connection.commit()
    connection.close()
    print("HealthBridge database created successfully!")

if __name__ == "__main__":
    setup_database()
