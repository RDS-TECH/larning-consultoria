# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LearnHouse is an open-source learning management system (LMS) built with a modern monorepo architecture using Turborepo. The platform provides educational content management with support for dynamic pages, videos, documents, quizzes, and more.

**Architecture**: Frontend (Next.js) + Backend (FastAPI) + PostgreSQL + Redis

## Development Setup

### Prerequisites
- **pnpm** (v9.0.6 or higher) - Package manager
- **Python** 3.12.3+ with `uv` package manager
- **Docker & Docker Compose** (for full stack)
- **PostgreSQL** 16+ and **Redis** 7.2+

### Quick Start with Docker

```bash
# Start the entire stack (backend, frontend, DB, Redis)
docker-compose up -d

# Monitor logs
docker-compose logs -f
```

The application will be available at `http://localhost` within 2 minutes.

### Local Development

#### Backend (FastAPI)

```bash
cd apps/api

# Install dependencies
uv sync

# Run backend server in development mode
python app.py
# OR using uvicorn directly
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Run database migrations
alembic upgrade head

# Run installation CLI (creates default org and user)
python cli.py install
# OR for quick install with defaults
python cli.py install --short

# Run tests
uv run pytest src/tests/ -v

# Run tests with coverage
uv run pytest src/tests/security/ --cov=src.security --cov-report=html

# Linting (uses Ruff)
ruff check .
ruff check . --fix
```

**API Documentation**: Available at `/docs` (Swagger) and `/redoc` when development mode is enabled.

#### Frontend (Next.js)

```bash
cd apps/web

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint
pnpm lint:fix
```

### Root Commands (Turborepo)

```bash
# Run all apps in development
pnpm dev

# Build all apps
pnpm build

# Start all apps
pnpm start

# Lint all apps
pnpm lint

# Format code
pnpm format
```

## Architecture

### Monorepo Structure

```
apps/
├── api/          # FastAPI backend
│   ├── src/
│   │   ├── routers/        # API route handlers
│   │   ├── services/       # Business logic
│   │   ├── db/            # Database models
│   │   ├── core/          # Core functionality & events
│   │   ├── security/      # RBAC & security features
│   │   └── tests/         # Test suites
│   ├── migrations/        # Alembic database migrations
│   ├── config/           # Configuration files
│   ├── app.py            # FastAPI application entry
│   └── cli.py            # CLI tool for installation
│
└── web/          # Next.js frontend
    ├── app/              # Next.js 14+ App Router
    │   ├── orgs/        # Multi-org pages
    │   ├── auth/        # Authentication pages
    │   ├── editor/      # Course editor
    │   ├── install/     # Installation wizard
    │   └── api/         # API routes
    ├── components/       # React components
    │   ├── Contexts/    # React contexts
    │   ├── Dashboard/   # Dashboard components
    │   ├── Objects/     # Core UI objects
    │   └── ui/          # Radix UI components
    ├── services/         # API client services
    ├── lib/             # Utility libraries
    └── hooks/           # React hooks
```

### Backend Architecture (FastAPI)

The backend follows a layered architecture:

1. **Routers** (`src/routers/`): Handle HTTP requests and route to services
   - Organized by domain: `auth`, `courses`, `orgs`, `users`, `ai`, `payments`, etc.
   - API routes are namespaced under `/api/v1`

2. **Services** (`src/services/`): Business logic and orchestration
   - Each service module handles specific domain logic
   - Services interact with database models and external APIs

3. **Database Models** (`src/db/`): SQLModel-based ORM models
   - PostgreSQL with SQLAlchemy underneath
   - Alembic for database migrations

4. **Security** (`src/security/`): Role-Based Access Control (RBAC) & feature flags
   - RBAC implementation for permissions
   - JWT authentication via `fastapi-jwt-auth`

5. **Core** (`src/core/`): Application startup/shutdown events, database engine, and event handling

### Frontend Architecture (Next.js 14+)

Uses Next.js App Router with:

- **App Directory**: File-based routing with React Server Components
- **Client-side State**: NextAuth for authentication, SWR for data fetching
- **UI Framework**: Radix UI primitives + Tailwind CSS
- **Rich Text Editor**: Tiptap (ProseMirror wrapper) for course content
- **Collaborative Editing**: YJS for multiplayer editing
- **Styling**: Tailwind CSS 4+ with Stitches for styled-components

### Key Technologies

**Backend**:
- FastAPI (async Python web framework)
- SQLModel + Alembic (ORM + migrations)
- PostgreSQL (primary database)
- Redis (caching & sessions)
- Pydantic (data validation)
- Ruff (linting)
- Uvicorn (ASGI server)

**Frontend**:
- Next.js 16 with App Router
- React 19
- Tiptap (content editor)
- Radix UI (accessible components)
- Tailwind CSS 4
- SWR (data fetching)
- Framer Motion (animations)

## Environment Configuration

Both frontend and backend require environment variables:

### Backend (.env in apps/api/)
Reference: `extra/example-learnhouse-conf.env`

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection URL
- `JWT_SECRET_KEY`: Secret for JWT tokens
- `INSTALL_MODE`: Enable/disable installation mode
- `DEVELOPMENT_MODE`: Enable development features

### Frontend (.env in apps/web/)
Key variables (all prefixed with `NEXT_PUBLIC_`):
- `NEXT_PUBLIC_LEARNHOUSE_API_URL`: Backend API URL
- `NEXT_PUBLIC_LEARNHOUSE_BACKEND_URL`: Backend base URL
- `NEXT_PUBLIC_LEARNHOUSE_DOMAIN`: Application domain

**Important**: `NEXT_PUBLIC_*` env vars must be passed as build args in Dockerfile for client-side bundle.

## Database Migrations

```bash
cd apps/api

# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Check current version
alembic current
```

## Testing

### Backend Tests

```bash
cd apps/api

# Run all tests
uv run pytest src/tests/ -v

# Run specific test file
uv run pytest src/tests/security/test_rbac.py -v

# Run with coverage
uv run pytest src/tests/ --cov=src --cov-report=html

# CI environment variable
export TESTING=true
```

### Frontend Tests
Currently, frontend uses ESLint for linting. No test suite configured yet.

## Multi-Organization Support

LearnHouse supports multi-tenancy:
- Organizations are identified by slug (URL-based routing: `/orgs/[orgslug]`)
- Each organization has its own courses, users, and settings
- Users can belong to multiple organizations with different roles

## Installation Flow

First-time setup uses an installation wizard:
1. Backend initializes database schema
2. CLI or web UI creates default elements (roles, permissions)
3. Creates first organization with admin user
4. Installation mode should be disabled after setup

## API Authentication

The backend uses JWT tokens for authentication:
- Tokens are issued on login via `/api/v1/auth/login`
- Use `Authorization: Bearer <token>` header for authenticated requests
- NextAuth handles session management on the frontend

## Common Development Tasks

### Adding a New API Endpoint

1. Create/update router in `apps/api/src/routers/`
2. Add business logic to `apps/api/src/services/`
3. Create/update database models in `apps/api/src/db/` if needed
4. Register router in `apps/api/src/router.py`
5. Add tests in `apps/api/src/tests/`

### Adding a New Frontend Page

1. Create page in `apps/web/app/[route]/page.tsx`
2. Add API service call in `apps/web/services/`
3. Create reusable components in `apps/web/components/`
4. Add types in `apps/web/types/`

### Working with the Block-Based Editor

LearnHouse uses Tiptap (ProseMirror) for its notion-like block editor:
- Block components: `apps/web/services/blocks/`
- Backend block handlers: `apps/api/src/services/blocks/`
- Supports: Video, PDF, Quiz, Image, and rich text blocks

## CI/CD

GitHub Actions workflows in `.github/workflows/`:
- `api-tests.yaml`: Backend tests on push/PR
- `api-lint.yaml`: Backend linting
- `web-lint.yaml`: Frontend linting
- `docker-build.yaml`: Docker image build validation

## Branch Strategy

- **Main branch**: `dev`
- Create feature branches from `dev`
- PRs should target `dev`

## Docker Build Notes

The Dockerfile uses multi-stage builds:
1. Frontend build stage (Node.js Alpine)
2. Backend stage (Python slim)
3. Final runner combines both with Nginx as reverse proxy

Default ports:
- Nginx: 80 (external)
- Backend: 8000 (internal)
- Frontend: 9000 (internal, served via Nginx)

## Known Configuration Issues

- Environment variables with `NEXT_PUBLIC_*` prefix must be passed as build args in Dockerfile
- Case-insensitive environment variable checks for `HTTPS` and `MULTI_ORG`
- Undefined API URLs should show helpful console messages

## Error Handling

- Backend returns structured JSON errors with appropriate HTTP status codes
- Frontend should check for undefined API URLs and provide user-friendly messages
- API responses follow consistent error format defined in routers
- All the documentation that was generated should be saved in the docs/ folder