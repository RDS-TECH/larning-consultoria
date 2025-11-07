#!/bin/sh

# Set environment variables for proper Python logging
export PYTHONUNBUFFERED=1
export PYTHONIOENCODING=utf-8

# Run database migrations if enabled
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "Running database migrations..."
    cd /app/api

    # Wait for database to be ready
    echo "Waiting for database to be ready..."
    sleep 5

    # Run migrations
    uv run alembic upgrade head

    if [ $? -ne 0 ]; then
        echo "WARNING: Database migration failed, but continuing startup..."
    else
        echo "Database migrations completed successfully!"
    fi

    cd /app
fi

# Start the services
pm2 start server.js --cwd /app/web --name learnhouse-web > /dev/null 2>&1
pm2 start uv --cwd /app/api --name learnhouse-api -- run app.py

# Check if the services are running and log the status
pm2 status

# Start Nginx in the background
nginx -g 'daemon off;' &

# Tail PM2 logs with proper formatting
pm2 logs --raw
