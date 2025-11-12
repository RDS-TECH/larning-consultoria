#!/usr/bin/env python3
"""
Generate password hash for LearnHouse
Run this locally and then use the hash in the SQL command
"""
import hashlib
import os
import base64

def generate_pbkdf2_sha256_hash(password: str, iterations: int = 29000) -> str:
    """Generate PBKDF2-SHA256 hash compatible with passlib"""
    # Generate random salt
    salt = os.urandom(16)

    # Generate hash
    dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, iterations)

    # Encode in passlib format
    salt_b64 = base64.b64encode(salt).decode('ascii').strip()
    dk_b64 = base64.b64encode(dk).decode('ascii').strip()

    return f"$pbkdf2-sha256${iterations}${salt_b64}${dk_b64}"

if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2:
        print("Usage: python3 generate_password_hash.py <password>")
        print("Example: python3 generate_password_hash.py 'Admin123!'")
        sys.exit(1)

    password = sys.argv[1]
    hashed = generate_pbkdf2_sha256_hash(password)

    print("\n" + "="*60)
    print(f"Password: {password}")
    print(f"Hash: {hashed}")
    print("="*60)
    print("\nSQL Command:")
    print(f"UPDATE users SET password = '{hashed}' WHERE email = 'admin@school.dev';")
    print("="*60 + "\n")
