#!/bin/sh

echo "Starting database migration..."

# Navigate to API directory
cd /app/api

# Check if database connection is available
echo "Checking database connection..."
python -c "
from src.core.events.database import engine
try:
    with engine.connect() as conn:
        print('Database connection successful!')
except Exception as e:
    print(f'Database connection failed: {e}')
    exit(1)
"

if [ $? -ne 0 ]; then
    echo "Failed to connect to database. Exiting..."
    exit 1
fi

# Run Alembic migrations
echo "Running Alembic migrations..."
uv run alembic upgrade head

if [ $? -eq 0 ]; then
    echo "Database migration completed successfully!"
else
    echo "Database migration failed!"
    exit 1
fi

echo "Migration script finished."
