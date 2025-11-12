#!/usr/bin/env python3
"""
Script to reset admin password in LearnHouse
Usage: python scripts/reset_admin_password.py <new_password>
Example: python scripts/reset_admin_password.py MyNewPassword123

This script must be run from the apps/api directory (parent of scripts/)
"""
import sys
import os

# Add parent directory to path to import project modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from sqlalchemy import create_engine
from sqlmodel import Session, select
from config.config import get_learnhouse_config
from src.db.users import User
from src.security.security import security_hash_password

def reset_admin_password(new_password: str):
    """Reset the admin user password"""

    # Get database connection
    learnhouse_config = get_learnhouse_config()
    engine = create_engine(
        learnhouse_config.database_config.sql_connection_string,
        echo=False,
        pool_pre_ping=True
    )

    with Session(engine) as session:
        # Find admin user (email: admin@school.dev or username: admin)
        statement = select(User).where(
            (User.email == "admin@school.dev") | (User.username == "admin")
        )
        admin_user = session.exec(statement).first()

        if not admin_user:
            print("❌ Admin user not found!")
            print("Looking for user with email 'admin@school.dev' or username 'admin'")
            return False

        # Hash the new password
        hashed_password = security_hash_password(new_password)

        # Update the password
        admin_user.password = hashed_password
        session.add(admin_user)
        session.commit()

        print("✅ Password reset successfully!")
        print(f"Email: {admin_user.email}")
        print(f"Username: {admin_user.username}")
        print(f"New password: {new_password}")
        print("\n⚠️  Remember to change this password after logging in!")

        return True

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python scripts/reset_admin_password.py <new_password>")
        print("Example: python scripts/reset_admin_password.py MyNewPassword123")
        print("\nNote: Run this from the apps/api directory")
        sys.exit(1)

    new_password = sys.argv[1]

    if len(new_password) < 8:
        print("❌ Password must be at least 8 characters long")
        sys.exit(1)

    print(f"Resetting admin password...")
    reset_admin_password(new_password)
