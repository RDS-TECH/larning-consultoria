#!/bin/bash

echo "========================================="
echo "Railway Migration Script"
echo "========================================="

# Check if migrations should run
if [ "${RUN_MIGRATIONS:-true}" != "true" ]; then
    echo "Migrations disabled via RUN_MIGRATIONS=false"
    exit 0
fi

echo "Checking database connection..."

# Wait for database to be ready
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    echo "Attempt $((attempt + 1))/$max_attempts: Testing database connection..."

    python -c "
from src.core.events.database import engine
try:
    with engine.connect() as conn:
        print('✅ Database connection successful!')
        exit(0)
except Exception as e:
    print(f'❌ Database connection failed: {e}')
    exit(1)
" && break

    attempt=$((attempt + 1))

    if [ $attempt -lt $max_attempts ]; then
        echo "Waiting 2 seconds before retry..."
        sleep 2
    fi
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ Failed to connect to database after $max_attempts attempts"
    echo "Exiting with error..."
    exit 1
fi

echo ""
echo "Running Alembic migrations..."
echo "========================================="

uv run alembic upgrade head

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "✅ Migrations completed successfully!"
    echo "========================================="
    exit 0
else
    echo ""
    echo "========================================="
    echo "❌ Migration failed!"
    echo "========================================="
    exit 1
fi
