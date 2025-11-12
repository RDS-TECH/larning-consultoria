# SQLModel

SQLModel is a library for interacting with SQL databases using Python with SQLAlchemy and Pydantic.

**Version**: 0.0.19+
**Official Documentation**: https://sqlmodel.tiangolo.com
**Context7 Library ID**: `/websites/sqlmodel_tiangolo`

## Overview

SQLModel combines SQLAlchemy and Pydantic to provide:

- **Type Safety**: Python type hints for database models
- **Data Validation**: Automatic validation with Pydantic
- **ORM Capabilities**: Object-relational mapping with SQLAlchemy
- **Editor Support**: Full autocompletion and type checking
- **Easy to Learn**: Intuitive API similar to FastAPI

## Basic Model Definition

Define database tables as Python classes:

```python
from typing import Optional
from sqlmodel import Field, SQLModel

class Hero(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    secret_name: str
    age: Optional[int] = Field(default=None, index=True)
```

## Database Operations

### Create Tables

```python
from sqlmodel import create_engine, SQLModel

engine = create_engine("sqlite:///database.db")

# Create all tables
SQLModel.metadata.create_all(engine)
```

### Insert Data

```python
from sqlmodel import Session

hero_1 = Hero(name="Deadpond", secret_name="Dive Wilson")

with Session(engine) as session:
    session.add(hero_1)
    session.commit()
    session.refresh(hero_1)
    print(hero_1.id)  # Auto-generated ID
```

### Query Data

```python
from sqlmodel import select

with Session(engine) as session:
    # Select all
    statement = select(Hero)
    heroes = session.exec(statement).all()

    # Filter
    statement = select(Hero).where(Hero.name == "Deadpond")
    hero = session.exec(statement).first()

    # Multiple conditions
    statement = select(Hero).where(
        Hero.age >= 35,
        Hero.age < 40
    )
    heroes = session.exec(statement).all()
```

### Update Data

```python
with Session(engine) as session:
    statement = select(Hero).where(Hero.name == "Spider-Boy")
    hero = session.exec(statement).one()

    hero.age = 16
    session.add(hero)
    session.commit()
    session.refresh(hero)
```

### Delete Data

```python
with Session(engine) as session:
    statement = select(Hero).where(Hero.name == "Spider-Boy")
    hero = session.exec(statement).one()

    session.delete(hero)
    session.commit()
```

## Relationships

### One-to-Many Relationship

```python
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel

class Team(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    headquarters: str

    heroes: List["Hero"] = Relationship(back_populates="team")

class Hero(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    secret_name: str
    age: Optional[int] = Field(default=None, index=True)

    team_id: Optional[int] = Field(default=None, foreign_key="team.id")
    team: Optional[Team] = Relationship(back_populates="heroes")
```

### Working with Relationships

```python
# Create related objects
team_preventers = Team(name="Preventers", headquarters="Sharp Tower")
hero_deadpond = Hero(
    name="Deadpond",
    secret_name="Dive Wilson",
    team=team_preventers
)

with Session(engine) as session:
    session.add(hero_deadpond)
    session.commit()

# Query relationships
with Session(engine) as session:
    statement = select(Team).where(Team.name == "Preventers")
    team = session.exec(statement).one()

    print("Preventers heroes:", team.heroes)
```

### Many-to-Many with Link Table

```python
class HeroTeamLink(SQLModel, table=True):
    team_id: Optional[int] = Field(
        default=None,
        foreign_key="team.id",
        primary_key=True
    )
    hero_id: Optional[int] = Field(
        default=None,
        foreign_key="hero.id",
        primary_key=True
    )
    is_training: bool = False

    team: "Team" = Relationship(back_populates="hero_links")
    hero: "Hero" = Relationship(back_populates="team_links")

class Team(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    headquarters: str

    hero_links: List[HeroTeamLink] = Relationship(back_populates="team")

class Hero(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    secret_name: str
    age: Optional[int] = Field(default=None, index=True)

    team_links: List[HeroTeamLink] = Relationship(back_populates="hero")
```

## Integration with FastAPI

SQLModel works seamlessly with FastAPI:

```python
from fastapi import FastAPI, Depends
from sqlmodel import Session, select
from typing import Annotated, List

app = FastAPI()

def get_session():
    with Session(engine) as session:
        yield session

@app.get("/heroes/", response_model=List[Hero])
def read_heroes(
    session: Annotated[Session, Depends(get_session)],
    offset: int = 0,
    limit: int = 100
):
    heroes = session.exec(
        select(Hero).offset(offset).limit(limit)
    ).all()
    return heroes

@app.post("/heroes/", response_model=Hero)
def create_hero(
    hero: Hero,
    session: Annotated[Session, Depends(get_session)]
):
    session.add(hero)
    session.commit()
    session.refresh(hero)
    return hero
```

## Data Models for API

Separate models for different use cases:

```python
# Base model with shared fields
class HeroBase(SQLModel):
    name: str = Field(index=True)
    secret_name: str
    age: Optional[int] = Field(default=None, index=True)

# Table model
class Hero(HeroBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

# Create model (no id)
class HeroCreate(HeroBase):
    pass

# Public model (with id)
class HeroPublic(HeroBase):
    id: int

# Update model (all fields optional)
class HeroUpdate(SQLModel):
    name: Optional[str] = None
    secret_name: Optional[str] = None
    age: Optional[int] = None
```

## Advanced Queries

### Pagination

```python
statement = select(Hero).offset(skip).limit(limit)
heroes = session.exec(statement).all()
```

### Ordering

```python
statement = select(Hero).order_by(Hero.name)
heroes = session.exec(statement).all()
```

### Joins

```python
statement = select(Hero, Team).join(Team)
results = session.exec(statement).all()

for hero, team in results:
    print(f"{hero.name} is in {team.name}")
```

## Important Notes

- Always use `Session` as a context manager for automatic cleanup
- Use `Optional[int]` for primary keys to allow auto-generation
- `table=True` parameter is required for table models
- Relationships use `Relationship()` from SQLModel, not SQLAlchemy
- Use `back_populates` for bidirectional relationships

## Resources

- [SQLModel Documentation](https://sqlmodel.tiangolo.com)
- [Tutorial](https://sqlmodel.tiangolo.com/tutorial/)
- [FastAPI Integration](https://sqlmodel.tiangolo.com/tutorial/fastapi/)
- [Relationships](https://sqlmodel.tiangolo.com/tutorial/relationship-attributes/)
