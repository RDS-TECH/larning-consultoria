# Pydantic

Pydantic is a data validation library using Python type hints.

**Version**: 1.8.0-2.0.0
**Official Documentation**: https://docs.pydantic.dev
**Context7 Library ID**: `/pydantic/pydantic`

## Overview

Pydantic provides data validation and settings management using Python type annotations. Key features:

- **Data Validation**: Automatic validation of data using type hints
- **Serialization**: Convert models to JSON, dict, or other formats
- **Configuration**: Manage application settings
- **Editor Support**: Full IDE autocompletion and type checking
- **Performance**: Fast validation using Rust-based core

## Basic Model Definition

```python
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    email: str
    age: int | None = None

user = User(id=1, name="John Doe", email="john@example.com")
print(user.model_dump())
# {'id': 1, 'name': 'John Doe', 'email': 'john@example.com', 'age': None}
```

## Field Validation

### Field Constraints

```python
from pydantic import BaseModel, Field

class Product(BaseModel):
    product_id: int = Field(ge=1)
    name: str = Field(min_length=1, max_length=200)
    price: float = Field(gt=0, le=1000000)
    quantity: int = Field(ge=0, default=0)
    tags: list[str] = Field(default_factory=list, max_length=10)
```

### Custom Validation

```python
from pydantic import BaseModel, field_validator

class UserModel(BaseModel):
    name: str
    email: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email')
        return v.lower()
```

## Serialization

### Model to Dictionary

```python
user = User(id=1, name="John", email="john@example.com", age=30)

# Standard serialization
print(user.model_dump())

# Exclude specific fields
print(user.model_dump(exclude={'age'}))

# Exclude unset fields
print(user.model_dump(exclude_unset=True))

# Exclude default values
print(user.model_dump(exclude_defaults=True))
```

### Model to JSON

```python
# JSON string
json_str = user.model_dump_json()

# With custom serialization
json_str = user.model_dump_json(
    exclude={'id'},
    indent=2
)
```

### Field Aliases

```python
from pydantic import BaseModel, Field

class APIModel(BaseModel):
    internal_id: int = Field(
        validation_alias='id',
        serialization_alias='identifier'
    )
    display_name: str = Field(
        validation_alias='name',
        serialization_alias='displayName'
    )

# Parse with validation alias
model = APIModel.model_validate({'id': 100, 'name': 'Example'})

# Serialize with serialization alias
output = model.model_dump(by_alias=True)
# {'identifier': 100, 'displayName': 'Example'}
```

## Advanced Features

### Nested Models

```python
class Address(BaseModel):
    street: str
    city: str
    country: str

class Person(BaseModel):
    name: str
    address: Address

person = Person(
    name="John",
    address={
        "street": "123 Main St",
        "city": "New York",
        "country": "USA"
    }
)
```

### Model Configuration

```python
from pydantic import BaseModel, ConfigDict

class StrictModel(BaseModel):
    model_config = ConfigDict(
        strict=True,  # No type coercion
        frozen=True,  # Immutable instances
        validate_assignment=True,  # Validate on attribute assignment
        extra='forbid',  # Reject extra fields
        str_strip_whitespace=True,
        str_min_length=1
    )

    id: int
    name: str
```

### Computed Fields

```python
from pydantic import BaseModel, computed_field

class Rectangle(BaseModel):
    width: float
    height: float

    @computed_field
    @property
    def area(self) -> float:
        return self.width * self.height

    @computed_field
    @property
    def perimeter(self) -> float:
        return 2 * (self.width + self.height)

rect = Rectangle(width=10, height=5)
print(rect.area)  # 50.0
print(rect.model_dump())
# {'width': 10.0, 'height': 5.0, 'area': 50.0, 'perimeter': 30.0}
```

### Custom Serialization

```python
from pydantic import BaseModel, field_serializer
from datetime import datetime
from decimal import Decimal

class Transaction(BaseModel):
    transaction_id: int
    amount: Decimal
    timestamp: datetime
    description: str

    @field_serializer('amount')
    def serialize_amount(self, value: Decimal) -> str:
        return f"${value:.2f}"

    @field_serializer('timestamp')
    def serialize_timestamp(self, value: datetime) -> str:
        return value.strftime('%Y-%m-%d %H:%M:%S')

transaction = Transaction(
    transaction_id=12345,
    amount=Decimal('99.99'),
    timestamp=datetime(2024, 1, 15, 14, 30),
    description='Payment for services'
)

print(transaction.model_dump())
# {'transaction_id': 12345, 'amount': '$99.99',
#  'timestamp': '2024-01-15 14:30:00', 'description': 'Payment for services'}
```

## Integration with FastAPI

Pydantic models are used directly in FastAPI:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

@app.post("/items/")
async def create_item(item: Item):
    return {"item": item, "total": item.price + (item.tax or 0)}
```

## Settings Management

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    debug: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
```

## Common Patterns

### Optional Fields

```python
class User(BaseModel):
    name: str
    email: str | None = None
    age: int | None = None
```

### Union Types

```python
from typing import Union

class Response(BaseModel):
    data: Union[str, int, dict]
    status: str
```

### Generic Models

```python
from typing import Generic, TypeVar
from pydantic import BaseModel

T = TypeVar('T')

class Response(BaseModel, Generic[T]):
    data: T
    status: str

# Usage
response = Response[User](
    data=User(id=1, name="John"),
    status="success"
)
```

## Validation Errors

```python
from pydantic import ValidationError

try:
    User(id="not_an_int", name="John", email="invalid")
except ValidationError as e:
    print(e.errors())
    # List of validation errors with location, type, and message
```

## Important Notes

- Pydantic v2 uses a Rust core for significantly better performance
- `model_dump()` replaces the old `.dict()` method (v1)
- `model_dump_json()` replaces `.json()` method (v1)
- Always use type hints for automatic validation
- Field validators receive the field value, not the full model
- Computed fields are automatically included in serialization

## Resources

- [Pydantic Documentation](https://docs.pydantic.dev)
- [Migration Guide (v1 to v2)](https://docs.pydantic.dev/latest/migration/)
- [Field Types](https://docs.pydantic.dev/latest/concepts/fields/)
- [Validators](https://docs.pydantic.dev/latest/concepts/validators/)
