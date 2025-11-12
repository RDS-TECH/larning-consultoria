# FastAPI

FastAPI is a modern, fast (high-performance) web framework for building APIs with Python based on standard Python type hints.

**Version**: 0.115.0+
**Official Documentation**: https://fastapi.tiangolo.com
**Context7 Library ID**: `/fastapi/fastapi`

## Overview

FastAPI is used as the backend API framework in this project. It provides:

- **Automatic API Documentation**: Interactive docs with Swagger UI and ReDoc
- **Type Safety**: Based on Python type hints with Pydantic validation
- **Async Support**: Full support for async/await operations
- **Dependency Injection**: Powerful DI system for reusable logic
- **Performance**: One of the fastest Python frameworks available

## Key Concepts

### Basic Routing

Define API endpoints using decorators:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```

### Request Body with Pydantic

Use Pydantic models for request body validation:

```python
from pydantic import BaseModel
from fastapi import FastAPI

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

@app.post("/items/")
async def create_item(item: Item):
    return {"item": item}
```

### Dependency Injection

Create reusable dependencies for shared logic:

```python
from typing import Annotated
from fastapi import Depends, FastAPI

async def common_parameters(
    q: str | None = None,
    skip: int = 0,
    limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}

app = FastAPI()

@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return {"params": commons, "items": ["item1", "item2"]}
```

### Database Dependencies with Cleanup

Use `yield` for dependencies that need cleanup:

```python
async def get_db():
    db = {"connection": "active"}
    try:
        yield db
    finally:
        db["connection"] = "closed"

@app.get("/query/")
async def query_data(db: Annotated[dict, Depends(get_db)]):
    return {"database": db, "data": "query results"}
```

### Path and Query Parameters

Combine multiple parameter types:

```python
from typing import Annotated
from fastapi import FastAPI, Path, Body

@app.put("/items/{item_id}")
async def update_item(
    item_id: Annotated[int, Path(ge=1)],
    item: Item,
    importance: Annotated[int, Body(ge=1, le=5)]
):
    return {"item_id": item_id, "item": item, "importance": importance}
```

### Header and Cookie Parameters

Access headers and cookies using Pydantic models:

```python
from fastapi import Header, Cookie
from pydantic import BaseModel

class CommonHeaders(BaseModel):
    host: str
    user_agent: str | None = None

@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return {"headers": headers}
```

### Background Tasks

Execute tasks after returning a response:

```python
from fastapi import BackgroundTasks

def write_log(message: str):
    with open("log.txt", mode="a") as log:
        log.write(message + "\n")

@app.post("/send-notification/{email}")
async def send_notification(
    email: str,
    background_tasks: BackgroundTasks
):
    background_tasks.add_task(write_log, f"Notification sent to {email}")
    return {"message": "Notification sent"}
```

## Common Patterns in This Project

### Router Organization

Organize endpoints using APIRouter:

```python
from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/")
async def get_users():
    return {"users": []}

@router.post("/")
async def create_user(user: UserCreate):
    return {"user": user}
```

### Application Lifespan Events

Manage startup and shutdown logic:

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load ML models, connect to database
    print("Starting up...")
    yield
    # Shutdown: Clean up resources
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)
```

### Exception Handling

Return appropriate HTTP exceptions:

```python
from fastapi import HTTPException, status

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    if item_id not in items:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    return items[item_id]
```

### WebSocket Support

Implement real-time communication:

```python
from fastapi import WebSocket, WebSocketDisconnect

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str
):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message: {data}")
    except WebSocketDisconnect:
        print(f"Client {client_id} disconnected")
```

## Integration with SQLModel

FastAPI works seamlessly with SQLModel for database operations:

```python
from sqlmodel import Session, select
from fastapi import Depends

def get_session():
    with Session(engine) as session:
        yield session

@app.get("/heroes/")
def read_heroes(
    session: Annotated[Session, Depends(get_session)]
):
    heroes = session.exec(select(Hero)).all()
    return heroes
```

## API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: Available at `/docs`
- **ReDoc**: Available at `/redoc`
- **OpenAPI Schema**: Available at `/openapi.json`

## Configuration

### CORS Middleware

Enable CORS for frontend communication:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Environment Variables

Use Pydantic Settings for configuration:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str

    class Config:
        env_file = ".env"

settings = Settings()
```

## Testing

FastAPI provides a test client based on HTTPX:

```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}
```

## Important Notes

- Use `async def` for I/O-bound operations (database, API calls)
- Use regular `def` for CPU-bound operations
- Always validate input data with Pydantic models
- Use dependency injection for database sessions, authentication, etc.
- Type hints are essential for automatic validation and documentation

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Advanced User Guide](https://fastapi.tiangolo.com/advanced/)
- [Deployment](https://fastapi.tiangolo.com/deployment/)
